import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { DataSource } from 'typeorm';
import { TaskController } from './controllers/TaskController';
import { CategoryController } from './controllers/CategoryController';
import { TaskService } from './services/TaskService';
import { CategoryService } from './services/CategoryService';
import { errorHandler } from './middlewares/errorHandler';

export function createApp(dataSource: DataSource) {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Services
  const taskService = new TaskService(dataSource.getRepository('Task'));
  const categoryService = new CategoryService(dataSource.getRepository('Category'));

  // Controllers
  const taskController = new TaskController(taskService);
  const categoryController = new CategoryController(categoryService);

  // Routes
  app.post('/api/tasks', taskController.createTask.bind(taskController));
  app.get('/api/tasks', taskController.getTasks.bind(taskController));
  app.get('/api/tasks/:id', taskController.getTaskById.bind(taskController));
  app.put('/api/tasks/:id', taskController.updateTask.bind(taskController));
  app.delete('/api/tasks/:id', taskController.deleteTask.bind(taskController));

  app.post('/api/categories', categoryController.createCategory.bind(categoryController));
  app.get('/api/categories', categoryController.getAllCategories.bind(categoryController));
  app.get('/api/categories/:id', categoryController.getCategoryById.bind(categoryController));
  app.put('/api/categories/:id', categoryController.updateCategory.bind(categoryController));
  app.delete('/api/categories/:id', categoryController.deleteCategory.bind(categoryController));

  // Error handling
  app.use(errorHandler);

  return app;
} 