# Task Management API

![CI/CD](https://github.com/sbeuran/oppizi-be-devops-test/actions/workflows/ci-cd.yml/badge.svg)

## Technical Stack

### Backend
- Node.js with TypeScript
- Express.js for REST API
- TypeORM for database operations
- PostgreSQL for data storage
- Jest & Supertest for testing

### AWS Infrastructure
- ECS Fargate for container orchestration
- RDS PostgreSQL for database
- ECR for container registry
- CloudFormation for infrastructure as code
- VPC with public subnets
- Security Groups for network access control

## API Endpoints

Base URL: `http://18.201.39.167:3000`

### Health Check
- `GET /health` - Check API status

### Categories
- `GET /api/categories` - List all categories
- `POST /api/categories` - Create a new category
- `GET /api/categories/:id` - Get category by ID
- `PUT /api/categories/:id` - Update a category
- `DELETE /api/categories/:id` - Delete a category

### Tasks
- `GET /api/tasks` - List all tasks
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `GET /api/tasks/category/:categoryId` - Get tasks by category

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
   DB_NAME=task_management_test
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

## Testing the API

### Using Postman
1. Import the provided Postman collection:
   ```bash
   postman/task-management-api.postman_collection.json
   ```

   The collection is available in the `postman` directory of this repository.

2. Test sequence:
   - Health Check: Verify API is running
   - Create Category: POST a new category
   - List Categories: Verify category creation
   - Create Task: POST a new task using category ID
   - List Tasks: Verify task creation

### Using cURL

1. Health Check:
   ```bash
   curl http://18.201.39.167:3000/health
   ```

2. Create Category:
   ```bash
   curl -X POST http://18.201.39.167:3000/api/categories \
     -H "Content-Type: application/json" \
     -d '{"name": "Work Tasks"}'
   ```

3. List Categories:
   ```bash
   curl http://18.201.39.167:3000/api/categories
   ```

4. Create Task:
   ```bash
   curl -X POST http://18.201.39.167:3000/api/tasks \
     -H "Content-Type: application/json" \
     -d '{
       "title": "Deploy API",
       "description": "Complete API deployment",
       "dueDate": "2024-12-31",
       "categoryId": "<CATEGORY_ID>"
     }'
   ```

5. List Tasks:
   ```bash
   curl http://18.201.39.167:3000/api/tasks
   ```

## AWS Services Configuration

### RDS PostgreSQL
- Instance: db.t3.micro
- Database: task_management_db
- Port: 5432
- Endpoint: task-management-api-database-qvykny1mubpt.c5cgs8esmnq6.eu-west-1.rds.amazonaws.com

### ECS Fargate
- CPU: 256 (.25 vCPU)
- Memory: 512MB
- Task Definition: task-management-api-task:5
- Service: task-management-api
- Cluster: task-management-api-prod-eu-west-1

### Security Groups
- Container SG: sg-0b309820533bcfef7 (allows port 3000)
- Database SG: sg-0dac8e7d589bf5c5c (allows port 5432)

## Entity Structure

### Category
```typescript
{
  id: string;        // UUID
  name: string;      // Category name
  tasks: Task[];     // Related tasks
}
```

### Task
```typescript
{
  id: string;        // UUID
  title: string;     // Task title
  description: string; // Task description
  dueDate: Date;     // Due date
  categoryId: string; // Related category UUID
}
```

Last updated: Sun Dec 31 13:30:00 WET 2024
