import request from 'supertest';
import { DataSource } from 'typeorm';
import app from '../app';
import { Category } from '../entities/Category';
import { testDataSource } from './test-db';

describe('Category API', () => {
  let dataSource: DataSource;

  beforeAll(async () => {
    dataSource = testDataSource;
    await dataSource.initialize();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  beforeEach(async () => {
    // Clear the database before each test
    await dataSource.synchronize(true);
  });

  describe('POST /api/categories', () => {
    it('should create a new category', async () => {
      const response = await request(app)
        .post('/api/categories')
        .send({
          name: 'Test Category'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Test Category');
    });
  });

  describe('GET /api/categories', () => {
    beforeEach(async () => {
      await dataSource.getRepository(Category).save({
        name: 'Test Category'
      });
    });

    it('should return all categories', async () => {
      const response = await request(app).get('/api/categories');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0]).toHaveProperty('name', 'Test Category');
    });
  });
}); 