import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";

function App() {
  const { usuario } = useAuth();

  return (
    <>
      <Navbar />
      <main className="text-black p-6">
        <h1 className="text-2xl font-bold">
          Bienvenido a la Plataforma de Microlearning Empresarial
        </h1>
        {usuario && (
          <p className="text-black mt-4 font-bold text-2xl ">Hola, {usuario.nombre} 👋</p>
        )}
      </main>
    </>
  );
}

export default App;
