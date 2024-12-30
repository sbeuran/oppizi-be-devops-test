import { DataSource } from 'typeorm';
import { Task } from '../entities/Task';
import { Category } from '../entities/Category';

export const testDataSource = new DataSource({
  type: "postgres",
  host: process.env.TEST_DB_HOST || "localhost",
  port: parseInt(process.env.TEST_DB_PORT || "5432"),
  username: process.env.TEST_DB_USERNAME || "postgres",
  password: process.env.TEST_DB_PASSWORD || "postgres",
  database: process.env.TEST_DB_NAME || "task_management_test",
  entities: [Task, Category],
  synchronize: true,
  dropSchema: true,
  logging: false
});

beforeAll(async () => {
  if (!testDataSource.isInitialized) {
    await testDataSource.initialize();
  }
});

afterAll(async () => {
  if (testDataSource.isInitialized) {
    await testDataSource.destroy();
  }
}); 