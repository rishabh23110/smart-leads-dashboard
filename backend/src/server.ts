import 'dotenv/config';
import app from './app.js';
import connectDB from './config/database.js';
import { ENV } from './config/env.js';

const start = async (): Promise<void> => {
  await connectDB();
  app.listen(ENV.PORT, () => {
    console.log(`Server running on port ${ENV.PORT} [${ENV.NODE_ENV}]`);
  });
};

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
