import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '@/components/Navbar';

interface Curso {
  _id: string;
  titulo: string;
  descripcion: string;
}

interface CursoCompletado extends Curso {
  progreso: number;
}

export default function HistorialCursos() {
  const [cursos, setCursos] = useState<CursoCompletado[]>([]);

  useEffect(() => {
    const fetchCursosCompletados = async () => {
      const token = localStorage.getItem('token');
      if (!token) return alert('Debes iniciar sesión');

      try {
        // Obtener todas las capacitaciones
        const res = await axios.get('https://plataforma-microlearning-x4bz.onrender.com/api/capacitaciones', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const todas: Curso[] = res.data;

        // Para cada curso, obtener su progreso
        const completados: CursoCompletado[] = [];

        for (const curso of todas) {
          try {
            const progresoRes = await axios.get(
              `https://plataforma-microlearning-x4bz.onrender.com/api/capacitaciones/${curso._id}/progreso`,
              {
                headers: { Authorization: `Bearer ${token}` }
              }
            );

            const progreso = progresoRes.data.progreso;

            if (progreso === 100) {
              completados.push({ ...curso, progreso });
            }
          } catch (err: any) {
            // ignorar errores individuales de progreso
            console.warn(`Error al obtener progreso de ${curso.titulo}`);
          }
        }

        setCursos(completados);
      } catch (err: any) {
        alert(err.response?.data?.message || 'Error al obtener historial');
      }
    };

    fetchCursosCompletados();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen pb-10">
      <Navbar />
      <h2 className="text-3xl font-bold text-center text-gray-800 mt-10 mb-8">
        🏆 Historial de Cursos Completados
      </h2>

      <div className="flex flex-wrap justify-center gap-6 px-4">
        {cursos.length === 0 ? (
          <p className="text-gray-500 text-center">No has completado ninguna capacitación aún.</p>
        ) : (
          cursos.map(curso => (
            <div
              key={curso._id}
              className="bg-white rounded-2xl shadow-md w-full max-w-sm p-6 transition hover:shadow-lg"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{curso.titulo}</h3>
              <p className="text-gray-600 text-sm">{curso.descripcion}</p>
              <p className="mt-4 text-green-600 font-bold text-sm">✅ Completado al 100%</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}