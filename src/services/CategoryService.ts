import { Repository } from 'typeorm';
import { Category } from '../entities/Category';
import { CreateCategoryDTO, UpdateCategoryDTO } from '../types/category.dto';
import { AppError } from '../middlewares/errorHandler';

export class CategoryService {
  constructor(private categoryRepository: Repository<Category>) {}

  async createCategory(data: CreateCategoryDTO): Promise<Category> {
    if (!data.name?.trim()) {
      throw new AppError('Name is required', 400);
    }

    const normalizedName = data.name.trim();

    try {
      const existingCategory = await this.categoryRepository.findOne({
        where: { name: normalizedName }
      });

      if (existingCategory) {
        throw new AppError('Category with this name already exists', 400);
      }

      const category = this.categoryRepository.create({ name: normalizedName });
      await this.categoryRepository.save(category);
      return this.getCategoryById(category.id);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error creating category', 500);
    }
  }

  async getAllCategories(): Promise<Category[]> {
    try {
      return await this.categoryRepository.find({
        relations: ['tasks'],
        order: { createdAt: 'DESC' }
      });
    } catch (error) {
      throw new AppError('Error fetching categories', 500);
    }
  }

  async getCategoryById(id: string): Promise<Category> {
    try {
      const category = await this.categoryRepository.findOne({
        where: { id },
        relations: ['tasks']
      });

      if (!category) {
        throw new AppError('Category not found', 404);
      }

      return category;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching category', 500);
    }
  }

  async updateCategory(id: string, data: UpdateCategoryDTO): Promise<Category> {
    if (data.name !== undefined && !data.name.trim()) {
      throw new AppError('Name cannot be empty', 400);
    }

    const category = await this.getCategoryById(id);

    if (!data.name) {
      return category;
    }

    const normalizedName = data.name.trim();

    try {
      const existingCategory = await this.categoryRepository.findOne({
        where: { name: normalizedName }
      });

      if (existingCategory && existingCategory.id !== id) {
        throw new AppError('Category with this name already exists', 400);
      }

      category.name = normalizedName;
      await this.categoryRepository.save(category);
      return this.getCategoryById(id);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error updating category', 500);
    }
  }

  async deleteCategory(id: string): Promise<void> {
    const category = await this.getCategoryById(id);
    try {
      await this.categoryRepository.remove(category);
    } catch (error) {
      throw new AppError('Error deleting category', 500);
    }
  }
} 