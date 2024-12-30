import { Router } from 'express';
import { CategoryController } from '../controllers/CategoryController';
import { CategoryService } from '../services/CategoryService';
import { getRepository } from 'typeorm';
import { Category } from '../entities/Category';

const router = Router();
const categoryService = new CategoryService(getRepository(Category));
const categoryController = new CategoryController(categoryService);

router.post('/', categoryController.createCategory);
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.patch('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

export const categoryRouter = router; 