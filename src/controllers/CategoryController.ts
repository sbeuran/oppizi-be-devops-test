import { Request, Response } from 'express';
import { CategoryService } from '../services/CategoryService';
import { CreateCategoryDTO, UpdateCategoryDTO } from '../types/category.dto';

export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  async createCategory(req: Request, res: Response) {
    const data: CreateCategoryDTO = req.body;
    const category = await this.categoryService.createCategory(data);
    res.status(201).json(category);
  }

  async getAllCategories(_req: Request, res: Response) {
    const categories = await this.categoryService.getAllCategories();
    res.json(categories);
  }

  async getCategoryById(req: Request, res: Response) {
    const { id } = req.params;
    const category = await this.categoryService.getCategoryById(id);
    res.json(category);
  }

  async updateCategory(req: Request, res: Response) {
    const { id } = req.params;
    const data: UpdateCategoryDTO = req.body;
    const category = await this.categoryService.updateCategory(id, data);
    res.json(category);
  }

  async deleteCategory(req: Request, res: Response) {
    const { id } = req.params;
    await this.categoryService.deleteCategory(id);
    res.status(204).send();
  }
} 