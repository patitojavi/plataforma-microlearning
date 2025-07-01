import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '@/components/Navbar';

// Interface que describe la estructura de una capacitación
interface Capacitacion {
  _id: string;
  titulo: string;
  descripcion: string;
  creador: { username: string };
  miembros?: string[];
}

export default function Capacitaciones() {
  // Estado para almacenar las capacitaciones obtenidas del backend
  const [capacitaciones, setCapacitaciones] = useState<Capacitacion[]>([]);

  // useEffect para obtener las capacitaciones al montar el componente
  useEffect(() => {
    const fetchCapacitaciones = async () => {
      try {
        const res = await axios.get('https://plataforma-microlearning-x4bz.onrender.com/api/capacitaciones');
        setCapacitaciones(res.data);
      } catch (err) {
        console.error('Error al obtener capacitaciones', err);
      }
    };
    fetchCapacitaciones();
  }, []);

  // Función para unirse a una capacitación (requiere token)
  const handleUnirse = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Debes iniciar sesión para unirte');
      return;
    }

    try {
      // Solicitud para unirse
      await axios.post(
        `https://plataforma-microlearning-x4bz.onrender.com/api/capacitaciones/${id}/unirse`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Obtener progreso luego de unirse
      const progresoRes = await axios.get(
        `https://plataforma-microlearning-x4bz.onrender.com/api/capacitaciones/${id}/progreso`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(`Te has unido a la capacitación. Progreso: ${progresoRes.data.progreso}%`);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al unirse');
    }
  };

  // Función para ver el progreso del usuario en una capacitación
  const handleVerProgreso = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Debes iniciar sesión para ver el progreso');
      return;
    }

    try {
      const res = await axios.get(
        `https://plataforma-microlearning-x4bz.onrender.com/api/capacitaciones/${id}/progreso`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Tu progreso en esta capacitación es: ${res.data.progreso}%`);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al obtener el progreso');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen pb-10">
      {/* Navbar superior */}
      <Navbar />

      {/* Título principal */}
      <h2 className="text-3xl font-bold text-center text-gray-800 mt-10 mb-8">
        📚 Capacitaciones disponibles
      </h2>

      {/* Lista de capacitaciones */}
      <div className="flex flex-wrap justify-center gap-6 px-4">
        {/* Mensaje si no hay capacitaciones */}
        {capacitaciones.length === 0 ? (
          <p className="text-gray-500 text-center">No hay capacitaciones disponibles por ahora.</p>
        ) : (
          // Renderizar tarjetas de capacitaciones
          capacitaciones.map(cap => (
            <div
              key={cap._id}
              className="bg-white rounded-2xl shadow-md w-full max-w-sm p-6 flex flex-col justify-between transition hover:shadow-lg"
            >
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{cap.titulo}</h3>
                <p className="text-gray-600 text-sm">{cap.descripcion}</p>
              </div>

              {/* Nombre del creador */}
              <p className="text-sm text-gray-500 mt-4">
                <strong>👤 Creado por:</strong> {cap.creador?.username || 'Desconocido'}
              </p>

              {/* Botones de acción */}
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => handleUnirse(cap._id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  Unirse
                </button>
                <button
                  onClick={() => handleVerProgreso(cap._id)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  Ver progreso
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
