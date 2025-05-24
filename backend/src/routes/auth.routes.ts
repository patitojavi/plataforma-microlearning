import { Router } from 'express'; 
import { register, login } from '../controllers/auth.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'Acceso concedido solo con token válido' });
});

export default router;
