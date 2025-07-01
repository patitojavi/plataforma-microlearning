import { Request, Response } from 'express';
import { Evaluacion } from '../models/evaluacion.model';
import { User } from '../models/user.model';
import { AuthRequest } from '../middlewares/auth.middleware';



// Crear una nueva evaluación
// Solo accesible por administradores o capacitadores
export const crearEvaluacion = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { capacitacionId, preguntas } = req.body;
    const evaluacion = new Evaluacion({ capacitacion: capacitacionId, preguntas });
    await evaluacion.save();
    res.status(201).json(evaluacion);
  } catch (err) {
    console.error('Error al crear evaluación:', err);
    res.status(500).json({ message: 'Error al crear evaluación' });
  }
};


// Responder una evaluación
// Permite a un usuario autenticado responder una evaluación y obtener puntaje e insignia
export const responderEvaluacion = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { evaluacionId, respuestas } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'Usuario no autenticado' });
      return;
    }

    const evaluacion = await Evaluacion.findById(evaluacionId);
    if (!evaluacion) {
      res.status(404).json({ message: 'Evaluación no encontrada' });
      return;
    }

    let puntaje = 0;
    evaluacion.preguntas.forEach((preg, index) => {
      if (preg.respuestaCorrecta === respuestas[index]) puntaje++;
    });

    const porcentaje = (puntaje / evaluacion.preguntas.length) * 100;

    const usuario = await User.findById(userId);
    if (!usuario) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    let nuevaInsignia = '';

    if (porcentaje >= 100) {
      nuevaInsignia = 'Insignia de Oro';
    } else if (porcentaje >= 70) {
      nuevaInsignia = 'Insignia de Plata';
    } else {
      nuevaInsignia = 'Insignia de Participación';
    }

    if (!usuario.badges.includes(nuevaInsignia)) {
      usuario.badges.push(nuevaInsignia);
      await usuario.save();
    }

    res.json({
      puntaje,
      porcentaje,
      insignia: nuevaInsignia
    });
  } catch (err) {
    console.error('Error al responder evaluación:', err);
    res.status(500).json({ message: 'Error al responder evaluación' });
  }
};


// Obtener todas las evaluaciones
// Solo accesible por administradores o capacitadores
export const obtenerEvaluaciones = async (_req: Request, res: Response): Promise<void> => {
  try {
    const evaluaciones = await Evaluacion.find().populate('capacitacion', 'titulo');
    res.json(evaluaciones);
  } catch (err) {
    console.error('Error al obtener evaluaciones:', err);
    res.status(500).json({ message: 'Error al obtener evaluaciones' });
  }
};


// Obtener una evaluación específica
// Solo accesible por administradores o capacitadores
export const obtenerEvaluacion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const evaluacion = await Evaluacion.findById(id);
    if (!evaluacion) {
      res.status(404).json({ message: 'Evaluación no encontrada' });
      return;
    }
    res.json(evaluacion);
  } catch (err) {
    console.error('Error al obtener evaluación:', err);
    res.status(500).json({ message: 'Error al obtener evaluación' });
  }
};


// Editar una evaluación
// Solo accesible por administradores o capacitadores
export const editarEvaluacion = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { preguntas } = req.body;
    const evaluacion = await Evaluacion.findByIdAndUpdate(
      id,
      { preguntas },
      { new: true }
    );
    if (!evaluacion) {
      res.status(404).json({ message: 'Evaluación no encontrada' });
      return;
    }
    res.json(evaluacion);
  } catch (err) {
    console.error('Error al editar evaluación:', err);
    res.status(500).json({ message: 'Error al editar evaluación' });
  }
};


// Eliminar una evaluación
// Solo accesible por administradores o capacitadores
export const eliminarEvaluacion = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await Evaluacion.findByIdAndDelete(id);
    if (!deleted) {
      res.status(404).json({ message: 'Evaluación no encontrada' });
      return;
    }
    res.json({ message: 'Evaluación eliminada correctamente' });
  } catch (err) {
    console.error('Error al eliminar evaluación:', err);
    res.status(500).json({ message: 'Error al eliminar evaluación' });
  }
};
