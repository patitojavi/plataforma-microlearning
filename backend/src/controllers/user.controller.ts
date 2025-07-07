import { Request, Response } from 'express';
import { User } from '../models/user.model';


// Registrar un nuevo usuario
export const obtenerUsuarios = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};


// Obtener un usuario por ID
export const obtenerUsuario = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).select('-password');
    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener usuario' });
  }
};


// Actualizar un usuario
export const actualizarUsuario = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { email, username, role } = req.body;
  try {
    const updated = await User.findByIdAndUpdate(
      id,
      { email, username, role },
      { new: true }
    ).select('-password');

    if (!updated) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }
};


// Eliminar un usuario
export const eliminarUsuario = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }
    res.json({ message: 'Usuario eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar usuario' });
  }
};


// Obtener badges de un usuario
export const obtenerBadgesUsuario = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).select('badges');
    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }
    res.json({ badges: user.badges || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener insignias del usuario' });
  }
};




