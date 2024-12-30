import express from 'express';
import { AppDataSource } from './config/database';
import taskRoutes from './routes/taskRoutes';
import categoryRoutes from './routes/categoryRoutes';
import errorHandler from './middlewares/errorHandler';

const app = express();

app.use(express.json());

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/categories', categoryRoutes);

// Error handling
app.use(errorHandler);

// Initialize database connection
AppDataSource.initialize()
  .then(() => {
    console.log('Database connection initialized');
  })
  .catch((err: Error) => {
    console.error('Error during database initialization:', err);
    process.exit(1);
  });

export default app; 