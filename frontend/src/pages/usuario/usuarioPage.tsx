import AppNavbar from "@/components/Navbar";
import { FaUserCircle } from "react-icons/fa";

export default function UsuarioPage() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <AppNavbar />
      <div className="flex flex-col items-center justify-center pt-24 px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="flex justify-center mb-4">
            <FaUserCircle className="text-indigo-600" size={64} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">¡Bienvenido/a!</h1>
          <p className="text-gray-600 mb-6">Estás en tu panel de usuario.</p>
        </div>
      </div>
    </div>
  );
}
