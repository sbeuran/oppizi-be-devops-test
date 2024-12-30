import { DataSource } from 'typeorm';
import { Task } from '../entities/Task';
import { Category } from '../entities/Category';

export const testDataSource = new DataSource({
  type: "postgres",
  host: process.env.TEST_DB_HOST || "localhost",
  port: parseInt(process.env.TEST_DB_PORT || "5432"),
  username: process.env.TEST_DB_USERNAME || "postgres",
  password: process.env.TEST_DB_PASSWORD || "postgres",
  database: "postgres",
  entities: [Task, Category],
  synchronize: true,
  dropSchema: true,
  logging: false
});

let isInitialized = false;

beforeAll(async () => {
  if (!isInitialized) {
    await testDataSource.initialize();
    
    try {
      await testDataSource.query(`DROP DATABASE IF EXISTS task_management_test`);
      await testDataSource.query(`CREATE DATABASE task_management_test`);
    } catch (error) {
      console.error('Database setup error:', error);
    }
    
    await testDataSource.destroy();
    
    testDataSource.setOptions({
      database: 'task_management_test'
    });
    
    await testDataSource.initialize();
    await testDataSource.synchronize(true);
    isInitialized = true;
  }
});

beforeEach(async () => {
  // Clear tables in correct order to handle foreign key constraints
  try {
    await testDataSource.query('TRUNCATE TABLE tasks, categories CASCADE');
  } catch (error) {
    console.error('Error clearing tables:', error);
  }
});

afterAll(async () => {
  if (isInitialized) {
    await testDataSource.destroy();
    isInitialized = false;
  }
}); 