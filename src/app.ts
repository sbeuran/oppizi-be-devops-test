import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { DataSource } from 'typeorm';
import { Category } from './entities/Category';
import { Task } from './entities/Task';
import { getTaskRouter } from './routes/task.routes';
import { getCategoryRouter } from './routes/category.routes';

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.NODE_ENV === 'test' ? 'postgres' : process.env.DB_USERNAME,
  password: process.env.NODE_ENV === 'test' ? 'postgres' : process.env.DB_PASSWORD,
  database: process.env.NODE_ENV === 'test' ? 'task_management_test' : process.env.DB_NAME,
  entities: [Category, Task],
  synchronize: true,
  logging: process.env.NODE_ENV !== 'production',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

let routesInitialized = false;

// Initialize database and routes
export const initializeApp = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log("Database connection initialized");
    }

    // Set up API routes
    app.use('/api/tasks', getTaskRouter(AppDataSource));
    app.use('/api/categories', getCategoryRouter(AppDataSource));
    
    return app;
  } catch (error) {
    console.error('Failed to initialize app:', error);
    throw error;
  }
};

// Health check route
app.get('/health', (req: Request, res: Response) => {
  const isConnected = AppDataSource.isInitialized;
  res.status(isConnected ? 200 : 500).json({ 
    status: isConnected ? 'ok' : 'error',
    database: isConnected ? 'connected' : 'disconnected'
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

export default app; 