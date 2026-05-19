import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { ENV } from '../config/env.js';
import { AuthRequest, ApiResponse } from '../types/index.js';
import { RegisterInput, LoginInput } from '../validators/auth.validator.js';

const signToken = (id: string, role: string, email: string): string => {
  return jwt.sign({ id, role, email }, ENV.JWT_SECRET, {
    expiresIn: ENV.JWT_EXPIRES_IN,
  } as jwt.SignOptions);
};

export const register = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, role } = req.body as RegisterInput;

    const existing = await User.findOne({ email });
    if (existing) return next(new AppError('Email already registered', 409));

    const user = await User.create({ name, email, password, role });
    const token = signToken(user._id.toString(), user.role, user.email);

    const response: ApiResponse = {
      success: true,
      message: 'Registration successful',
      data: { user, token },
    };
    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body as LoginInput;

    const user = await User.findOne({ email }).select('+password');
    if (!user) return next(new AppError('Invalid credentials', 401));

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return next(new AppError('Invalid credentials', 401));

    const token = signToken(user._id.toString(), user.role, user.email);

    const userWithoutPassword = await User.findById(user._id);
    const response: ApiResponse = {
      success: true,
      message: 'Login successful',
      data: { user: userWithoutPassword, token },
    };
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

export const getMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) return next(new AppError('User not found', 404));
    res.status(200).json({ success: true, data: { user } });
  } catch (err) {
    next(err);
  }
};
