
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../../services/auth";
import { CardContainer, CardBody, CardItem } from "../../components/ui/3d-card";
import { AuroraBackground } from "../../components/ui/aurora-background";
import { motion } from "framer-motion";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { cn } from "../../lib/utils";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  // Estado para correo y contraseña
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { setUsuario } = useAuth(); // Acceso al contexto de autenticación

  // Función que maneja el inicio de sesión al enviar el formulario
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login({ email, password });

      // Guardar token e información del usuario autenticado
      localStorage.setItem("token", res.token);
      setUsuario({
        _id: res.user._id, 
        nombre: res.user.username,
        email: res.user.email,
        rut: res.user.rut,
        role: res.user.role,
      });

      // Redirige a la vista principal
      navigate("/capacitaciones");
    } catch {
      alert("Credenciales inválidas");
    }
  };

  return (
    <AuroraBackground>
      {/* Contenedor animado del formulario */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.8, ease: "easeInOut" }}
        className="relative flex flex-col items-center justify-center px-6 gap-8 max-w-xl mx-auto"
      >
        {/* Título de bienvenida */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-center max-w-md bg-gradient-to-r text-white bg-clip-text drop-shadow-lg leading-tight">
          Bienvenido 
        </h1>

        {/* Tarjeta 3D con el formulario */}
        <CardContainer className="inter-var w-full z-10">
          <CardBody className="bg-[#0f172a]/85 backdrop-blur-md border border-gray-400/30 rounded-xl px-8 py-14 shadow-md w-full max-w-2xl mx-auto overflow-visible min-h-[450px]">
            
            {/* Título del formulario */}
            <CardItem translateZ={50} className="text-3xl font-bold text-white select-none mb-8">
              Iniciar sesión
            </CardItem>

            <form onSubmit={handleLogin} className="flex flex-col space-y-5 w-full mx-auto">
              
              {/* Campo de correo electrónico */}
              <CardItem translateZ={40} className="w-full flex flex-col">
                <LabelInputContainer>
                  <Label htmlFor="email" className="text-white">
                    Correo electrónico
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ejemplo@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-[#1e293b]/90 text-white placeholder-white"
                  />
                </LabelInputContainer>
              </CardItem>

              {/* Campo de contraseña */}
              <CardItem translateZ={40} className="w-full flex flex-col">
                <LabelInputContainer>
                  <Label htmlFor="password" className="text-white">
                    Contraseña
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-[#1e293b]/90 text-white placeholder-white"
                  />
                </LabelInputContainer>
              </CardItem>

              {/* Botón de enviar */}
              <CardItem translateZ={30} className="w-full flex flex-col relative">
                <button
                  type="submit"
                  className="group/btn w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 text-lg transition-all duration-300 relative"
                >
                  Entrar
                  <BottomGradient />
                </button>
              </CardItem>

              {/* Enlaces secundarios */}
              <CardItem translateZ={20} className="w-full flex flex-col text-center space-y-2 mt-4">
                <Link to="/register" className="text-sm text-blue-400 hover:text-blue-600 transition">
                  ¿No tienes cuenta? Regístrate aquí
                </Link>
                <Link
                  to="#"
                  className="text-sm text-blue-400 hover:text-blue-600 transition"
                  onClick={(e) => e.preventDefault()}
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </CardItem>
            </form>
          </CardBody>
        </CardContainer>
      </motion.div>
    </AuroraBackground>
  );
}

// Componente decorativo: línea brillante debajo del botón
const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
  </>
);

// Contenedor reutilizable para agrupar Label + Input con espaciado
const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};
