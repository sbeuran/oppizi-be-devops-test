import { DataSource } from 'typeorm';
import { Task } from '../entities/Task';
import { Category } from '../entities/Category';

export const testDataSource = new DataSource({
  type: "postgres",
  host: process.env.TEST_DB_HOST || "localhost",
  port: parseInt(process.env.TEST_DB_PORT || "5432"),
  username: process.env.TEST_DB_USERNAME || "postgres",
  password: process.env.TEST_DB_PASSWORD || "postgres",
  database: "postgres",
  entities: [Task, Category],
  synchronize: true,
  dropSchema: true,
  logging: false
});

beforeAll(async () => {
  await testDataSource.initialize();
  
  try {
    await testDataSource.query(`CREATE DATABASE task_management_test`);
  } catch (error) {
    console.log('Test database might already exist');
  }
  
  await testDataSource.destroy();
  
  testDataSource.setOptions({
    database: 'task_management_test'
  });
  
  await testDataSource.initialize();
  
  await testDataSource.synchronize(true);
});

beforeEach(async () => {
  const entities = testDataSource.entityMetadatas;
  for (const entity of entities) {
    const repository = testDataSource.getRepository(entity.name);
    await repository.clear();
  }
});

afterAll(async () => {
  if (testDataSource.isInitialized) {
    await testDataSource.destroy();
  }
}); 