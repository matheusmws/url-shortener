import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/authService';
import { logger } from '../config/observability';

export const optionalAuthenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const [, token] = authHeader.split(' ');

      if (token) {
        try {
          const userId = await AuthService.validateToken(token);
          req.userId = userId;
          logger.info(`Optional authentication successful for user ${userId}`);
        } catch (error) {
          logger.warn('Optional authentication failed:', error);
        }
      }
    }
    
    next();
  } catch (error) {
    logger.error('Error in optional authentication:', error);
    next(error);
  }
}; 