import { Router } from 'express';
import { DataSource } from 'typeorm';
import { Category } from '../entities/Category';

export const getCategoryRouter = (dataSource: DataSource): Router => {
  const router = Router();
  const categoryRepository = dataSource.getRepository(Category);
  
  // ... rest of your route handlers
  
  return router;
}; 