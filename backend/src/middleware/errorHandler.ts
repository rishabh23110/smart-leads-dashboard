import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';
import { ApiResponse } from '../types/index.js';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    const body: ApiResponse = { success: false, message: err.message };
    res.status(err.statusCode).json(body);
    return;
  }

  if (err.name === 'ValidationError') {
    res.status(400).json({ success: false, message: err.message });
    return;
  }

  if (err.name === 'CastError') {
    res.status(400).json({ success: false, message: 'Invalid ID format' });
    return;
  }

  if (err.message?.includes('E11000') || err.message?.includes('duplicate key')) {
    res.status(409).json({ success: false, message: 'Email already exists' });
    return;
  }

  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
};

export const notFound = (_req: Request, res: Response): void => {
  res.status(404).json({ success: false, message: 'Route not found' });
};
