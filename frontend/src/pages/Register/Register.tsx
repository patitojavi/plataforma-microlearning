"use client";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../../services/auth";
import { CardContainer, CardBody, CardItem } from "../../components/ui/3d-card";
import { AuroraBackground } from "../../components/ui/aurora-background";
import { motion } from "framer-motion";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { cn } from "../../lib/utils";

export default function Register() {
  const [form, setForm] = useState({ email: "", username: "", rut: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await register(form);
      localStorage.setItem("token", res.token);
      navigate("/capacitaciones");
    } catch (err) {
      console.log(err)
      alert("Error al registrar");
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
        <h1 className="text-4xl md:text-5xl font-extrabold text-center max-w-md bg-gradient-to-r text-white bg-clip-text drop-shadow-lg leading-tight">
          Crear cuenta
        </h1>

        <CardContainer className="inter-var w-full z-10">
          <CardBody className="bg-[#0f172a]/85 backdrop-blur-md border border-gray-400/30 rounded-xl px-8 py-14 shadow-md w-full max-w-2xl mx-auto overflow-visible min-h-[600px]">
            <CardItem translateZ={50} className="text-3xl font-bold text-white select-none mb-8">
              Registro
            </CardItem>

            <form onSubmit={handleRegister} className="flex flex-col space-y-5 w-full mx-auto">
              <CardItem translateZ={40} className="w-full flex flex-col">
                <LabelInputContainer>
                  <Label htmlFor="email" className="text-white">
                    Correo electrónico
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="ejemplo@correo.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="bg-[#1e293b]/90 text-white placeholder-white"
                  />
                </LabelInputContainer>
              </CardItem>

              <CardItem translateZ={40} className="w-full flex flex-col">
                <LabelInputContainer>
                  <Label htmlFor="username" className="text-white">
                    Nombre de usuario
                  </Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="usuario"
                    value={form.username}
                    onChange={handleChange}
                    required
                    className="bg-[#1e293b]/90 text-white placeholder-white"
                  />
                </LabelInputContainer>
              </CardItem>

              <CardItem translateZ={40} className="w-full flex flex-col">
                <LabelInputContainer>
                  <Label htmlFor="rut" className="text-white">
                    RUT
                  </Label>
                  <Input
                    id="rut"
                    name="rut"
                    type="text"
                    placeholder="12345678-9"
                    value={form.rut}
                    onChange={handleChange}
                    required
                    className="bg-[#1e293b]/90 text-white placeholder-white"
                  />
                </LabelInputContainer>
              </CardItem>

              <CardItem translateZ={40} className="w-full flex flex-col">
                <LabelInputContainer>
                  <Label htmlFor="password" className="text-white">
                    Contraseña
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="bg-[#1e293b]/90 text-white placeholder-white"
                  />
                </LabelInputContainer>
              </CardItem>

              <CardItem translateZ={30} className="w-full flex flex-col relative">
                <button
                  type="submit"
                  className="group/btn w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 text-lg transition-all duration-300 relative"
                >
                  Registrarse
                  <BottomGradient />
                </button>
              </CardItem>

              <CardItem translateZ={20} className="w-full flex flex-col text-center space-y-2 mt-4">
                <Link to="/login" className="text-sm text-blue-400 hover:text-blue-600 transition">
                  ¿Ya tienes cuenta? <span className="underline">Inicia sesión</span>
                </Link>
              </CardItem>
            </form>
          </CardBody>
        </CardContainer>
      </motion.div>
    </AuroraBackground>
  );
}

const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
  </>
);

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={cn("flex w-full flex-col space-y-2", className)}>{children}</div>;
};
