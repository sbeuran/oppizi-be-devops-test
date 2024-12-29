import { AppDataSource } from '../config/database';
import dotenv from 'dotenv';

dotenv.config();

beforeAll(async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
  } catch (error) {
    console.error('Error during test setup:', error);
    throw error;
  }
});

afterAll(async () => {
  try {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  } catch (error) {
    console.error('Error during test cleanup:', error);
    throw error;
  }
});

beforeEach(async () => {
  if (AppDataSource.isInitialized) {
    try {
      const queryRunner = AppDataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        // Disable foreign key checks
        await queryRunner.query('SET CONSTRAINTS ALL DEFERRED');
        
        // Clear tables in correct order
        await queryRunner.query('TRUNCATE TABLE tasks CASCADE');
        await queryRunner.query('TRUNCATE TABLE categories CASCADE');
        
        // Re-enable foreign key checks
        await queryRunner.query('SET CONSTRAINTS ALL IMMEDIATE');
        
        await queryRunner.commitTransaction();
      } catch (err) {
        await queryRunner.rollbackTransaction();
        throw err;
      } finally {
        await queryRunner.release();
      }
    } catch (error) {
      console.error('Error clearing test data:', error);
      throw error;
    }
  }
});

jest.setTimeout(30000); // 30 seconds 