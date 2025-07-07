import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';

interface Capacitacion {
  _id: string;
  titulo: string;
  descripcion: string;
  creador: { username: string };
  contenido: string;
  videoUrl?: string;
  miembros?: string[];
}

declare global {
  interface Window {
    YT: any;
  }
}

export default function MisCapacitaciones() {
  const [misCapacitaciones, setMisCapacitaciones] = useState<Capacitacion[]>([]);
  const [cursoSeleccionadoId, setCursoSeleccionadoId] = useState<string | null>(null);
  const [videoProgress, setVideoProgress] = useState<number>(0);
  const [player, setPlayer] = useState<any>(null);
  const [progresos, setProgresos] = useState<Record<string, number>>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCapacitaciones = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await axios.get('https://plataforma-microlearning-x4bz.onrender.com/api/capacitaciones', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.id;

        const filtradas = res.data.filter((cap: Capacitacion) =>
          cap.miembros?.includes(userId)
        );

        setMisCapacitaciones(filtradas);
      } catch (err) {
        console.error('Error al obtener las capacitaciones', err);
      }
    };

    fetchCapacitaciones();
  }, []);

  const getYouTubeEmbedUrl = (url: string) => {
    try {
      const videoId = new URL(url).searchParams.get('v');
      return videoId ? `https://www.youtube.com/embed/${videoId}?enablejsapi=1` : '';
    } catch (error) {
      console.error('Error al procesar la URL del video:', error);
      return '';
    }
  };

  const onPlayerStateChange = (event: any) => {
    const progress = (event.target.getCurrentTime() / event.target.getDuration()) * 100;
    const rounded = Math.floor(progress);
    setVideoProgress(rounded);

    if (rounded >= 100 && cursoSeleccionadoId) {
      updateProgreso(cursoSeleccionadoId, 100);
      setTimeout(() => {
        navigate('/responder');
      }, 2000);
    }
  };

  const updateProgreso = async (cursoId: string, progress: number) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await axios.post(
        `https://plataforma-microlearning-x4bz.onrender.com/api/capacitaciones/${cursoId}/progreso`,
        { progreso: progress },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('✅ Progreso actualizado');
    } catch (err) {
      console.error('Error al actualizar el progreso', err);
    }
  };

  const onYouTubeIframeAPIReady = () => {
    const selectedCap = misCapacitaciones.find(cap => cap._id === cursoSeleccionadoId);
    if (!selectedCap?.videoUrl) return;

    const videoId = new URL(selectedCap.videoUrl).searchParams.get('v');
    if (!videoId) return;

    const newPlayer = new window.YT.Player(`video-${cursoSeleccionadoId}`, {
      videoId,
      events: {
        onStateChange: onPlayerStateChange,
        onReady: () => console.log('🎬 Reproductor listo'),
      }
    });
    setPlayer(newPlayer);
  };

  useEffect(() => {
    if (cursoSeleccionadoId) {
      if (window.YT && window.YT.Player) {
        onYouTubeIframeAPIReady();
      } else {
        const script = document.createElement('script');
        script.src = "https://www.youtube.com/iframe_api";
        script.onload = () => onYouTubeIframeAPIReady();
        document.body.appendChild(script);
      }
    }
  }, [cursoSeleccionadoId]);

  return (
    <div className="bg-gray-100 min-h-screen pb-10">
      <Navbar />
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
              className="bg-white rounded-2xl shadow-md w-full max-w-sm p-6 transition hover:shadow-lg flex flex-col"
            >
              <div>
                <h3
                  className="text-xl font-semibold text-gray-800 mb-2 cursor-pointer"
                  onClick={() => setCursoSeleccionadoId(cap._id)}
                >
                  {cap.titulo}
                </h3>
                <p className="text-gray-600 text-sm">{cap.descripcion}</p>
              </div>

              <p className="text-sm text-gray-500 mt-4">
                <strong>👤 Creado por:</strong> {cap.creador?.username || 'Desconocido'}
              </p>

              <div className="flex justify-between mt-4">
                <button
                  onClick={async () => {
                    setCursoSeleccionadoId(cap._id);
                    try {
                      const token = localStorage.getItem('token');
                      const res = await axios.get(
                        `https://plataforma-microlearning-x4bz.onrender.com/api/capacitaciones/${cap._id}/progreso`,
                        { headers: { Authorization: `Bearer ${token}` } }
                      );
                      setProgresos(prev => ({ ...prev, [cap._id]: res.data.progreso }));
                    } catch (err) {
                      console.error('Error al obtener el progreso del curso', err);
                      setProgresos(prev => ({ ...prev, [cap._id]: 0 }));
                    }
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  Ver progreso
                </button>
              </div>

              {cursoSeleccionadoId === cap._id && progresos[cap._id] !== undefined && (
                <p className="mt-2 text-blue-700 font-semibold text-sm">
                  Progreso del curso: {progresos[cap._id]}%
                </p>
              )}

              {cursoSeleccionadoId === cap._id && cap.videoUrl && (
                <div className="mt-4">
                  <iframe
                    width="100%"
                    height="315"
                    id={`video-${cap._id}`}
                    src={getYouTubeEmbedUrl(cap.videoUrl)}
                    frameBorder="0"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}

              {cursoSeleccionadoId === cap._id && (
                <div className="mt-4">
                  <p>Progreso del video: {videoProgress}%</p>
                  {videoProgress === 100 && (
                    <button
                      onClick={() => navigate('/responder')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      Redirigir a Evaluación
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
