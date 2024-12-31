import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';
import { TaskService } from '../services/TaskService';
import { DataSource } from 'typeorm';
import { Task } from '../entities/Task';

export const createTaskRouter = (dataSource: DataSource): Router => {
  const router = Router();
  const taskService = new TaskService(dataSource.getRepository(Task));
  const taskController = new TaskController(taskService);

  router.post('/', taskController.createTask.bind(taskController));
  router.get('/', taskController.getTasks.bind(taskController));
  router.get('/:id', taskController.getTaskById.bind(taskController));
  router.patch('/:id', taskController.updateTask.bind(taskController));
  router.delete('/:id', taskController.deleteTask.bind(taskController));

  return router;
}; 