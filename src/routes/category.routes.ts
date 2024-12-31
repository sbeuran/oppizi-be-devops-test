import { Router, Request, Response } from 'express';
import { DataSource } from 'typeorm';
import { Category } from '../entities/Category';

export const getCategoryRouter = (dataSource: DataSource) => {
  const router = Router();
  const categoryRepository = dataSource.getRepository(Category);

  router.post('/', async (req: Request, res: Response) => {
    try {
      const category = await categoryRepository.save(req.body);
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create category' });
    }
  });

  router.get('/', async (req: Request, res: Response) => {
    try {
      const categories = await categoryRepository.find();
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  });

  return router;
}; 