import { Router } from 'express';
import {
  crearEvaluacion,
  responderEvaluacion,
  obtenerEvaluaciones,
  obtenerEvaluacion,
  editarEvaluacion,
  eliminarEvaluacion
} from '../controllers/evaluacion.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { verifyRole } from '../middlewares/role.middleware';

const router = Router();

// POST /api/evaluaciones - Crear una nueva evaluación (solo admin o capacitador)
router.post('/', verifyToken, verifyRole(['admin', 'capacitador']), crearEvaluacion);

// POST /api/evaluaciones/responder - Responder una evaluación (usuarios autenticados)
router.post('/responder', verifyToken, responderEvaluacion);

// GET /api/evaluaciones - Obtener todas las evaluaciones (admin/capacitador)
router.get('/', verifyToken, verifyRole(['admin', 'capacitador']), obtenerEvaluaciones);

// GET /api/evaluaciones/:id - Obtener una evaluación específica (admin/capacitador)
router.get('/:id', verifyToken, obtenerEvaluacion);

// PUT /api/evaluaciones/:id - Editar una evaluación (solo admin o capacitador)
router.put('/:id', verifyToken, verifyRole(['admin', 'capacitador']), editarEvaluacion);

// DELETE /api/evaluaciones/:id - Eliminar una evaluación (solo admin o capacitador)
router.delete('/:id', verifyToken, verifyRole(['admin', 'capacitador']), eliminarEvaluacion);

export default router;


