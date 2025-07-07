import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.middleware';
import { verifyRole } from '../middlewares/role.middleware';
import {
  crearCapacitacion,
  obtenerCapacitaciones,
  unirseACapacitacion,
  verMiembros,
  verProgreso,
  eliminarCapacitacion,
  actualizarCapacitacion
} from '../controllers/capacitacion.controller';

const router = Router();

// POST /api/capacitaciones - Crear una nueva capacitación (solo admin o capacitador)
router.post('/', verifyToken, verifyRole(['admin', 'capacitador']), crearCapacitacion);

// GET /api/capacitaciones - Obtener todas las capacitaciones
router.get('/', obtenerCapacitaciones);

// POST /api/capacitaciones/:id/unirse - Unirse a una capacitación (usuarios autenticados)
router.post('/:id/unirse', verifyToken, unirseACapacitacion);

// GET /api/capacitaciones/:id/miembros - Ver miembros de una capacitación (solo admin o capacitador)
router.get('/:id/miembros', verifyToken, verifyRole(['admin', 'capacitador']), verMiembros);

// GET /api/capacitaciones/:id/progreso - Ver progreso de una capacitación (usuarios autenticados)
router.get('/:id/progreso', verifyToken, verProgreso);

// DELETE /api/capacitaciones/:id - Eliminar una capacitación (solo admin)
router.delete('/:id', verifyToken, verifyRole(['admin']), eliminarCapacitacion);

// PUT /api/capacitaciones/:id - Actualizar una capacitación (solo admin o capacitador)
router.put('/:id', verifyToken, verifyRole(['admin', 'capacitador']), actualizarCapacitacion);



export default router;
