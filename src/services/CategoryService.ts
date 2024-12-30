import { Repository } from 'typeorm';
import { Category } from '../entities/Category';
import { CreateCategoryDTO, UpdateCategoryDTO, CategoryFilterDTO } from '../types/category.dto';
import { AppError } from '../middlewares/errorHandler';

export class CategoryService {
  constructor(private categoryRepository: Repository<Category>) {}

  async createCategory(createCategoryDto: CreateCategoryDTO): Promise<Category> {
    if (!createCategoryDto.name) {
      throw new AppError(400, 'Name is required', 'VALIDATION_ERROR');
    }

    const category = this.categoryRepository.create(createCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async getAllCategories(filterDto?: CategoryFilterDTO): Promise<[Category[], number]> {
    const query = this.categoryRepository.createQueryBuilder('category')
      .leftJoinAndSelect('category.tasks', 'tasks');

    if (filterDto) {
      const { search, page, limit, sortBy, sortOrder } = filterDto;

      if (search) {
        query.andWhere(
          '(LOWER(category.name) LIKE LOWER(:search) OR LOWER(category.description) LIKE LOWER(:search))',
          { search: `%${search}%` }
        );
      }

      if (sortBy) {
        query.orderBy(`category.${sortBy}`, sortOrder || 'ASC');
      }

      if (page && limit) {
        query.skip((page - 1) * limit).take(limit);
      }
    }

    return await query.getManyAndCount();
  }

  async getCategoryById(id: string): Promise<Category | null> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['tasks']
    });

    if (!category) {
      throw new AppError(404, 'Category not found', 'NOT_FOUND');
    }

    return category;
  }

  async updateCategory(id: string, updateCategoryDto: UpdateCategoryDTO): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id }
    });

    if (!category) {
      throw new AppError(404, 'Category not found', 'NOT_FOUND');
    }

    Object.assign(category, updateCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async deleteCategory(id: string): Promise<boolean> {
    const result = await this.categoryRepository.delete(id);
    if (result.affected === 0) {
      throw new AppError(404, 'Category not found', 'NOT_FOUND');
    }
    return true;
  }
} 