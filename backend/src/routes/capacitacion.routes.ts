import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.middleware';
import { verifyRole } from '../middlewares/role.middleware';
import {
  crearCapacitacion,
  obtenerCapacitaciones,
  unirseACapacitacion,
  verMiembros,
  verProgreso
} from '../controllers/capacitacion.controller';

const router = Router();

// Crear una capacitación (solo admin o capacitador)
router.post('/', verifyToken, verifyRole(['admin', 'capacitador']), crearCapacitacion);

// Ver todas las capacitaciones
router.get('/', obtenerCapacitaciones);

// Unirse a una capacitación
router.post('/:id/unirse', verifyToken, unirseACapacitacion);

// Ver miembros inscritos
router.get('/:id/miembros', verifyToken, verifyRole(['admin', 'capacitador']), verMiembros);

// Ver progreso de un usuario en una capacitación
router.get('/:id/progreso', verifyToken, verProgreso);


export default router;
