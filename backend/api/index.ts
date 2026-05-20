import 'dotenv/config';
import mongoose from 'mongoose';
import app from '../src/app.js';
import connectDB from '../src/config/database.js';

// Connect at module load — Mongoose buffers ops until ready
if (mongoose.connection.readyState === 0) {
  connectDB().catch(console.error);
}

export default app;
