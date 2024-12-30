import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { createApp } from './app';
import { Task } from './entities/Task';
import { Category } from './entities/Category';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 3000;

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'task_management',
  entities: [Task, Category],
  synchronize: true,
  logging: process.env.NODE_ENV !== 'production'
});

AppDataSource.initialize()
  .then(() => {
    const app = createApp(AppDataSource);
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Error during Data Source initialization:', error);
    process.exit(1);
  });

export default AppDataSource; 