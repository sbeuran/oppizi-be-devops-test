import { Router, Request, Response } from 'express';
import { DataSource } from 'typeorm';
import { Task } from '../entities/Task';

export const getTaskRouter = (dataSource: DataSource) => {
  const router = Router();
  const taskRepository = dataSource.getRepository(Task);

  router.post('/', async (req: Request, res: Response) => {
    try {
      const task = await taskRepository.save(req.body);
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create task' });
    }
  });

  router.get('/', async (req: Request, res: Response) => {
    try {
      const tasks = await taskRepository.find();
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  });

  return router;
}; 