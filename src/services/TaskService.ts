import { Repository } from 'typeorm';
import { Task } from '../entities/Task';
import { CreateTaskDto, UpdateTaskDto, TaskFilters } from '../types/task.dto';

export class TaskService {
  constructor(private taskRepository: Repository<Task>) {}

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.taskRepository.create(createTaskDto);
    return await this.taskRepository.save(task);
  }

  async getAllTasks(filters: TaskFilters): Promise<{ tasks: Task[]; total: number; page: number; limit: number }> {
    const { status, search, page = 1, limit = 10, sortBy, sortOrder } = filters;
    const skip = (page - 1) * limit;

    const queryBuilder = this.taskRepository.createQueryBuilder('task');

    if (status) {
      queryBuilder.andWhere('task.status = :status', { status });
    }

    if (search) {
      queryBuilder.andWhere(
        '(task.title ILIKE :search OR task.description ILIKE :search)',
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
  }

  async getTaskById(id: string): Promise<Task | null> {
    return await this.taskRepository.findOne({ where: { id } });
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto): Promise<Task | null> {
    const task = await this.getTaskById(id);
    if (!task) return null;

    Object.assign(task, updateTaskDto);
    return await this.taskRepository.save(task);
  }

  async deleteTask(id: string): Promise<boolean> {
    const result = await this.taskRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
} 