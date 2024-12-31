import request from 'supertest';
import { DataSource } from 'typeorm';
import app from '../app';
import { AppDataSource } from '../app';
import { Category } from '../entities/Category';

describe('Category API', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
  });

  afterAll(async () => {
    await AppDataSource.destroy();
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
      await AppDataSource.getRepository(Category).save({
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