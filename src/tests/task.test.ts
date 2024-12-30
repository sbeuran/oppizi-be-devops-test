import { DataSource } from 'typeorm';
import { Task } from '../entities/Task';
import { TaskService } from '../services/TaskService';
import { AppError } from '../middlewares/errorHandler';
import { CreateTaskDTO } from '../types/task.dto';
import { testDataSource } from './setup';

describe('TaskService', () => {
  let taskService: TaskService;
  let dataSource: DataSource;

  beforeAll(async () => {
    dataSource = testDataSource;
    taskService = new TaskService(dataSource.getRepository(Task));
  });

  it('should create a task', async () => {
    const taskData: CreateTaskDTO = {
      title: "Test Task",
      description: "Test Description",
      priority: "medium",
      status: "todo"
    };

    const task = await taskService.createTask(taskData);
    expect(task.title).toBe(taskData.title);
    expect(task.description).toBe(taskData.description);
    expect(task.priority).toBe(taskData.priority);
    expect(task.status).toBe(taskData.status);
  });

  it('should throw error when creating task without title', async () => {
    const taskData = {
      description: "Test Description"
    };

    await expect(taskService.createTask(taskData as CreateTaskDTO))
      .rejects
      .toThrow(AppError);
  });
}); 