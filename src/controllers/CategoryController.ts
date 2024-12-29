import { Request, Response } from 'express';
import { CategoryService } from '../services/CategoryService';
import { Category } from '../entities/Category';
import { AppDataSource } from '../config/database';
import { CreateCategoryDto, UpdateCategoryDto } from '../types/category.dto';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

export class CategoryController {
  private readonly categoryService: CategoryService;

  constructor(dataSource = AppDataSource) {
    this.categoryService = new CategoryService(dataSource.getRepository(Category));
  }

  public createCategory = async (req: Request, res: Response): Promise<Response> => {
    try {
      const createCategoryDto = plainToInstance(CreateCategoryDto, req.body);
      const errors = await validate(createCategoryDto);
      
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const category = await this.categoryService.createCategory(createCategoryDto);
      return res.status(201).json(category);
    } catch (error) {
      console.error('Error creating category:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  public getAllCategories = async (_req: Request, res: Response): Promise<Response> => {
    try {
      const categories = await this.categoryService.getAllCategories();
      return res.json(categories);
    } catch (error) {
      console.error('Error getting categories:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  public getCategoryById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const category = await this.categoryService.getCategoryById(req.params.id);
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      return res.json(category);
    } catch (error) {
      console.error('Error getting category:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  public updateCategory = async (req: Request, res: Response): Promise<Response> => {
    try {
      const updateCategoryDto = plainToInstance(UpdateCategoryDto, req.body);
      const errors = await validate(updateCategoryDto);
      
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const category = await this.categoryService.updateCategory(req.params.id, updateCategoryDto);
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      return res.json(category);
    } catch (error) {
      console.error('Error updating category:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  public deleteCategory = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.categoryService.deleteCategory(req.params.id);
      if (!result) {
        return res.status(404).json({ error: 'Category not found' });
      }
      return res.status(204).send();
    } catch (error) {
      console.error('Error deleting category:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
} 