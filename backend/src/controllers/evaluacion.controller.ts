import { Request, Response } from 'express';
import { Evaluacion } from '../models/evaluacion.model';
import { Capacitacion } from '../models/capacitacion.model';
import { User } from '../models/user.model';
import { AuthRequest } from '../middlewares/auth.middleware';

export const crearEvaluacion = async (req: AuthRequest, res: Response) => {
  const { capacitacionId, preguntas } = req.body;
  try {
    const evaluacion = new Evaluacion({ capacitacion: capacitacionId, preguntas });
    await evaluacion.save();
    res.status(201).json(evaluacion);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear evaluación' });
  }
};

export const responderEvaluacion = async (req: AuthRequest, res: Response) => {
  const { evaluacionId, respuestas } = req.body;
  const userId = req.user?.id;

  const evaluacion = await Evaluacion.findById(evaluacionId);
  if (!evaluacion) return res.status(404).json({ message: 'Evaluación no encontrada' });

  let puntaje = 0;
  evaluacion.preguntas.forEach((preg, index) => {
    if (preg.respuestaCorrecta === respuestas[index]) puntaje++;
  });

  const porcentaje = (puntaje / evaluacion.preguntas.length) * 100;

  // Asignar insignia al usuario
  const usuario = await User.findById(userId);
  if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

  if (porcentaje >= 100) {
    usuario.badges.push('Insignia de Oro');
  } else if (porcentaje >= 70) {
    usuario.badges.push('Insignia de Plata');
  } else {
    usuario.badges.push('Insignia de Participación');
  }

  await usuario.save();

  res.json({
    puntaje,
    porcentaje,
    insignias: usuario.badges.slice(-1)
  });
};
