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

export const unirseACapacitacion = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ message: 'Usuario no autenticado' });
      return;
    }

    const cap = await Capacitacion.findById(id);
    if (!cap) {
      res.status(404).json({ message: 'Capacitación no encontrada' });
      return;
    }

    const yaInscrito = cap.miembros.map((m) => m.toString()).includes(userId);
    if (yaInscrito) {
      res.status(400).json({ message: 'Ya estás inscrito en esta capacitación' });
      return;
    }

    cap.miembros.push(new mongoose.Types.ObjectId(userId));
    cap.progreso.set(userId, 0);
    await cap.save();

    res.status(200).json({ message: 'Te has unido a la capacitación', cap });
  } catch (error) {
    console.error('Error en unirseACapacitacion:', error);
    res.status(500).json({ message: 'Error interno al unirse a la capacitación' });
  }
};




export const verMiembros = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const cap = await Capacitacion.findById(id).populate('miembros', 'username email');

    if (!cap) {
      res.status(404).json({ message: 'Capacitación no encontrada' });
      return;
    }

    res.status(200).json(cap.miembros);
  } catch (error) {
    console.error('Error en verMiembros:', error);
    res.status(500).json({ message: 'Error al obtener los miembros' });
  }
};





export const verProgreso = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      res.status(400).json({ message: 'Usuario no autenticado' });
      return;
    }

    const cap = await Capacitacion.findById(id);
    if (!cap) {
      res.status(404).json({ message: 'Capacitación no encontrada' });
      return;
    }

    if (!cap.progreso.has(userId)) {
      res.status(400).json({ message: 'No estás inscrito en esta capacitación' });
      return;
    }

    const progreso = cap.progreso.get(userId);
    res.status(200).json({ progreso });
  } catch (error) {
    console.error('Error en verProgreso:', error);
    res.status(500).json({ message: 'Error al obtener el progreso' });
  }
};



export const eliminarCapacitacion = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const deleted = await Capacitacion.findByIdAndDelete(id);

    if (!deleted) {
      res.status(404).json({ message: 'Capacitación no encontrada' });
      return;
    }

    res.status(200).json({ message: 'Capacitación eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar capacitación:', error);
    res.status(500).json({ message: 'Error al eliminar capacitación' });
  }
};




export const actualizarCapacitacion = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, contenido, videoUrl, comentarios } = req.body;

    const actualizada = await Capacitacion.findByIdAndUpdate(
      id,
      { titulo, descripcion, contenido, videoUrl, comentarios },
      { new: true }
    );

    if (!actualizada) {
      res.status(404).json({ message: 'Capacitación no encontrada' });
      return;
    }

    res.status(200).json(actualizada);
  } catch (err) {
    console.error('Error al actualizar capacitación:', err);
    res.status(500).json({ message: 'Error al actualizar capacitación' });
  }
};
