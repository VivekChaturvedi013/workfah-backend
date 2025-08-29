import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from './models/User';

interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).send({ message: 'Unauthorized' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    (req as any).user = decoded; // now it's strongly typed
    console.log(User)
    next();
  } catch (err) {
    res.status(401).send({ message: 'Invalid token' });
  }
};
