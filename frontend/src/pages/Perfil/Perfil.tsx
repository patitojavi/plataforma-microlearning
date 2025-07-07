import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";

export default function PerfilCliente() {
  const { usuario } = useAuth(); // Obtener usuario desde el contexto
  const [insignias, setInsignias] = useState<string[]>([]);

  // Cargar insignias del backend al montar el componente
  useEffect(() => {
    if (!usuario || !usuario._id) return;

    const fetchInsignias = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `https://plataforma-microlearning-x4bz.onrender.com/api/usuarios/${usuario._id}/badges`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (Array.isArray(res.data.badges)) {
          setInsignias(res.data.badges);
        }
      } catch (error) {
        console.error("Error al obtener insignias:", error);
      }
    };

    fetchInsignias();
  }, [usuario]);

  if (!usuario) return <p className="text-center mt-4">Cargando usuario...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-xl border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Perfil del Cliente</h2>

      {/* Datos principales del usuario */}
      <div className="space-y-2">
        <p><span className="font-semibold">Nombre de usuario:</span> {usuario.nombre}</p>
        <p><span className="font-semibold">Email:</span> {usuario.email}</p>
        <p><span className="font-semibold">RUT:</span> {usuario.rut}</p>
        <p><span className="font-semibold">Rol:</span> {usuario.role}</p>
      </div>

      {/* Insignias obtenidas */}
      {insignias.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">🎖️ Insignias obtenidas</h3>
          <div className="flex flex-wrap gap-2">
            {insignias.map((badge, index) => (
              <span
                key={index}
                className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
