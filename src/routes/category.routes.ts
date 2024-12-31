import { Router } from 'express';
import { CategoryController } from '../controllers/CategoryController';
import { CategoryService } from '../services/CategoryService';
import { DataSource } from 'typeorm';
import { Category } from '../entities/Category';

export const createCategoryRouter = (dataSource: DataSource): Router => {
  const router = Router();
  const categoryService = new CategoryService(dataSource.getRepository(Category));
  const categoryController = new CategoryController(categoryService);

  router.post('/', categoryController.createCategory.bind(categoryController));
  router.get('/', categoryController.getAllCategories.bind(categoryController));
  router.get('/:id', categoryController.getCategoryById.bind(categoryController));
  router.patch('/:id', categoryController.updateCategory.bind(categoryController));
  router.delete('/:id', categoryController.deleteCategory.bind(categoryController));

  return router;
}; 