# Task Management API

![CI/CD](https://github.com/sbeuran/oppizi-be-devops-test/actions/workflows/ci-cd.yml/badge.svg)

## CI/CD Pipeline

This project is automatically deployed to AWS using GitHub Actions. The pipeline:
1. Runs tests on every push and PR
2. On successful merge to main:
   - Deploys infrastructure using CloudFormation
   - Builds and pushes Docker image to ECR
   - Updates ECS service

### Required Secrets

Set these in GitHub repository settings (Settings > Secrets and variables > Actions):
- `AWS_ACCESS_KEY_ID`: AWS access key
- `AWS_SECRET_ACCESS_KEY`: AWS secret key
- `DB_PASSWORD`: Database password

### Infrastructure

The application is deployed on AWS with:
- ECS Fargate for container orchestration
- RDS PostgreSQL for database
- Application Load Balancer for traffic distribution
- VPC with public and private subnets
- ECR for container registry

## Local Development

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Update the .env file with your credentials:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=postgres
   DB_NAME=task_management
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Run tests:
   ```bash
   npm test
   ```

5. Start development server:
   ```bash
   npm run dev
   ``` 