import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';
import AuthService from '../services/authService';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw ApiError.unauthorized('No token provided');
    }

    const [, token] = authHeader.split(' ');

    if (!token) {
      throw ApiError.unauthorized('Invalid token format');
    }

    const userId = await AuthService.validateToken(token);
    req.userId = userId;
    
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(ApiError.unauthorized('Authentication failed'));
    }
  }
}; 