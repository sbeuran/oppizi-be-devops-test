import { Request, Response } from 'express';
import { CategoryService } from '../services/CategoryService';
import { Category } from '../entities/Category';
import { CreateCategoryDto } from '../types/category.dto';
import { AppDataSource } from '../config/database';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

export class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService(AppDataSource.getRepository(Category));
  }

  createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const createCategoryDto = plainToInstance(CreateCategoryDto, req.body);
      const errors = await validate(createCategoryDto);
      
      if (errors.length > 0) {
        return next(errors);
      }

      const category = await this.categoryService.createCategory(createCategoryDto);
      res.status(201).json(category);
    } catch (error) {
      next(error);
    }
  };

  // ... implement other CRUD methods similar to TaskController
} 