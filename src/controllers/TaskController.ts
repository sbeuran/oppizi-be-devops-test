import { Request, Response } from 'express';
import { TaskService } from '../services/TaskService';
import { Task } from '../entities/Task';
import { AppDataSource } from '../config/database';
import { CreateTaskDto, UpdateTaskDto, TaskFilterDto } from '../types/task.dto';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

export class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService(AppDataSource.getRepository(Task));
  }

  createTask = async (req: Request, res: Response) => {
    try {
      const createTaskDto = plainToInstance(CreateTaskDto, req.body);
      const errors = await validate(createTaskDto);
      
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const task = await this.taskService.createTask(createTaskDto);
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  getAllTasks = async (req: Request, res: Response) => {
    try {
      const filterDto = plainToInstance(TaskFilterDto, req.query);
      const errors = await validate(filterDto);
      
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const result = await this.taskService.getAllTasks(filterDto);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  getTaskById = async (req: Request, res: Response) => {
    try {
      const task = await this.taskService.getTaskById(req.params.id);
      res.json(task);
    } catch (error) {
      next(error);
    }
  };

  updateTask = async (req: Request, res: Response) => {
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

  deleteTask = async (req: Request, res: Response) => {
    try {
      await this.taskService.deleteTask(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
} 