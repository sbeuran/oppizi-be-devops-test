import { Router } from 'express';
import { DataSource } from 'typeorm';
import { TaskController } from '../controllers/TaskController';
import { TaskService } from '../services/TaskService';

const router = Router();

export default function(dataSource: DataSource): Router {
  const taskService = new TaskService(dataSource.getRepository('Task'));
  const taskController = new TaskController(taskService);

  router.post('/', taskController.createTask.bind(taskController));
  router.get('/', taskController.getTasks.bind(taskController));
  router.get('/:id', taskController.getTaskById.bind(taskController));
  router.put('/:id', taskController.updateTask.bind(taskController));
  router.delete('/:id', taskController.deleteTask.bind(taskController));

  return router;
} 