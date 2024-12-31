import { DataSource } from 'typeorm';
import { Category } from '../entities/Category';
import { Task } from '../entities/Task';

export const testDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "task_management_test",
  entities: [Category, Task],
  synchronize: true,
  dropSchema: true,
  logging: false
});

export const initializeTestDB = async (): Promise<DataSource> => {
  if (!testDataSource.isInitialized) {
    await testDataSource.initialize();
    await testDataSource.synchronize(true);
    await testDataSource.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  }
  return testDataSource;
}; 