import { Request, Response, NextFunction } from 'express';
import { TaskService } from '../services/TaskService';
import { validate } from 'class-validator';
import { CreateTaskDto, UpdateTaskDto, TaskFilterDto } from '../types/task.dto';
import { plainToInstance } from 'class-transformer';

export class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
  }

  createTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const createTaskDto = plainToInstance(CreateTaskDto, req.body);
      const errors = await validate(createTaskDto);
      
      if (errors.length > 0) {
        return next(errors);
      }

      const task = await this.taskService.createTask(createTaskDto);
      res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  };

  getAllTasks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filterDto = plainToInstance(TaskFilterDto, req.query);
      const errors = await validate(filterDto);
      
      if (errors.length > 0) {
        return next(errors);
      }

      const result = await this.taskService.getAllTasks(filterDto);
      res.json({
        tasks: result.tasks,
        total: result.total,
        page: filterDto.page || 1,
        limit: filterDto.limit || 10
      });
    } catch (error) {
      next(error);
    }
  };

  getTaskById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const task = await this.taskService.getTaskById(req.params.id);
      res.json(task);
    } catch (error) {
      next(error);
    }
  };

  updateTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updateTaskDto = plainToInstance(UpdateTaskDto, req.body);
      const errors = await validate(updateTaskDto);
      
      if (errors.length > 0) {
        return next(errors);
      }

      const task = await this.taskService.updateTask(req.params.id, updateTaskDto);
      res.json(task);
    } catch (error) {
      next(error);
    }
  };

  deleteTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.taskService.deleteTask(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
} 