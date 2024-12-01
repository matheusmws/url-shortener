import { Request, Response, NextFunction } from 'express';
import { metrics, logger } from '../config/observability';

export const metricsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (process.env.ENABLE_METRICS !== 'true') {
    next();
    return;
  }

  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const route = req.route?.path || req.path;
    
    metrics.httpRequestDuration.observe(
      {
        method: req.method,
        route,
        status_code: res.statusCode.toString()
      },
      duration / 1000
    );

    logger.info('Request processed', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration
    });
  });

  next();
}; 