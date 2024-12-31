import { Request, Response } from 'express';
import { TaskService } from '../services/TaskService';
import { CreateTaskDTO, UpdateTaskDTO } from '../types/task.dto';

export class TaskController {
  constructor(private taskService: TaskService) {}

  async createTask(req: Request, res: Response) {
    const data: CreateTaskDTO = req.body;
    const task = await this.taskService.createTask(data);
    res.status(201).json(task);
  }

  async getTasks(_req: Request, res: Response) {
    const tasks = await this.taskService.getTasks();
    res.json(tasks);
  }

  async getTaskById(req: Request, res: Response) {
    const { id } = req.params;
    const task = await this.taskService.getTaskById(id);
    res.json(task);
  }

  async updateTask(req: Request, res: Response) {
    const { id } = req.params;
    const data: UpdateTaskDTO = req.body;
    const task = await this.taskService.updateTask(id, data);
    res.json(task);
  }

  async deleteTask(req: Request, res: Response) {
    const { id } = req.params;
    await this.taskService.deleteTask(id);
    res.status(204).send();
  }
} 