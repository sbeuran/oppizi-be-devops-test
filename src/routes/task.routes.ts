import { Router } from 'express';
import { DataSource } from 'typeorm';
import { Task } from '../entities/Task';

export const getTaskRouter = (dataSource: DataSource): Router => {
  const router = Router();
  const taskRepository = dataSource.getRepository(Task);
  
  // ... rest of your route handlers
  
  return router;
}; 