import { DataSource } from 'typeorm';
import { Category } from '../entities/Category';
import { CategoryService } from '../services/CategoryService';
import { AppError } from '../middlewares/errorHandler';
import { CreateCategoryDTO } from '../types/category.dto';
import { testDataSource } from './setup';

describe('CategoryService', () => {
  let categoryService: CategoryService;
  let dataSource: DataSource;

  beforeAll(async () => {
    dataSource = await testDataSource.initialize();
    categoryService = new CategoryService(dataSource.getRepository(Category));
  });

  beforeEach(async () => {
    await dataSource.getRepository(Category).clear();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it('should create a category', async () => {
    const categoryData: CreateCategoryDTO = {
      name: "Test Category",
      description: "Test Description"
    };

    const category = await categoryService.createCategory(categoryData);
    expect(category.name).toBe(categoryData.name);
    expect(category.description).toBe(categoryData.description);
  });

  it('should throw error when creating category without name', async () => {
    const categoryData = {
      description: "Test Description"
    };

    await expect(categoryService.createCategory(categoryData as CreateCategoryDTO))
      .rejects
      .toThrow(AppError);
  });
}); 