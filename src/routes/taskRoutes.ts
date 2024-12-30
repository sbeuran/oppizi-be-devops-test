import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';
import { TaskService } from '../services/TaskService';
import { AppDataSource } from '../config/database';
import { Task } from '../entities/Task';

const router = Router();
const taskService = new TaskService(AppDataSource.getRepository(Task));
const taskController = new TaskController(taskService);

router.post('/', taskController.createTask);
router.get('/', taskController.getTasks);
router.get('/:id', taskController.getTaskById);
router.patch('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

export default router; 