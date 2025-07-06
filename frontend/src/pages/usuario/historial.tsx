import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '@/components/Navbar';

// Interface que describe la estructura de una capacitación
interface Capacitacion {
  _id: string;
  titulo: string;
  descripcion: string;
  creador: { username: string };
  contenido: string; // URL del video
  videoUrl?: string; // Video asociado
  miembros?: string[]; // Lista de miembros
  yaInscrito: boolean; // Indica si el usuario ya está inscrito en la capacitación
}

export default function MisCapacitaciones() {
  const [misCapacitaciones, setMisCapacitaciones] = useState<Capacitacion[]>([]); 

  // Obtener las "Mis capacitaciones" desde la API
  useEffect(() => {
    const fetchCapacitaciones = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await axios.get('https://plataforma-microlearning-x4bz.onrender.com/api/mis-capacitaciones', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Mostrar los datos obtenidos para depurar
        console.log("Datos recibidos del backend:", res.data);

        // Filtramos las capacitaciones donde el usuario está inscrito (yaInscrito = true)
        const capacitacionesInscritas = res.data.filter((cap: Capacitacion) => cap.yaInscrito);
        console.log("Capacitaciones en las que el usuario está inscrito:", capacitacionesInscritas); // Verifica las capacitaciones filtradas

        setMisCapacitaciones(capacitacionesInscritas);

      } catch (err) {
        console.error('Error al obtener las capacitaciones', err);
      }
    };

    fetchCapacitaciones();
  }, []);

  // Manejar la visualización del progreso del curso
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
      <Navbar />
      
      {/* Sección de "Mis capacitaciones" */}
      <h2 className="text-3xl font-bold text-center text-gray-800 mt-10 mb-8">
        📚 Mis capacitaciones
      </h2>

      <div className="flex flex-wrap justify-center gap-6 px-4">
        {misCapacitaciones.length === 0 ? (
          <p className="text-gray-500 text-center">No tienes capacitaciones disponibles.</p>
        ) : (
          misCapacitaciones.map((cap) => (
            <div
              key={cap._id}
              className="bg-white rounded-2xl shadow-md w-full max-w-sm p-6 flex flex-col justify-between transition hover:shadow-lg"
            >
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2 cursor-pointer">
                  {cap.titulo}
                </h3>
                <p className="text-gray-600 text-sm">{cap.descripcion}</p>
              </div>

              <p className="text-sm text-gray-500 mt-4">
                <strong>👤 Creado por:</strong> {cap.creador?.username || 'Desconocido'}
              </p>

              <div className="flex justify-between mt-6">
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
