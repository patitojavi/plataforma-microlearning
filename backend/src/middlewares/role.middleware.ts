import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';

export const verifyRole = (roles: ('admin' | 'capacitador' | 'usuario')[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user) {
      res.status(401).json({ message: 'Token no válido o ausente' });
      return;
    }

    if (!roles.includes(user.role)) {
      res.status(403).json({ message: 'Acceso denegado: rol insuficiente' });
      return;
    }

    next();
  };
};
