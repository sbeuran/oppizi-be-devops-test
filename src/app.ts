import express from 'express';
import cors from 'cors';
import { DataSource } from 'typeorm';
import { Task } from './entities/Task';
import { Category } from './entities/Category';
import { TaskController } from './controllers/TaskController';
import { CategoryController } from './controllers/CategoryController';
import { TaskService } from './services/TaskService';
import { CategoryService } from './services/CategoryService';
import { errorHandler } from './middlewares/errorHandler';

export const createApp = (dataSource: DataSource) => {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Services
  const taskService = new TaskService(dataSource.getRepository(Task));
  const categoryService = new CategoryService(dataSource.getRepository(Category));

  // Controllers
  const taskController = new TaskController(taskService);
  const categoryController = new CategoryController(categoryService);

  // Routes
  app.post('/tasks', taskController.createTask);
  app.get('/tasks', taskController.getTasks);
  app.get('/tasks/:id', taskController.getTaskById);
  app.patch('/tasks/:id', taskController.updateTask);
  app.delete('/tasks/:id', taskController.deleteTask);

  app.post('/categories', categoryController.createCategory);
  app.get('/categories', categoryController.getAllCategories);
  app.get('/categories/:id', categoryController.getCategoryById);
  app.patch('/categories/:id', categoryController.updateCategory);
  app.delete('/categories/:id', categoryController.deleteCategory);

  // Error handling
  app.use(errorHandler);

  return app;
}; 