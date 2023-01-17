import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import Error from '../interfaces/error.interface';

const handleUnauthorized = (next: NextFunction) => {
  const err: Error = new Error('Unauthorized request.');
  err.status = 401;
  next(err);
};

export const handleToken = (req: Request): string | JwtPayload => {
  const authHeader = req.get('Authorization');
  if (authHeader) {
    const bearer = authHeader.split(' ')[0].toLowerCase();
    const token = authHeader.split(' ')[1];
    if (bearer === 'bearer' && token) {
      const decode = jwt.verify(token, config.tokenSecret as unknown as string);

      if (decode) return decode;
    }
  }
  return '';
};

export const isAdmin = (req: Request): boolean => {
  if (handleToken(req)) {
    const tokenDetails: JwtPayload = handleToken(req) as JwtPayload;
    const userRole: string = tokenDetails.user.user_role as string;

    if (userRole === 'Admin') return true;
  }
  return false;
};

export const authenticationMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  try {
    if (handleToken(req)) next();
    else handleUnauthorized(next);
  } catch (error) {
    handleUnauthorized(next);
  }
};
