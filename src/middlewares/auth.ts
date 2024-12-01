import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IAuthRequest, IJwtPayload } from '../types';
import { logger } from '../config/observability';

export const requireAuth = (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Token não fornecido' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || '123'
    ) as IJwtPayload;

    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Erro de autenticação:', error);
    res.status(401).json({ error: 'Token inválido' });
  }
}; 