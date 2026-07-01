import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import ApiError from '../utils/ApiError.js';

const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
  let statusCode = 500;
  let message = 'Something went wrong';
  let errors: { field?: string; message: string }[] = [];

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else if (err instanceof mongoose.Error) {
    statusCode = 400;
    message = err.message;
  } else {
    statusCode = (err as unknown as Record<string, number>).statusCode || 500;
    message = err.message || 'Something went wrong';
    errors = (err as unknown as Record<string, { field?: string; message: string }[]>).errors || [];
  }

  const response: Record<string, unknown> = {
    success: statusCode < 400,
    statusCode,
    message,
    errors,
  };

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

export { errorHandler };
