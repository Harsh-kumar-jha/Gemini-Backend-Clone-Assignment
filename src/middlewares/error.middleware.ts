import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger.util.js';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  logger.error(err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ success: false, message });
} 