import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.middleware';
import { verifyRole } from '../middlewares/role.middleware';
import {
  obtenerUsuarios,
  obtenerUsuario,
  actualizarUsuario,
  eliminarUsuario,
  obtenerBadgesUsuario
} from '../controllers/user.controller';

const router = Router();

// GET /api/usuarios/admin - Ruta solo para administradores
// Esta ruta permite a los administradores acceder a su sección
router.get('/admin', verifyToken, verifyRole(['admin']), (req, res) => {
  console.log('✅ Acceso correcto como ADMIN');
  res.json({ message: 'Bienvenido administrador' });
});


// GET /api/usuarios - Obtener todos los usuarios (solo admin)
// Esta ruta permite a los administradores ver todos los usuarios registrados
router.get('/', verifyToken, verifyRole(['admin']), obtenerUsuarios);


// GET /api/usuarios/capacitador - Ruta solo para capacitadores
// Esta ruta permite a los capacitadores acceder a su sección
router.get('/capacitador', verifyToken, verifyRole(['capacitador']), (req, res) => {
  console.log('✅ Acceso correcto como CAPACITADOR');
  res.json({ message: 'Bienvenido capacitador' });
});


// GET /api/usuarios/:id - Obtener un usuario por ID (solo admin)
// Esta ruta permite a los administradores obtener información de un usuario específico
router.get('/:id', verifyToken, verifyRole(['admin']), obtenerUsuario);


// PUT /api/usuarios/:id - Actualizar un usuario (solo admin)
// Esta ruta permite a los administradores actualizar la información de un usuario específico
router.put('/:id', verifyToken, verifyRole(['admin']), actualizarUsuario);


// GET /api/usuarios/normal - Ruta para cualquier usuario logueado
// Esta ruta permite a cualquier usuario autenticado acceder a su sección
router.get('/normal', verifyToken, (req, res) => {
  console.log('✅ Acceso como usuario logueado (cualquier rol)');
  res.json({ message: 'Bienvenido, usuario con token válido' });
});

// DELETE /api/usuarios/:id - Eliminar un usuario (solo admin)
// Esta ruta permite a los administradores eliminar un usuario específico
router.delete('/:id', verifyToken, verifyRole(['admin']), eliminarUsuario);


// GET /api/usuarios/:id/badges - Obtener badges de un usuario por ID
// Esta ruta permite a cualquier usuario autenticado ver los badges de un usuario específico
router.get('/:id/badges', verifyToken, obtenerBadgesUsuario);

export default router;