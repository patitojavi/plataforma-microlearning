import { Request, Response } from 'express';
import { Evaluacion } from '../models/evaluacion.model';
import { User } from '../models/user.model';
import { AuthRequest } from '../middlewares/auth.middleware';

export const crearEvaluacion = async (req: AuthRequest, res: Response) => {
  try {
    const { capacitacionId, preguntas } = req.body;
    const evaluacion = new Evaluacion({ capacitacion: capacitacionId, preguntas });
    await evaluacion.save();
    return res.status(201).json(evaluacion);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error al crear evaluación' });
  }
};

export const responderEvaluacion = async (req: AuthRequest, res: Response) => {
  try {
    const { evaluacionId, respuestas } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    const evaluacion = await Evaluacion.findById(evaluacionId);
    if (!evaluacion) {
      return res.status(404).json({ message: 'Evaluación no encontrada' });
    }

    let puntaje = 0;
    evaluacion.preguntas.forEach((preg, index) => {
      if (preg.respuestaCorrecta === respuestas[index]) puntaje++;
    });

    const porcentaje = (puntaje / evaluacion.preguntas.length) * 100;

    // Buscar usuario y asignar insignia
    const usuario = await User.findById(userId);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    let nuevaInsignia = '';

    if (porcentaje >= 100) {
      nuevaInsignia = 'Insignia de Oro';
    } else if (porcentaje >= 70) {
      nuevaInsignia = 'Insignia de Plata';
    } else {
      nuevaInsignia = 'Insignia de Participación';
    }

    // Evitar duplicados
    if (!usuario.badges.includes(nuevaInsignia)) {
      usuario.badges.push(nuevaInsignia);
      await usuario.save();
    }

    return res.json({
      puntaje,
      porcentaje,
      insignia: nuevaInsignia
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error al responder evaluación' });
  }
};
