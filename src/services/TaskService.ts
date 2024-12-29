import { Repository, Like } from 'typeorm';
import { Task, TaskStatus } from '../entities/Task';
import { AppDataSource } from '../config/database';
import { CreateTaskDto, UpdateTaskDto, TaskFilterDto, SortOrder } from '../types/task.dto';
import { NotFoundException } from '../utils/errors';

export class TaskService {
  private taskRepository: Repository<Task>;

  constructor() {
    this.taskRepository = AppDataSource.getRepository(Task);
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.taskRepository.create(createTaskDto);
    return await this.taskRepository.save(task);
  }

  async getAllTasks(filterDto: TaskFilterDto): Promise<{ tasks: Task[]; total: number }> {
    const { search, status, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = SortOrder.DESC } = filterDto;
    const queryBuilder = this.taskRepository.createQueryBuilder('task');

    if (search) {
      queryBuilder.andWhere(
        '(task.title LIKE :search OR task.description LIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (status) {
      queryBuilder.andWhere('task.status = :status', { status });
    }

    queryBuilder.orderBy(`task.${sortBy}`, sortOrder);

    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [tasks, total] = await queryBuilder.getManyAndCount();
    return { tasks, total };
  }

  async getTaskById(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.getTaskById(id);
    Object.assign(task, updateTaskDto);
    return await this.taskRepository.save(task);
  }

  async deleteTask(id: string): Promise<void> {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }
} 