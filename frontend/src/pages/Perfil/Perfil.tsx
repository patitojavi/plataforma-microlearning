import { useAuth } from "../../context/AuthContext";

export default function PerfilCliente() {
  const { usuario } = useAuth();

  if (!usuario) return <p>Cargando usuario...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">HI, {usuario.nombre}</h2>
      <p>Email: {usuario.email}</p>
    </div>
  );
}
