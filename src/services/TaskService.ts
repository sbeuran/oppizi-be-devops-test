import { Repository } from 'typeorm';
import { Task } from '../entities/Task';
import { CreateTaskDTO, UpdateTaskDTO, TaskFilterDTO } from '../types/task.dto';
import { AppError } from '../middlewares/errorHandler';

export class TaskService {
  constructor(private taskRepository: Repository<Task>) {}

  async createTask(createTaskDto: CreateTaskDTO): Promise<Task> {
    if (!createTaskDto.title) {
      throw new AppError(400, 'Title is required', 'VALIDATION_ERROR');
    }

    const task = this.taskRepository.create(createTaskDto);
    return await this.taskRepository.save(task);
  }

  async getTasks(filterDto?: TaskFilterDTO): Promise<[Task[], number]> {
    const query = this.taskRepository.createQueryBuilder('task')
      .leftJoinAndSelect('task.category', 'category');

    if (filterDto) {
      const { status, priority, search, categoryId, page, limit, sortBy, sortOrder } = filterDto;

      if (status) {
        query.andWhere('task.status = :status', { status });
      }

      if (priority) {
        query.andWhere('task.priority = :priority', { priority });
      }

      if (categoryId) {
        query.andWhere('task.categoryId = :categoryId', { categoryId });
      }

      if (search) {
        query.andWhere(
          '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
          { search: `%${search}%` }
        );
      }

      if (sortBy) {
        query.orderBy(`task.${sortBy}`, sortOrder || 'ASC');
      }

      if (page && limit) {
        query.skip((page - 1) * limit).take(limit);
      }
    }

    return await query.getManyAndCount();
  }

  async getTaskById(id: string): Promise<Task | null> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['category']
    });

    if (!task) {
      throw new AppError(404, 'Task not found', 'NOT_FOUND');
    }

    return task;
  }

  async updateTask(updateTaskDto: UpdateTaskDTO): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id: updateTaskDto.id }
    });

    if (!task) {
      throw new AppError(404, 'Task not found', 'NOT_FOUND');
    }

    Object.assign(task, updateTaskDto);
    return await this.taskRepository.save(task);
  }

  async deleteTask(id: string): Promise<boolean> {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new AppError(404, 'Task not found', 'NOT_FOUND');
    }
    return true;
  }
} 