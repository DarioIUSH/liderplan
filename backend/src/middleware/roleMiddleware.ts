import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User.js';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userRole?: string;
      user?: any;
    }
  }
}

// Middleware para validar rol del usuario
export const roleMiddleware = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;

      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          message: `Access denied. Required roles: ${allowedRoles.join(', ')}`,
        });
      }

      (req as any).userRole = user.role;
      (req as any).user = user;
      next();
    } catch (error) {
      res.status(500).json({ message: 'Role validation failed', error });
    }
  };
};
