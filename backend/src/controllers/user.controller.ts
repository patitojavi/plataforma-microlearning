import { Request, Response } from 'express';
import { User } from '../models/user.model';

export const obtenerUsuarios = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch {
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};

export const obtenerUsuario = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).select('-password');
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
  } catch {
    res.status(500).json({ message: 'Error al obtener usuario' });
  }
};

export const actualizarUsuario = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { email, username, role } = req.body;
  try {
    const updated = await User.findByIdAndUpdate(
      id,
      { email, username, role },
      { new: true }
    ).select('-password');
    if (!updated) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(updated);
  } catch {
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }
};

export const eliminarUsuario = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json({ message: 'Usuario eliminado' });
  } catch {
    res.status(500).json({ message: 'Error al eliminar usuario' });
  }
};