# Task Management API

## CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment. The pipeline consists of the following stages:

### Test Stage
- Runs on every push and pull request
- Sets up Node.js and PostgreSQL
- Installs dependencies
- Runs unit tests

### Build and Deploy Stage
- Only runs on pushes to main branch
- Builds Docker image
- Pushes image to Amazon ECR
- Updates ECS service with new image

### Required Secrets

The following secrets need to be configured in GitHub repository settings:

- `AWS_ACCESS_KEY_ID`: AWS access key for deployment
- `AWS_SECRET_ACCESS_KEY`: AWS secret key for deployment

### Setting up Secrets

1. Go to your GitHub repository
2. Navigate to Settings > Secrets and variables > Actions
3. Click "New repository secret"
4. Add the required secrets

### Security Considerations

- AWS credentials are stored as GitHub secrets
- ECR repository requires authentication
- All secrets are encrypted and only exposed during pipeline execution
- Least privilege principle is followed for AWS IAM roles 