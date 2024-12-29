import { Repository } from 'typeorm';
import { Task, TaskStatus } from '../entities/Task';
import { CreateTaskDto, UpdateTaskDto, TaskFilterDto } from '../types/task.dto';

export class TaskService {
  constructor(private taskRepository: Repository<Task>) {}

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      const task = this.taskRepository.create({
        title: createTaskDto.title,
        description: createTaskDto.description,
        status: createTaskDto.status || TaskStatus.PENDING
      });
      return await this.taskRepository.save(task);
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  async getAllTasks(filters: TaskFilterDto): Promise<{ tasks: Task[]; total: number; page: number; limit: number }> {
    try {
      const { status, search, page = 1, limit = 10, sortBy, sortOrder } = filters;
      const skip = (page - 1) * limit;

      const queryBuilder = this.taskRepository.createQueryBuilder('task');

      if (status) {
        queryBuilder.andWhere('task.status = :status', { status });
      }

      if (search) {
        queryBuilder.andWhere(
          '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
          { search: `%${search}%` }
        );
      }

      if (sortBy) {
        queryBuilder.orderBy(`task.${sortBy}`, sortOrder);
      }

      const [tasks, total] = await queryBuilder
        .skip(skip)
        .take(limit)
        .getManyAndCount();

      return {
        tasks,
        total,
        page: Number(page),
        limit: Number(limit)
      };
    } catch (error) {
      console.error('Error getting tasks:', error);
      throw error;
    }
  }

  async getTaskById(id: string): Promise<Task | null> {
    try {
      return await this.taskRepository.findOne({ where: { id } });
    } catch (error) {
      console.error('Error getting task by id:', error);
      throw error;
    }
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto): Promise<Task | null> {
    try {
      const task = await this.getTaskById(id);
      if (!task) return null;

      Object.assign(task, updateTaskDto);
      return await this.taskRepository.save(task);
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  async deleteTask(id: string): Promise<boolean> {
    try {
      const result = await this.taskRepository.delete(id);
      return result.affected ? result.affected > 0 : false;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }
} 