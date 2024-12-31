import { DataSource } from 'typeorm';
import { Task } from '../entities/Task';
import { Category } from '../entities/Category';
import { InitialSchema1703980800000 } from '../migration/1703980800000-InitialSchema';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Task, Category],
  migrations: [InitialSchema1703980800000],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  migrationsRun: true
}); 