import app from './app';
import { AppDataSource } from './app';

const port = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Wait for database connection
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer(); 