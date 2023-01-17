import { Request, Response, NextFunction } from 'express';
import Error from '../interfaces/error.interface';

export const errorMiddleware = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const status = error.status || 500;
  const message = error.message || 'Unexpected error';
  res.status(status).json({ status, message });
};

export const setError = (error: string = 'Unexpected error', status?: number) => {
  const err: Error = new Error(error);
  err.status = status || 500;
  throw err;
};
