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
  synchronize: false, // Don't auto-sync on connection
  dropSchema: true,
  logging: false
});

// Initialize function with retries
export const initializeTestDB = async (retries = 5): Promise<DataSource> => {
  for (let i = 0; i < retries; i++) {
    try {
      if (!testDataSource.isInitialized) {
        await testDataSource.initialize();
        
        // Drop all tables
        await testDataSource.dropDatabase();
        
        // Create schema
        await testDataSource.synchronize();
        
        // Create uuid extension
        await testDataSource.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
      }
      return testDataSource;
    } catch (error) {
      console.error(`Test DB initialization attempt ${i + 1} failed:`, error);
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  throw new Error('Failed to initialize test database');
}; 