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

// Ruta solo para admin
router.get('/admin', verifyToken, verifyRole(['admin']), (req, res) => {
  console.log('✅ Acceso correcto como ADMIN');
  res.json({ message: 'Bienvenido administrador' });
});
// Obtener todos los usuarios
router.get('/', verifyToken, verifyRole(['admin']), obtenerUsuarios);

// Ruta solo para capacitador
router.get('/capacitador', verifyToken, verifyRole(['capacitador']), (req, res) => {
  console.log('✅ Acceso correcto como CAPACITADOR');
  res.json({ message: 'Bienvenido capacitador' });
});
// Obtener un usuario por ID
router.get('/:id', verifyToken, verifyRole(['admin']), obtenerUsuario);


// Actualizar un usuario
router.put('/:id', verifyToken, verifyRole(['admin']), actualizarUsuario);

// Ruta para cualquier usuario logueado
router.get('/normal', verifyToken, (req, res) => {
  console.log('✅ Acceso como usuario logueado (cualquier rol)');
  res.json({ message: 'Bienvenido, usuario con token válido' });
});
// Eliminar un usuario
router.delete('/:id', verifyToken, verifyRole(['admin']), eliminarUsuario);

router.get('/:id/badges', verifyToken, obtenerBadgesUsuario);

export default router;