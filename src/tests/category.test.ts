import { Category } from '../entities/Category';
import { CategoryService } from '../services/CategoryService';
import { AppError } from '../middlewares/errorHandler';
import { CreateCategoryDTO } from '../types/category.dto';
import { testDataSource } from './setup';

describe('CategoryService', () => {
  let categoryService: CategoryService;

  beforeAll(async () => {
    // Wait for database to be ready
    if (!testDataSource.isInitialized) {
      await testDataSource.initialize();
    }
    categoryService = new CategoryService(testDataSource.getRepository(Category));
  });

  it('should create a category', async () => {
    const categoryData: CreateCategoryDTO = {
      name: "Test Category",
      description: "Test Description"
    };

    const category = await categoryService.createCategory(categoryData);
    expect(category).toBeDefined();
    expect(category.id).toBeDefined();
    expect(category.name).toBe(categoryData.name);
    expect(category.description).toBe(categoryData.description);
  });

  it('should throw error when creating category without name', async () => {
    const categoryData = {
      description: "Test Description"
    } as CreateCategoryDTO;

    await expect(async () => {
      await categoryService.createCategory(categoryData);
    }).rejects.toThrow(AppError);
  });
}); 