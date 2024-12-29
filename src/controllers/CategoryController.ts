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

  createCategory = async (req: Request, res: Response): Promise<Response> => {
    try {
      const createCategoryDto = plainToInstance(CreateCategoryDto, req.body);
      const errors = await validate(createCategoryDto);
      
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const category = await this.categoryService.createCategory(createCategoryDto);
      return res.status(201).json(category);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  // ... implement other CRUD methods similar to TaskController
} 