"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRole = void 0;
const verifyRole = (roles) => {
    return (req, res, next) => {
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
exports.verifyRole = verifyRole;
