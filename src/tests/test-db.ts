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
  dropSchema: true,
  logging: false,
  migrationsRun: true,
  migrations: [],
  extra: {
    max: 1 // Limit pool size for tests
  }
});

// Initialize function with retries
export const initializeTestDB = async (retries = 5): Promise<DataSource> => {
  for (let i = 0; i < retries; i++) {
    try {
      if (!testDataSource.isInitialized) {
        await testDataSource.initialize();
      }
      // Clear database
      await testDataSource.synchronize(true);
      return testDataSource;
    } catch (error) {
      console.error(`Test DB initialization attempt ${i + 1} failed:`, error);
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  throw new Error('Failed to initialize test database');
}; 