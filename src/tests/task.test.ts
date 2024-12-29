import request from 'supertest';
import app from '../app';
import { AppDataSource } from '../config/database';
import { Task, TaskStatus } from '../entities/Task';
import { Category } from '../entities/Category';
import { SortOrder } from '../types/task.dto';
import { testDataSource } from './setup';

describe('Task API', () => {
  const taskRepository = testDataSource.getRepository(Task);

  beforeEach(async () => {
    await taskRepository.clear(); // Clear tasks before each test
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({
          title: 'Test Task',
          description: 'Test Description'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Test Task');
      expect(response.body.status).toBe(TaskStatus.PENDING);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({});

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/tasks', () => {
    it('should return all tasks', async () => {
      // Create test task
      await request(app)
        .post('/api/tasks')
        .send({
          title: 'Test Task',
          description: 'Test Description'
        });

      const response = await request(app).get('/api/tasks');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.tasks)).toBe(true);
      expect(response.body.tasks.length).toBeGreaterThan(0);
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('limit');
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update a task', async () => {
      // Create a task first
      const createResponse = await request(app)
        .post('/api/tasks')
        .send({
          title: 'Test Task',
          description: 'Test Description'
        });

      const taskId = createResponse.body.id;

      // Update the task
      const updateResponse = await request(app)
        .put(`/api/tasks/${taskId}`)
        .send({
          status: TaskStatus.COMPLETED
        });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.status).toBe(TaskStatus.COMPLETED);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task', async () => {
      // Create a task first
      const createResponse = await request(app)
        .post('/api/tasks')
        .send({
          title: 'Test Task',
          description: 'Test Description'
        });

      const taskId = createResponse.body.id;

      // Delete the task
      const deleteResponse = await request(app)
        .delete(`/api/tasks/${taskId}`);

      expect(deleteResponse.status).toBe(204);

      // Verify task is deleted
      const getResponse = await request(app)
        .get(`/api/tasks/${taskId}`);
      expect(getResponse.status).toBe(404);
    });
  });

  describe('GET /api/tasks with filters', () => {
    beforeEach(async () => {
      // Create test tasks
      const tasks = [
        { title: 'Test Task 1', description: 'First task', status: TaskStatus.PENDING },
        { title: 'Test Task 2', description: 'Second task', status: TaskStatus.IN_PROGRESS },
        { title: 'Another Task', description: 'Third task', status: TaskStatus.COMPLETED }
      ];

      for (const task of tasks) {
        await request(app)
          .post('/api/tasks')
          .send(task);
      }
    });

    it('should filter tasks by status', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .query({ status: TaskStatus.PENDING });

      expect(response.status).toBe(200);
      expect(response.body.tasks.length).toBe(1);
      expect(response.body.tasks[0].status).toBe(TaskStatus.PENDING);
    });

    it('should search tasks by title or description', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .query({ search: 'Second' });

      expect(response.status).toBe(200);
      expect(response.body.tasks.length).toBe(1);
      expect(response.body.tasks[0].title).toBe('Test Task 2');
    });

    it('should paginate results', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .query({ page: '1', limit: '2' });

      expect(response.status).toBe(200);
      expect(response.body.tasks.length).toBe(2);
      expect(response.body.total).toBe(3);
      expect(response.body.page).toBe(1);
      expect(response.body.limit).toBe(2);
    });

    it('should sort tasks by title ascending', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .query({ 
          sortBy: 'title',
          sortOrder: SortOrder.ASC 
        });

      expect(response.status).toBe(200);
      expect(response.body.tasks[0].title).toBe('Another Task');
      expect(response.body.tasks[1].title).toBe('Test Task 1');
      expect(response.body.tasks[2].title).toBe('Test Task 2');
    });

    it('should sort tasks by status descending', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .query({ 
          sortBy: 'status',
          sortOrder: SortOrder.DESC 
        });

      expect(response.status).toBe(200);
      expect(response.body.tasks[0].status).toBe(TaskStatus.COMPLETED);
      expect(response.body.tasks[1].status).toBe(TaskStatus.IN_PROGRESS);
      expect(response.body.tasks[2].status).toBe(TaskStatus.PENDING);
    });
  });
}); 