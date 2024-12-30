import "reflect-metadata";
import { DataSource } from 'typeorm';
import { Task } from '../entities/Task';
import { Category } from '../entities/Category';
import dotenv from 'dotenv';

dotenv.config();

export const testDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'task_management_test',
  entities: [Task, Category],
  synchronize: false,
  dropSchema: true,
  logging: false
});

async function resetDatabase() {
  await testDataSource.query('DROP SCHEMA IF EXISTS public CASCADE');
  await testDataSource.query('CREATE SCHEMA public');
  await testDataSource.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA public');
  await testDataSource.query('DROP TYPE IF EXISTS public.tasks_status_enum CASCADE');
  await testDataSource.synchronize(true);
}

beforeAll(async () => {
  try {
    if (testDataSource.isInitialized) {
      await testDataSource.destroy();
    }
    await testDataSource.initialize();
    await resetDatabase();
    console.log('Test database initialized');
  } catch (error) {
    console.error('Error initializing test database:', error);
    throw error;
  }
});

beforeEach(async () => {
  try {
    await resetDatabase();
    console.log('Database reset for new test');
  } catch (error) {
    console.error('Error resetting database:', error);
    throw error;
  }
});

afterAll(async () => {
  if (testDataSource.isInitialized) {
    await testDataSource.destroy();
    console.log('Test database connection closed');
  }
}); 