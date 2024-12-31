import express, { Express, Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import cors from 'cors';
import { DataSource } from 'typeorm';
import taskRoutes from './routes/task.routes';
import categoryRoutes from './routes/category.routes';
import { errorHandler } from './middlewares/errorHandler';

export class App {
  public app: Express;

  constructor(private dataSource: DataSource) {
    this.app = express();
    this.config();
    this.routes();
  }

  private config(): void {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private routes(): void {
    this.app.use('/api/tasks', taskRoutes(this.dataSource));
    this.app.use('/api/categories', categoryRoutes(this.dataSource));
    
    // Fix: Cast errorHandler as ErrorRequestHandler
    this.app.use(errorHandler as ErrorRequestHandler);
  }
}

export default App; 