import { Request, Response } from 'express';
import { TaskService } from '../services/TaskService';
import { Task } from '../entities/Task';
import { AppDataSource } from '../config/database';
import { CreateTaskDto, UpdateTaskDto, TaskFilterDto } from '../types/task.dto';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

export class TaskController {
  private taskService: TaskService;

  constructor(dataSource = AppDataSource) {
    this.taskService = new TaskService(dataSource.getRepository(Task));
  }

  createTask = async (req: Request, res: Response): Promise<Response> => {
    try {
      const createTaskDto = plainToInstance(CreateTaskDto, req.body);
      const errors = await validate(createTaskDto);
      
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const task = await this.taskService.createTask(createTaskDto);
      return res.status(201).json(task);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  getAllTasks = async (req: Request, res: Response): Promise<Response> => {
    try {
      const filterDto = plainToInstance(TaskFilterDto, req.query as Record<string, unknown>);
      const errors = await validate(filterDto);
      
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const result = await this.taskService.getAllTasks(filterDto);
      return res.json(result);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  getTaskById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const task = await this.taskService.getTaskById(req.params.id);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      return res.json(task);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  updateTask = async (req: Request, res: Response): Promise<Response> => {
    try {
      const updateTaskDto = plainToInstance(UpdateTaskDto, req.body);
      const errors = await validate(updateTaskDto);
      
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const task = await this.taskService.updateTask(req.params.id, updateTaskDto);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      return res.json(task);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  deleteTask = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.taskService.deleteTask(req.params.id);
      if (!result) {
        return res.status(404).json({ error: 'Task not found' });
      }
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
} 