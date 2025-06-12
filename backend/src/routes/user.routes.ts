import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.middleware';
import { verifyRole } from '../middlewares/role.middleware';

const router = Router();

// Ruta solo para admin
router.get('/admin', verifyToken, verifyRole(['admin']), (req, res) => {
  console.log('✅ Acceso correcto como ADMIN');
  res.json({ message: 'Bienvenido administrador' });
});

// Ruta solo para capacitador
router.get('/capacitador', verifyToken, verifyRole(['capacitador']), (req, res) => {
  console.log('✅ Acceso correcto como CAPACITADOR');
  res.json({ message: 'Bienvenido capacitador' });
});

// Ruta accesible por admin o capacitador
router.get('/privado', verifyToken, verifyRole(['admin', 'capacitador']), (req, res) => {
  const rol = req.user?.role;
  console.log(`✅ Acceso correcto como ${rol?.toUpperCase()}`);
  res.json({ message: `Hola ${rol}, puedes ver esta ruta privada` });
});

// Ruta para cualquier usuario logueado
router.get('/normal', verifyToken, (req, res) => {
  console.log('✅ Acceso como usuario logueado (cualquier rol)');
  res.json({ message: 'Bienvenido, usuario con token válido' });
});

export default router;
