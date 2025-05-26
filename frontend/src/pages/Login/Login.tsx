  "use client";

  import { useState } from "react";
  import { useNavigate } from "react-router-dom";
  import { login } from "../../services/auth";
  import { CardContainer, CardBody, CardItem } from "../../components/ui/3d-card";
  import { AuroraBackground } from "../../components/ui/aurora-background";
  import { motion } from "framer-motion";

  export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const res = await login({ email, password });
        localStorage.setItem("token", res.token);
        navigate("/capacitaciones");
      } catch {
        alert("Credenciales inválidas");
      }
    };

    return (
      <AuroraBackground>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8, ease: "easeInOut" }}
          className="relative flex flex-col items-center justify-center px-6 gap-8 max-w-xl mx-auto"
        >
          <h1
            className="
              text-4xl md:text-5xl font-extrabold text-center max-w-md
              bg-gradient-to-r text-white bg-clip-text 
              drop-shadow-lg leading-tight
            "
          >
            Bienvenido
          </h1>
          <CardContainer className="inter-var w-full z-10">
            <CardBody className="bg-[#0f172a]/85 backdrop-blur-md border border-gray-400/30 rounded-xl p-10 shadow-md max-w-lg mx-auto">
              <CardItem
                translateZ={50}
                className="text-3xl font-bold text-white select-none mb-8"
              >
                Iniciar sesión
              </CardItem>

              <form onSubmit={handleLogin} className="flex flex-col space-y-5 w-full max-w-lg mx-auto">
                <CardItem translateZ={40} className="w-full flex flex-col">
                  <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-lg border border-gray-400/30 bg-[#1e293b]/90 px-5 py-3 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </CardItem>

                <CardItem translateZ={40} className="w-full flex flex-col">
                  <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-lg border border-gray-400/30 bg-[#1e293b]/90 px-5 py-3 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </CardItem>

                <CardItem translateZ={30} className="w-full flex flex-col">
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 text-lg transition-all duration-300"
                  >
                    Entrar
                  </button>
                </CardItem>

                <div className="text-center mt-2">
                  <a
                    href="#"
                    className="text-sm text-blue-400 hover:text-blue-600 transition"
                    onClick={(e) => e.preventDefault()}
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
              </form>
            </CardBody>
          </CardContainer>
        </motion.div>
      </AuroraBackground>
    );
  }
