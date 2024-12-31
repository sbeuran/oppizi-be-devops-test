import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
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

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error(err);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'error',
      code: err.errorCode,
      message: err.message
    });
    return;
  }

  if (err instanceof QueryFailedError) {
    res.status(400).json({
      status: 'error',
      code: 'DATABASE_ERROR',
      message: 'Database operation failed'
    });
    return;
  }

  if (err instanceof EntityNotFoundError) {
    res.status(404).json({
      status: 'error',
      code: 'NOT_FOUND',
      message: 'Entity not found'
    });
    return;
  }

  res.status(500).json({
    status: 'error',
    code: 'INTERNAL_SERVER_ERROR',
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
};

export default errorHandler; 