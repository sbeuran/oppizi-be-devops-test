import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { DataSource } from 'typeorm';
import { Task } from './entities/Task';
import { Category } from './entities/Category';
import { TaskController } from './controllers/TaskController';
import { CategoryController } from './controllers/CategoryController';
import { TaskService } from './services/TaskService';
import { CategoryService } from './services/CategoryService';
import { errorHandler } from './middlewares/errorHandler';

export const createApp = (dataSource: DataSource): Application => {
  const app: Application = express();

  // Middleware
  app.use(cors());
  app.use(helmet());
  app.use(express.json());

  // Health check endpoint with database check
  app.get('/health', async (_req: Request, res: Response) => {
    try {
      // Check database connection
      await dataSource.query('SELECT 1');
      res.status(200).json({ 
        status: 'healthy',
        database: 'connected',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(503).json({ 
        status: 'unhealthy',
        database: 'disconnected',
        timestamp: new Date().toISOString()
      });
    }
  });

  // Services
  const taskService = new TaskService(dataSource.getRepository(Task));
  const categoryService = new CategoryService(dataSource.getRepository(Category));

  // Controllers
  const taskController = new TaskController(taskService);
  const categoryController = new CategoryController(categoryService);

  // Routes
  app.post('/api/tasks', taskController.createTask.bind(taskController));
  app.get('/api/tasks', taskController.getTasks.bind(taskController));
  app.get('/api/tasks/:id', taskController.getTaskById.bind(taskController));
  app.patch('/api/tasks/:id', taskController.updateTask.bind(taskController));
  app.delete('/api/tasks/:id', taskController.deleteTask.bind(taskController));

  app.post('/api/categories', categoryController.createCategory.bind(categoryController));
  app.get('/api/categories', categoryController.getAllCategories.bind(categoryController));
  app.get('/api/categories/:id', categoryController.getCategoryById.bind(categoryController));
  app.patch('/api/categories/:id', categoryController.updateCategory.bind(categoryController));
  app.delete('/api/categories/:id', categoryController.deleteCategory.bind(categoryController));

  // Error handling
  app.use(errorHandler);

  return app;
}; 