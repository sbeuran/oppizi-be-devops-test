import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'class-validator';
import { NotFoundException, BadRequestException } from '../utils/errors';

export const errorHandler = (
  error: Error | ValidationError[],
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Handle array of validation errors
  if (Array.isArray(error) && error[0] instanceof ValidationError) {
    const formattedErrors = error.map(err => ({
      property: err.property,
      constraints: err.constraints
    }));

    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: formattedErrors
    });
  }

  if (error instanceof NotFoundException) {
    return res.status(404).json({
      status: 'error',
      message: error.message
    });
  }

  if (error instanceof BadRequestException) {
    return res.status(400).json({
      status: 'error',
      message: error.message
    });
  }

  // Log the error for debugging
  console.error(error);
  
  return res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
}; 