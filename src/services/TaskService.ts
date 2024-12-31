import { Repository } from 'typeorm';
import { Task } from '../entities/Task';
import { CreateTaskDTO, UpdateTaskDTO, TaskStatus } from '../types/task.dto';
import { AppError } from '../middlewares/errorHandler';
import { DeepPartial } from 'typeorm';
import { Category } from '../entities/Category';

export class TaskService {
  constructor(private taskRepository: Repository<Task>) {}

  async createTask(data: CreateTaskDTO): Promise<Task> {
    if (!data.title?.trim()) {
      throw new AppError('Title is required', 400, 'TITLE_REQUIRED');
    }

    try {
      if (data.status && !['todo', 'in_progress', 'done'].includes(data.status)) {
        throw new AppError('Invalid status value', 400, 'INVALID_STATUS');
      }

      const task = this.taskRepository.create({
        title: data.title.trim(),
        description: data.description?.trim(),
        dueDate: data.dueDate,
        status: data.status || 'todo',
        category: data.categoryId ? { id: data.categoryId } as DeepPartial<Category> : null
      } as DeepPartial<Task>);

      const savedTask = await this.taskRepository.save(task);
      return this.getTaskById(savedTask.id);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error creating task', 500, 'CREATE_TASK_ERROR');
    }
  }

  async getTasks(): Promise<Task[]> {
    try {
      return await this.taskRepository.find({
        relations: ['category'],
        order: { createdAt: 'DESC' }
      });
    } catch (error) {
      throw new AppError('Error fetching tasks', 500, 'FETCH_TASKS_ERROR');
    }
  }

  async getTaskById(id: string): Promise<Task> {
    try {
      const task = await this.taskRepository.findOne({
        where: { id },
        relations: ['category']
      });

      if (!task) {
        throw new AppError('Task not found', 404, 'TASK_NOT_FOUND');
      }

      return task;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching task', 500, 'FETCH_TASK_ERROR');
    }
  }

  async updateTask(id: string, data: UpdateTaskDTO): Promise<Task> {
    const task = await this.getTaskById(id);

    if (data.title !== undefined && !data.title.trim()) {
      throw new AppError('Title cannot be empty', 400, 'TITLE_EMPTY');
    }

    if (data.status && !['todo', 'in_progress', 'done'].includes(data.status)) {
      throw new AppError('Invalid status value', 400, 'INVALID_STATUS');
    }

    try {
      const updateData = {
        ...task,
        title: data.title?.trim() ?? task.title,
        description: data.description?.trim() ?? task.description,
        dueDate: data.dueDate ?? task.dueDate,
        status: data.status ?? task.status,
        category: data.categoryId === null ? null : 
                 data.categoryId ? { id: data.categoryId } as DeepPartial<Category> : 
                 task.category
      } as DeepPartial<Task>;

      const updatedTask = await this.taskRepository.save(updateData);
      return this.getTaskById(updatedTask.id);
    } catch (error) {
      throw new AppError('Error updating task', 500, 'UPDATE_TASK_ERROR');
    }
  }

  async deleteTask(id: string): Promise<void> {
    const task = await this.getTaskById(id);
    try {
      await this.taskRepository.remove(task);
    } catch (error) {
      throw new AppError('Error deleting task', 500, 'DELETE_TASK_ERROR');
    }
  }
} 