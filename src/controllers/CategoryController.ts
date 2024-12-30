import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/CategoryService';
import { CreateCategoryDTO, UpdateCategoryDTO, CategoryFilterDTO } from '../types/category.dto';
import { AppError } from '../middlewares/errorHandler';

export class CategoryController {
  constructor(private categoryService: CategoryService) {
    // Bind methods to ensure correct 'this' context
    this.createCategory = this.createCategory.bind(this);
    this.getAllCategories = this.getAllCategories.bind(this);
    this.getCategoryById = this.getCategoryById.bind(this);
    this.updateCategory = this.updateCategory.bind(this);
    this.deleteCategory = this.deleteCategory.bind(this);
  }

  async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const categoryData: CreateCategoryDTO = req.body;
      if (!categoryData.name) {
        throw new AppError(400, 'Name is required', 'VALIDATION_ERROR');
      }
      const category = await this.categoryService.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      next(error);
    }
  }

  async getAllCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const filterDto: CategoryFilterDTO = req.query;
      const [categories, total] = await this.categoryService.getAllCategories(filterDto);
      res.json({
        data: categories,
        total,
        page: Number(filterDto.page) || 1,
        limit: Number(filterDto.limit) || 10
      });
    } catch (error) {
      next(error);
    }
  }

  async getCategoryById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const category = await this.categoryService.getCategoryById(id);
      res.json(category);
    } catch (error) {
      next(error);
    }
  }

  async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updateData: UpdateCategoryDTO = { ...req.body, id };
      const category = await this.categoryService.updateCategory(id, updateData);
      res.json(category);
    } catch (error) {
      next(error);
    }
  }

  async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await this.categoryService.deleteCategory(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
} 