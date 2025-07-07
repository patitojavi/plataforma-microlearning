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
}

export default function MisCapacitaciones() {
  const [misCapacitaciones, setMisCapacitaciones] = useState<Capacitacion[]>([]); // Estado para "Mis capacitaciones"
  const [cursoSeleccionadoId, setCursoSeleccionadoId] = useState<string | null>(null); // Estado para curso seleccionado

  // Obtener las "Mis capacitaciones" desde la API
  useEffect(() => {
    const fetchCapacitaciones = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await axios.get('https://plataforma-microlearning-x4bz.onrender.com/api/capacitaciones', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Establecemos las capacitaciones en las que el usuario está inscrito
        setMisCapacitaciones(res.data);

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

  // Función para convertir la URL de YouTube al formato embed
  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = new URL(url).searchParams.get('v');
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return '';
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
                <h3
                  className="text-xl font-semibold text-gray-800 mb-2 cursor-pointer"
                  onClick={() => setCursoSeleccionadoId(cap._id)} // Selecciona el curso cuando se hace clic
                >
                  {cap.titulo}
                </h3>
                <p className="text-gray-600 text-sm">{cap.descripcion}</p>
              </div>

              <p className="text-sm text-gray-500 mt-4">
                <strong>👤 Creado por:</strong> {cap.creador?.username || 'Desconocido'}
              </p>

              <div className="flex justify-between mt-6">
                {/* Solo el botón de ver progreso */}
                <button
                  onClick={() => handleVerProgreso(cap._id)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  Ver progreso
                </button>
              </div>

              {/* Mostrar video solo si el curso seleccionado es este y tiene un videoUrl */}
              {cursoSeleccionadoId === cap._id && cap.videoUrl && (
                <div className="mt-4">
                  <iframe
                    width="100%"
                    height="315"
                    src={getYouTubeEmbedUrl(cap.videoUrl)} // Usamos la URL convertida
                    frameBorder="0"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
