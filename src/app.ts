import express, { Request, Response, NextFunction, RequestHandler } from 'express';
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
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Category, Task],
  synchronize: true,
  logging: process.env.NODE_ENV !== 'production',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

let isInitialized = false;

// Initialize database and set up routes
export const initializeApp = async () => {
  if (!isInitialized) {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log("Database connection initialized");
    }
    
    // Set up API routes
    app.use('/api/tasks', getTaskRouter(AppDataSource));
    app.use('/api/categories', getCategoryRouter(AppDataSource));
    
    isInitialized = true;
  }
  return app;
};

// Health check route
const healthCheck: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const isConnected = AppDataSource.isInitialized;
    if (!isConnected) {
      res.status(500).json({ 
        status: 'error',
        message: 'Database connection not initialized'
      });
      return;
    }
    res.status(200).json({ 
      status: 'ok',
      database: 'connected'
    });
  } catch (error) {
    console.error('Health check failed:', error);
    if (error instanceof Error) {
      res.status(500).json({ 
        status: 'error',
        message: error.message 
      });
    } else {
      res.status(500).json({ 
        status: 'error',
        message: 'An unknown error occurred' 
      });
    }
  }
};

app.get('/health', healthCheck);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

export default app; 