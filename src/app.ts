import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middlewares/errorHandler';
import taskRoutes from './routes/taskRoutes';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

// Routes
app.use('/api/tasks', taskRoutes);

// Error handling
app.use(errorHandler);

export default app; 