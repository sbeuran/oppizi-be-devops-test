import { Request, Response, NextFunction } from 'express';
import { TaskService } from '../services/TaskService';
import { CreateTaskDTO, UpdateTaskDTO, TaskFilterDTO } from '../types/task.dto';
import { AppError } from '../middlewares/errorHandler';

export class TaskController {
  constructor(private taskService: TaskService) {
    // Bind methods to ensure correct 'this' context
    this.createTask = this.createTask.bind(this);
    this.getTasks = this.getTasks.bind(this);
    this.getTaskById = this.getTaskById.bind(this);
    this.updateTask = this.updateTask.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
  }

  async createTask(req: Request, res: Response, next: NextFunction) {
    try {
      const taskData: CreateTaskDTO = req.body;
      if (!taskData.title) {
        throw new AppError(400, 'Title is required', 'VALIDATION_ERROR');
      }
      const task = await this.taskService.createTask(taskData);
      res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  }

  async getTasks(req: Request, res: Response, next: NextFunction) {
    try {
      const filterDto: TaskFilterDTO = req.query;
      const [tasks, total] = await this.taskService.getTasks(filterDto);
      res.json({
        data: tasks,
        total,
        page: Number(filterDto.page) || 1,
        limit: Number(filterDto.limit) || 10
      });
    } catch (error) {
      next(error);
    }
  }

  async getTaskById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const task = await this.taskService.getTaskById(id);
      res.json(task);
    } catch (error) {
      next(error);
    }
  }

  async updateTask(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const taskData: UpdateTaskDTO = { ...req.body, id };
      const task = await this.taskService.updateTask(taskData);
      res.json(task);
    } catch (error) {
      next(error);
    }
  }

  async deleteTask(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await this.taskService.deleteTask(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
} 