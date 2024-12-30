import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { createApp } from './app';
import { Task } from './entities/Task';
import { Category } from './entities/Category';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 3000;
const MAX_RETRIES = 5;
const RETRY_DELAY = 5000; // 5 seconds

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'task_management',
  entities: [Task, Category],
  synchronize: true,
  logging: process.env.NODE_ENV !== 'production'
});

const initializeWithRetry = async (retryCount = 0) => {
  try {
    await AppDataSource.initialize();
    console.log('Database connection established');
    
    const app = createApp(AppDataSource);
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error(`Database connection attempt ${retryCount + 1} failed:`, error);
    
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying in ${RETRY_DELAY/1000} seconds...`);
      setTimeout(() => initializeWithRetry(retryCount + 1), RETRY_DELAY);
    } else {
      console.error('Max retries reached. Exiting...');
      process.exit(1);
    }
  }
};

initializeWithRetry();

export default AppDataSource; 