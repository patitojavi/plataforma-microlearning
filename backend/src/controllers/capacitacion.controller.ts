import { Request, Response } from 'express';
import { Capacitacion } from '../models/capacitacion.model';
import { AuthRequest } from '../middlewares/auth.middleware';

export const crearCapacitacion = async (req: AuthRequest, res: Response) => {
  try {
    const { titulo, descripcion, contenido } = req.body;
    const creador = req.user?.id;

    const nueva = new Capacitacion({ titulo, descripcion, contenido, creador });
    await nueva.save();

    res.status(201).json(nueva);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear capacitación' });
  }
};

export const obtenerCapacitaciones = async (_req: Request, res: Response) => {
  const capacitaciones = await Capacitacion.find().populate('creador', 'username');
  res.json(capacitaciones);
};

export const unirseACapacitacion = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { id } = req.params;

  const cap = await Capacitacion.findById(id);
  if (!cap) return res.status(404).json({ message: 'Capacitación no encontrada' });

  if (cap.miembros.includes(userId)) {
    return res.status(400).json({ message: 'Ya estás inscrito en esta capacitación' });
  }

  cap.miembros.push(userId);
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

  const cap = await Capacitacion.findById(id);
  if (!cap) return res.status(404).json({ message: 'Capacitación no encontrada' });

  if (!cap.progreso.has(userId)) {
    return res.status(400).json({ message: 'No estás inscrito en esta capacitación' });
  }

  const progreso = cap.progreso.get(userId);
  res.json({ progreso });
};