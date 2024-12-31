import { DataSource } from 'typeorm';
import { Category } from '../entities/Category';
import { Task } from '../entities/Task';

export const testDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: "postgres",
  password: "postgres",
  database: "task_management_test",
  entities: [Category, Task],
  synchronize: true,
  dropSchema: true,
  logging: false
});

export const initializeTestDB = async (): Promise<DataSource> => {
  try {
    if (!testDataSource.isInitialized) {
      await testDataSource.initialize();
      await testDataSource.synchronize(true);
      await testDataSource.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    }
    return testDataSource;
  } catch (error) {
    console.error('Failed to initialize test database:', error);
    throw error;
  }
}; 