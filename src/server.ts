import 'dotenv/config';
import app, { initializeApp } from './app';

const port = process.env.PORT || 3000;

// Initialize app and start server
initializeApp().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch(error => {
  console.error('Failed to initialize app:', error);
  process.exit(1);
}); 