#!/bin/bash

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# AWS Configuration
AWS_REGION="eu-west-1"
AWS_ACCOUNT_ID="463470937931"
ECR_REPOSITORY="task-api"
STACK_NAME="task-api-stack"

# Log function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}" >&2
    exit 1
}

# Check and delete failed stack
check_stack() {
    local stack_status
    stack_status=$(aws cloudformation describe-stacks \
        --stack-name "$STACK_NAME" \
        --query 'Stacks[0].StackStatus' \
        --output text 2>/dev/null || echo "DOES_NOT_EXIST")

    if [ "$stack_status" = "ROLLBACK_COMPLETE" ]; then
        warn "Found stack in ROLLBACK_COMPLETE state. Deleting..."
        aws cloudformation delete-stack --stack-name "$STACK_NAME"
        aws cloudformation wait stack-delete-complete --stack-name "$STACK_NAME"
        log "Stack deleted successfully"
    elif [ "$stack_status" != "DOES_NOT_EXIST" ]; then
        log "Stack exists in $stack_status state"
    fi
}

# Add this function after the check_stack function
create_ecr_repository() {
    log "Checking ECR repository..."
    if ! aws ecr describe-repositories --repository-names "$ECR_REPOSITORY" 2>/dev/null; then
        log "Creating ECR repository..."
        aws ecr create-repository \
            --repository-name "$ECR_REPOSITORY" \
            --image-scanning-configuration scanOnPush=true \
            --encryption-configuration encryptionType=AES256
        
        # Add lifecycle policy to clean up untagged images
        aws ecr put-lifecycle-policy \
            --repository-name "$ECR_REPOSITORY" \
            --lifecycle-policy-text '{
                "rules": [{
                    "rulePriority": 1,
                    "description": "Remove untagged images",
                    "selection": {
                        "tagStatus": "untagged",
                        "countType": "sinceImagePushed",
                        "countUnit": "days",
                        "countNumber": 1
                    },
                    "action": {
                        "type": "expire"
                    }
                }]
            }'
    else
        log "ECR repository already exists"
    fi
}

# Add this function to check available PostgreSQL versions
check_postgres_versions() {
    log "Checking available PostgreSQL versions..."
    aws rds describe-db-engine-versions \
        --engine postgres \
        --query 'DBEngineVersions[].EngineVersion' \
        --output table
}

# Deploy infrastructure
deploy_infrastructure() {
    log "Deploying CloudFormation stack..."
    
    # Check and clean up failed stack
    check_stack
    
    # Check if stack exists
    local stack_exists
    stack_exists=$(aws cloudformation describe-stacks \
        --stack-name "$STACK_NAME" 2>/dev/null || echo "false")

    if [ "$stack_exists" = "false" ]; then
        log "Creating new stack..."
        if ! aws cloudformation create-stack \
            --stack-name "$STACK_NAME" \
            --template-body file://deployment/aws/cloudformation.yml \
            --capabilities CAPABILITY_NAMED_IAM \
            --parameters \
                ParameterKey=Environment,ParameterValue=production \
                ParameterKey=DBPassword,ParameterValue=Forzamilan2!samuel \
            --on-failure DO_NOTHING; then
            error "Failed to create stack"
        fi

        log "Waiting for stack creation to complete..."
        if ! aws cloudformation wait stack-create-complete --stack-name "$STACK_NAME"; then
            log "Stack creation failed. Fetching detailed error messages..."
            aws cloudformation describe-stack-events \
                --stack-name "$STACK_NAME" \
                --query 'StackEvents[?ResourceStatus==`CREATE_FAILED`].[LogicalResourceId,ResourceStatusReason]' \
                --output table
            
            # Show available PostgreSQL versions if database creation failed
            check_postgres_versions
            error "Stack creation failed"
        fi
    else
        log "Updating existing stack..."
        # Create change set
        CHANGE_SET_NAME="${STACK_NAME}-changeset-$(date +%s)"
        
        if ! aws cloudformation create-change-set \
            --stack-name "$STACK_NAME" \
            --template-body file://deployment/aws/cloudformation.yml \
            --capabilities CAPABILITY_NAMED_IAM \
            --change-set-name "$CHANGE_SET_NAME" \
            --parameters \
                ParameterKey=Environment,ParameterValue=production \
                ParameterKey=DBPassword,ParameterValue=Forzamilan2!samuel > /dev/null; then
            error "Failed to create change set"
        fi

        # Wait for change set to be created
        log "Waiting for change set to be created..."
        aws cloudformation wait change-set-create-complete \
            --stack-name "$STACK_NAME" \
            --change-set-name "$CHANGE_SET_NAME" || {
            aws cloudformation describe-change-set \
                --stack-name "$STACK_NAME" \
                --change-set-name "$CHANGE_SET_NAME"
            error "Change set creation failed"
        }

        # Execute change set
        log "Executing change set..."
        if ! aws cloudformation execute-change-set \
            --stack-name "$STACK_NAME" \
            --change-set-name "$CHANGE_SET_NAME"; then
            error "Failed to execute change set"
        fi

        # Wait for stack update to complete
        log "Waiting for stack update to complete..."
        if ! aws cloudformation wait stack-update-complete --stack-name "$STACK_NAME"; then
            aws cloudformation describe-stack-events \
                --stack-name "$STACK_NAME" \
                --query 'StackEvents[?ResourceStatus==`UPDATE_FAILED`].[LogicalResourceId,ResourceStatusReason]' \
                --output table
            error "Stack update failed"
        fi
    fi

    log "Stack deployment completed successfully"
}

# Main execution
main() {
    # Configure AWS CLI
    aws configure set aws_access_key_id "${AWS_ACCESS_KEY_ID}"
    aws configure set aws_secret_access_key "${AWS_SECRET_ACCESS_KEY}"
    aws configure set region "$AWS_REGION"
    aws configure set output json

    # Create ECR repository if it doesn't exist
    create_ecr_repository

    # Build and push Docker image
    log "Building Docker image..."
    docker build -t "$ECR_REPOSITORY" .

    log "Logging into ECR..."
    aws ecr get-login-password --region "$AWS_REGION" | docker login --username AWS --password-stdin "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"

    log "Tagging and pushing image..."
    docker tag "$ECR_REPOSITORY":latest "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY":latest
    docker push "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY":latest

    deploy_infrastructure

    # Get and display the endpoint
    API_ENDPOINT=$(aws cloudformation describe-stacks \
        --stack-name "$STACK_NAME" \
        --query 'Stacks[0].Outputs[?OutputKey==`ApiEndpoint`].OutputValue' \
        --output text)

    log "Deployment complete!"
    log "API Endpoint: $API_ENDPOINT"
}

main "$@" 