import { useAuth } from "../../context/AuthContext";

export default function PerfilCliente() {
  const { usuario } = useAuth();

  if (!usuario) return <p className="text-center mt-4">Cargando usuario...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-xl border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Perfil del Cliente</h2>
      <div className="space-y-2">
        <p><span className="font-semibold">Nombre de usuario:</span> {usuario.nombre}</p>
        <p><span className="font-semibold">Email:</span> {usuario.email}</p>
        <p><span className="font-semibold">RUT:</span> {usuario.rut}</p>
        <p><span className="font-semibold">Rol:</span> {usuario.role}</p>
      </div>
    </div>
  );
}
