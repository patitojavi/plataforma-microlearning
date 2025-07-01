import { Request, Response } from 'express';
import { Capacitacion } from '../models/capacitacion.model';
import { AuthRequest } from '../middlewares/auth.middleware';
import mongoose from 'mongoose';

export const crearCapacitacion = async (req: AuthRequest, res: Response) => {
  try {
    const { titulo, descripcion, contenido, videoUrl, comentarios } = req.body;
    const creador = req.user?.id;

    const nueva = new Capacitacion({
      titulo,
      descripcion,
      contenido,
      creador,
      videoUrl,
      comentarios: comentarios || []
    });
    await nueva.save();

    res.status(201).json(nueva);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear capacitación' });
  }
};

export const obtenerCapacitaciones = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const capacitaciones = await Capacitacion.find().populate('creador', 'username');

    const resultado = capacitaciones.map(cap => {
      const esCapacitador = cap.creador._id.toString() === userId;
      const yaInscrito = userId ? cap.miembros.map(id => id.toString()).includes(userId) : false;
      return {
        ...cap.toObject(),
        esCapacitador,
        yaInscrito
      };
    });

    res.json(resultado);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener capacitaciones' });
  }
};

export const unirseACapacitacion = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { id } = req.params;

  if (!userId) {
    return res.status(400).json({ message: 'Usuario no autenticado' });
  }

  const cap = await Capacitacion.findById(id);
  if (!cap) return res.status(404).json({ message: 'Capacitación no encontrada' });

  if (cap.miembros.map(id => id.toString()).includes(userId)) {
    return res.status(400).json({ message: 'Ya estás inscrito en esta capacitación' });
  }

  cap.miembros.push(new mongoose.Types.ObjectId(userId));
  cap.progreso.set(userId, 0);
  await cap.save();

  res.json({ message: 'Te has unido a la capacitación', cap });
};

export const verMiembros = async (req: Request, res: Response) => {
  const { id } = req.params;
  const cap = await Capacitacion.findById(id).populate('miembros', 'username email');
  if (!cap) return res.status(404).json({ message: 'Capacitación no encontrada' });

  res.json(cap.miembros);
};

export const verProgreso = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { id } = req.params;

  if (!userId) {
    return res.status(400).json({ message: 'Usuario no autenticado' });
  }

  const cap = await Capacitacion.findById(id);
  if (!cap) return res.status(404).json({ message: 'Capacitación no encontrada' });

  if (!cap.progreso.has(userId)) {
    return res.status(400).json({ message: 'No estás inscrito en esta capacitación' });
  }

  const progreso = cap.progreso.get(userId);
  res.json({ progreso });
};

export const eliminarCapacitacion = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    const deleted = await Capacitacion.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Capacitación no encontrada' });
    }
    res.json({ message: 'Capacitación eliminada correctamente' });
  } catch (error) {
    console.error("Error al eliminar capacitación:", error);
    res.status(500).json({ message: 'Error al eliminar capacitación' });
  }
};

export const actualizarCapacitacion = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { titulo, descripcion, contenido, videoUrl, comentarios } = req.body;

  try {
    const actualizada = await Capacitacion.findByIdAndUpdate(
      id,
      { titulo, descripcion, contenido, videoUrl, comentarios },
      { new: true }
    );
    if (!actualizada) {
      return res.status(404).json({ message: 'Capacitación no encontrada' });
    }

    res.json(actualizada);
  } catch (err) {
    console.error('Error al actualizar capacitación:', err);
    res.status(500).json({ message: 'Error al actualizar capacitación' });
  }
};
