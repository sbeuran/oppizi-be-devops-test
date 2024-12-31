import express from 'express';
import cors from 'cors';
import { DataSource } from 'typeorm';
import { Category } from './entities/Category';
import { Task } from './entities/Task';
import taskRoutes from './routes/task.routes';
import categoryRoutes from './routes/category.routes';

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Category, Task],
  synchronize: true,
  logging: process.env.NODE_ENV !== 'production',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Initialize database connection with retries
const initializeDB = async (retries = 5, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await AppDataSource.initialize();
      console.log("Database connection initialized");
      return;
    } catch (error) {
      console.error(`Database connection attempt ${i + 1} failed:`, error);
      if (i < retries - 1) {
        console.log(`Retrying in ${delay/1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  throw new Error("Failed to initialize database connection after multiple attempts");
};

initializeDB().catch(error => {
  console.error("Fatal error initializing database:", error);
  process.exit(1);
});

// Health check route
app.get('/health', async (req, res) => {
  try {
    // Check database connection
    const isConnected = AppDataSource.isInitialized;
    if (!isConnected) {
      return res.status(500).json({ 
        status: 'error',
        message: 'Database connection not initialized'
      });
    }

    res.status(200).json({ 
      status: 'ok',
      database: 'connected'
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({ 
      status: 'error',
      message: error.message 
    });
  }
});

// API routes
app.use('/api/tasks', taskRoutes);
app.use('/api/categories', categoryRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

export default app; 