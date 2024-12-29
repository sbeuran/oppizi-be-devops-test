import { Repository } from 'typeorm';
import { Category } from '../entities/Category';
import { CreateCategoryDto, UpdateCategoryDto } from '../types/category.dto';
import { NotFoundException, BadRequestException } from '../utils/errors';

export class CategoryService {
  constructor(private categoryRepository: Repository<Category>) {}

  async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const existingCategory = await this.categoryRepository.findOne({
      where: { name: createCategoryDto.name }
    });

    if (existingCategory) {
      throw new BadRequestException(`Category with name ${createCategoryDto.name} already exists`);
    }

    const category = this.categoryRepository.create(createCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async getAllCategories(): Promise<Category[]> {
    return await this.categoryRepository.find();
  }

  async getCategoryById(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({ 
      where: { id },
      relations: ['tasks']
    });
    
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.getCategoryById(id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    Object.assign(category, updateCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async deleteCategory(id: string): Promise<void> {
    const result = await this.categoryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
  }
} 