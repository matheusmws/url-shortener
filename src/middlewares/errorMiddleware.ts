import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';
import { logger } from '../config/observability';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    logger.error('API Error:', {
      statusCode: err.statusCode,
      message: err.message,
      path: req.path,
      method: req.method
    });

    return res.status(err.statusCode).json(err.toJSON());
  }

  logger.error('Unexpected Error:', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  const internalError = new ApiError('Internal server error', 500);
  return res.status(500).json(internalError.toJSON());
}; 