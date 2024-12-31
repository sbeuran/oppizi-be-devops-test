import { Request, Response, NextFunction } from 'express';
import { QueryFailedError, EntityNotFoundError } from 'typeorm';

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errorCode: string
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      code: err.errorCode,
      message: err.message
    });
  }

  if (err instanceof QueryFailedError) {
    return res.status(400).json({
      status: 'error',
      code: 'DATABASE_ERROR',
      message: 'Database operation failed'
    });
  }

  if (err instanceof EntityNotFoundError) {
    return res.status(404).json({
      status: 'error',
      code: 'NOT_FOUND',
      message: 'Entity not found'
    });
  }

  return res.status(500).json({
    status: 'error',
    code: 'INTERNAL_SERVER_ERROR',
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
};

export default errorHandler; 