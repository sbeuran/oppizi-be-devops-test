import "reflect-metadata";
import { DataSource } from 'typeorm';
import { Task } from '../entities/Task';
import { Category } from '../entities/Category';
import dotenv from 'dotenv';

dotenv.config();

const testDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'task_management',
  entities: [Task, Category],
  synchronize: true,
  dropSchema: true,
  logging: false
});

beforeAll(async () => {
  try {
    await testDataSource.initialize();
    await testDataSource.synchronize(true);
  } catch (error) {
    console.error('Error during test setup:', error);
    throw error;
  }
});

beforeEach(async () => {
  try {
    await testDataSource.synchronize(true); // Reset database before each test
  } catch (error) {
    console.error('Error resetting database:', error);
    throw error;
  }
});

afterAll(async () => {
  if (testDataSource.isInitialized) {
    await testDataSource.destroy();
  }
});

export { testDataSource }; 