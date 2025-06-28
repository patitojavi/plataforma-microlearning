import { useState } from 'react';
import { responderEvaluacion } from '@/services/evaluacion';
import Navbar from '@/components/Navbar';

export default function ResponderEvaluacion() {
  // Estado para el ID de la evaluación y las respuestas del usuario
  const [evaluacionId, setEvaluacionId] = useState('');
  const [respuestas, setRespuestas] = useState<string[]>(['', '']); // Dos preguntas como ejemplo

  // Maneja el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Previene el recargo de la página
    const token = localStorage.getItem('token');
    if (!token) return alert('Debes iniciar sesión');

    try {
      // Enviar respuestas al backend
      const res = await responderEvaluacion({ evaluacionId, respuestas }, token);
      alert(`✅ Puntaje: ${res.puntaje}\n🎖️ Insignia obtenida: ${res.insignias[0]}`);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al enviar respuestas');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navbar común en toda la app */}
      <Navbar />

      {/* Contenedor central con el formulario */}
      <div className="max-w-xl mx-auto bg-white shadow-md rounded-xl p-8 mt-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">📝 Responder Evaluación</h2>
        
        {/* Formulario con preguntas fijas (2) */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Campo para ingresar el ID de la evaluación */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ID de Evaluación</label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-400"
              placeholder="ID de Evaluación"
              value={evaluacionId}
              onChange={e => setEvaluacionId(e.target.value)}
              required
            />
          </div>

          {/* Pregunta 1 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Pregunta 1</label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-400"
              placeholder="Respuesta 1"
              value={respuestas[0]}
              onChange={e => {
                const newResp = [...respuestas];
                newResp[0] = e.target.value;
                setRespuestas(newResp);
              }}
              required
            />
          </div>

          {/* Pregunta 2 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Pregunta 2</label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-400"
              placeholder="Respuesta 2"
              value={respuestas[1]}
              onChange={e => {
                const newResp = [...respuestas];
                newResp[1] = e.target.value;
                setRespuestas(newResp);
              }}
              required
            />
          </div>

          {/* Botón para enviar respuestas */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-lg shadow"
            >
              Enviar Respuestas
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
