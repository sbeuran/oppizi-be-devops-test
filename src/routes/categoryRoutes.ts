import { Router } from 'express';
import { CategoryController } from '../controllers/CategoryController';
import { CategoryService } from '../services/CategoryService';
import { AppDataSource } from '../config/database';
import { Category } from '../entities/Category';

const router = Router();
const categoryService = new CategoryService(AppDataSource.getRepository(Category));
const categoryController = new CategoryController(categoryService);

router.post('/', categoryController.createCategory);
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.patch('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

export default router; 