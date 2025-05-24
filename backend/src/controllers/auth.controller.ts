    import { Request, Response } from 'express';
    import { User } from '../models/user.model';
    import { generateToken } from '../services/jwt.service';

    export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, username, rut, password } = req.body;
        const exists = await User.findOne({ $or: [{ email }, { rut }] });
        if (exists) {
        res.status(400).json({ message: 'Email o RUT ya en uso' });
        return;
        }

        const user = new User({ email, username, rut, password });
        await user.save();

        const token = generateToken({ id: user._id, role: user.role });
        res.status(201).json({
        token,
        user: {
            id: user._id,
            email,
            username,
            rut,
            role: user.role,
        },
        });
    } catch (err) {
        res.status(500).json({ message: 'Error al registrar usuario' });
    }
    };

    export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
        res.status(401).json({ message: 'Credenciales inválidas' });
        return;
        }

        const token = generateToken({ id: user._id, role: user.role });
        res.json({
        token,
        user: {
            id: user._id,
            email,
            username: user.username,
            rut: user.rut,
            role: user.role,
        },
        });
    } catch (err) {
        res.status(500).json({ message: 'Error al iniciar sesión' });
    }
    };
