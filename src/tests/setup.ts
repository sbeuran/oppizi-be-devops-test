import { DataSource } from 'typeorm';
import { Task } from '../entities/Task';
import { Category } from '../entities/Category';

export const testDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'task_management_test',
  entities: [Task, Category],
  synchronize: true,
  dropSchema: true
});

beforeAll(async () => {
  await testDataSource.initialize();
});

afterAll(async () => {
  await testDataSource.destroy();
});

afterEach(async () => {
  // Clear tables in correct order to handle foreign key constraints
  const entities = testDataSource.entityMetadatas;
  const tableNames = entities
    .map(entity => `"${entity.tableName}"`)
    .join(', ');

  // Disable foreign key checks, truncate tables, re-enable foreign key checks
  await testDataSource.query(`
    DO $$ 
    BEGIN 
      EXECUTE 'TRUNCATE TABLE ' || '${tableNames}' || ' CASCADE';
    END $$;
  `);
}); 