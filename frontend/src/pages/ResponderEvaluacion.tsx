import { useState } from 'react';
import { responderEvaluacion } from '../services/evaluacion';
import Navbar from '../components/Navbar';

export default function ResponderEvaluacion() {
  const [evaluacionId, setEvaluacionId] = useState('');
  const [respuestas, setRespuestas] = useState<string[]>(['', '']);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return alert('Debes iniciar sesión');

    try {
      const res = await responderEvaluacion({ evaluacionId, respuestas }, token);
      alert(`Puntaje: ${res.puntaje}\nInsignia obtenida: ${res.insignias[0]}`);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al enviar respuestas');
    }
  };

  return (
    <div>
      <Navbar />
      <h2>Responder Evaluación</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="ID de Evaluación"
          value={evaluacionId}
          onChange={e => setEvaluacionId(e.target.value)}
        />
        <h4>Pregunta 1:</h4>
        <input
          placeholder="Respuesta 1"
          value={respuestas[0]}
          onChange={e => {
            const newResp = [...respuestas];
            newResp[0] = e.target.value;
            setRespuestas(newResp);
          }}
        />
        <h4>Pregunta 2:</h4>
        <input
          placeholder="Respuesta 2"
          value={respuestas[1]}
          onChange={e => {
            const newResp = [...respuestas];
            newResp[1] = e.target.value;
            setRespuestas(newResp);
          }}
        />
        <button type="submit">Enviar Respuestas</button>
      </form>
    </div>
  );
}
