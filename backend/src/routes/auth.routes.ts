import { Router } from 'express'; 
import { register, login } from '../controllers/auth.controller';
import { verifyToken } from '../middlewares/auth.middleware';


const router = Router();


// Rutas de autenticación

// POST /api/auth/register - Registrar un nuevo usuario
router.post('/register', register);

// POST /api/auth/login - Iniciar sesión y obtener token
router.post('/login', login);


router.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'Acceso concedido solo con token válido' });
});

export default router;
