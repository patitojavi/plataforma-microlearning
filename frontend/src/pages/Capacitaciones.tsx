import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

interface Capacitacion {
  _id: string;
  titulo: string;
  descripcion: string;
  creador: { username: string };
  miembros?: string[];
}

export default function Capacitaciones() {
  const [capacitaciones, setCapacitaciones] = useState<Capacitacion[]>([]);

  useEffect(() => {
    const fetchCapacitaciones = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/capacitaciones');
        setCapacitaciones(res.data);
      } catch (err) {
        console.error('Error al obtener capacitaciones', err);
      }
    };
    fetchCapacitaciones();
  }, []);

  const handleUnirse = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Debes iniciar sesión para unirte');
      return;
    }

    try {
      await axios.post(`http://localhost:5000/api/capacitaciones/${id}/unirse`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const progresoRes = await axios.get(`http://localhost:5000/api/capacitaciones/${id}/progreso`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert(`Te has unido a la capacitación. Progreso: ${progresoRes.data.progreso}%`);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al unirse');
    }
  };
  const handleVerProgreso = async (id: string) => {
    const token = localStorage.getItem('token');
      if (!token) {
        alert('Debes iniciar sesión para ver el progreso');
        return;
      }

      try {
        const res = await axios.get(`http://localhost:5000/api/capacitaciones/${id}/progreso`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert(`Tu progreso en esta capacitación es: ${res.data.progreso}%`);
      } catch (err: any) {
        alert(err.response?.data?.message || 'Error al obtener el progreso');
      }
};

  return (
    <div>
      <Navbar />
      <h2>Capacitaciones disponibles</h2>
      {capacitaciones.map(cap => (
        <div key={cap._id} style={{ border: '1px solid gray', padding: '1rem', margin: '1rem 0' }}>
          <h3>{cap.titulo}</h3>
          <p>{cap.descripcion}</p>
          <p><strong>Creado por:</strong> {cap.creador?.username || 'Desconocido'}</p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <button onClick={() => handleUnirse(cap._id)}>Unirse</button>
            <button onClick={() => handleVerProgreso(cap._id)}>Ver progreso</button>
          </div>
        </div>
      ))}
    </div>
  );
}
