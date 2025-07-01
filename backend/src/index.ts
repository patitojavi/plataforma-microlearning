import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import capacitacionRoutes from './routes/capacitacion.routes';
import evaluacionRoutes from './routes/evaluacion.routes';



dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());




app.get('/', (_req, res) => {
  res.send('🎉 Plataforma Microlearning Backend en línea');
});




app.use('/api/auth', authRoutes);
app.use('/api/usuarios', userRoutes);
app.use('/api/capacitaciones', capacitacionRoutes);
app.use('/api/evaluaciones', evaluacionRoutes);



connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
