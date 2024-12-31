import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { DataSource } from 'typeorm';
import { errorHandler } from './middlewares/errorHandler';
import { createTaskRouter } from './routes/task.routes';
import { createCategoryRouter } from './routes/category.routes';

export const createApp = (dataSource: DataSource): Application => {
  const app: Application = express();

  // Middleware
  app.use(cors());
  app.use(helmet());
  app.use(express.json());

  // Health check endpoint
  app.get('/health', async (_req, res) => {
    try {
      await dataSource.query('SELECT 1');
      res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        checks: {
          database: 'connected',
          api: 'running'
        }
      });
    } catch (error) {
      console.error('Health check failed:', error);
      const status = process.uptime() < 180 ? 200 : 503;
      res.status(status).json({
        status: 'starting',
        timestamp: new Date().toISOString(),
        checks: {
          database: error instanceof Error ? error.message : 'disconnected',
          api: 'running'
        }
      });
    }
  });

  // Routes
  app.use('/api/tasks', createTaskRouter(dataSource));
  app.use('/api/categories', createCategoryRouter(dataSource));

  // Error handling
  app.use(errorHandler);

  return app;
}; 