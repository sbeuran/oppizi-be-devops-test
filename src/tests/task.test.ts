import request from 'supertest';
import { DataSource } from 'typeorm';
import app from '../app';
import { AppDataSource } from '../app';
import { Task } from '../entities/Task';
import { Category } from '../entities/Category';

describe('Task API', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  let categoryId: string;

  beforeEach(async () => {
    const category = await AppDataSource.getRepository(Category).save({
      name: 'Test Category'
    });
    categoryId = category.id;
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({
          title: 'Test Task',
          description: 'Test Description',
          dueDate: '2024-12-31',
          categoryId
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Test Task');
    });
  });

  describe('GET /api/tasks', () => {
    beforeEach(async () => {
      await AppDataSource.getRepository(Task).save({
        title: 'Test Task',
        description: 'Test Description',
        dueDate: new Date('2024-12-31'),
        category: { id: categoryId }
      });
    });

    it('should return all tasks', async () => {
      const response = await request(app).get('/api/tasks');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0]).toHaveProperty('title', 'Test Task');
    });
  });
}); 