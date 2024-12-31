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
  username: "postgres",
  password: "postgres",
  database: "task_management_test",
  entities: [Category, Task],
  synchronize: true,
  logging: false,
  ssl: false
});

// Initialize database and routes
export const initializeApp = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log("Database connection initialized");
    }

    // Set up API routes
    const taskRouter = getTaskRouter(AppDataSource);
    const categoryRouter = getCategoryRouter(AppDataSource);

    app.use('/api/tasks', taskRouter);
    app.use('/api/categories', categoryRouter);

    console.log("Routes initialized");
    return app;
  } catch (error) {
    console.error('Failed to initialize app:', error);
    throw error;
  }
};

// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

export default app; 