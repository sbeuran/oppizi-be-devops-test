import request from 'supertest';
import { DataSource } from 'typeorm';
import app, { initializeApp } from '../app';
import { Task } from '../entities/Task';
import { Category } from '../entities/Category';
import { testDataSource, initializeTestDB } from './test-db';

describe('Task API', () => {
  let dataSource: DataSource;
  let categoryId: string;

  beforeAll(async () => {
    dataSource = await initializeTestDB();
    await initializeApp(); // Make sure this completes before tests run
  });

  afterAll(async () => {
    if (dataSource?.isInitialized) {
      await dataSource.destroy();
    }
  });

  beforeEach(async () => {
    await dataSource.synchronize(true);
    const category = await dataSource.getRepository(Category).save({
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
      await dataSource.getRepository(Task).save({
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