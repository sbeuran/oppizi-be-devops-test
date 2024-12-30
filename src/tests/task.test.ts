import { DataSource } from 'typeorm';
import { Task } from '../entities/Task';
import { TaskService } from '../services/TaskService';
import { AppError } from '../middlewares/errorHandler';
import { CreateTaskDTO } from '../types/task.dto';

describe('TaskService', () => {
  let taskService: TaskService;
  let dataSource: DataSource;

  beforeAll(async () => {
    dataSource = new DataSource({
      type: "postgres",
      host: process.env.TEST_DB_HOST || "localhost",
      port: parseInt(process.env.TEST_DB_PORT || "5432"),
      username: process.env.TEST_DB_USERNAME || "postgres",
      password: process.env.TEST_DB_PASSWORD || "postgres",
      database: process.env.TEST_DB_NAME || "task_management_test",
      entities: [Task],
      synchronize: true,
      dropSchema: true,
      logging: false
    });

    await dataSource.initialize();
    taskService = new TaskService(dataSource.getRepository(Task));
  });

  beforeEach(async () => {
    await dataSource.getRepository(Task).clear();
  });

  afterAll(async () => {
    await dataSource.destroy();
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