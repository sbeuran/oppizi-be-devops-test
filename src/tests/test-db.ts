import { DataSource } from 'typeorm';
import { Category } from '../entities/Category';
import { Task } from '../entities/Task';

export const testDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "task_management_test",
  entities: [Category, Task],
  synchronize: true,
  dropSchema: true // This ensures a clean database for each test run
}); 