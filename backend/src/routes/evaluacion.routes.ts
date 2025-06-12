import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.middleware';
import { verifyRole } from '../middlewares/role.middleware';
import { crearEvaluacion, responderEvaluacion } from '../controllers/evaluacion.controller';

const router = Router();

router.post('/', verifyToken, verifyRole(['admin', 'capacitador']), crearEvaluacion);
router.post('/responder', verifyToken, responderEvaluacion);

export default router;
