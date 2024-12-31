import { Router } from 'express';
import { DataSource } from 'typeorm';
import { CategoryController } from '../controllers/CategoryController';
import { CategoryService } from '../services/CategoryService';

const router = Router();

export default function(dataSource: DataSource): Router {
  const categoryService = new CategoryService(dataSource.getRepository('Category'));
  const categoryController = new CategoryController(categoryService);

  router.post('/', categoryController.createCategory.bind(categoryController));
  router.get('/', categoryController.getAllCategories.bind(categoryController));
  router.get('/:id', categoryController.getCategoryById.bind(categoryController));
  router.put('/:id', categoryController.updateCategory.bind(categoryController));
  router.delete('/:id', categoryController.deleteCategory.bind(categoryController));

  return router;
} 