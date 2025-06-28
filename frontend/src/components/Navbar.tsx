import { useState, useRef, useEffect } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { useAuth } from "../context/AuthContext";

// Componente de logo SVG personalizado
export const AcmeLogo = () => (
  <svg fill="none" height="32" viewBox="0 0 32 32" width="32">
    <path
      d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
      fill="currentColor"
    />
  </svg>
);

export default function AppNavbar() {
  // Estados para menús y referencia al dropdown de cuenta
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCuentaOpen, setIsCuentaOpen] = useState(false);
  const [isCuentaMobileOpen, setIsCuentaMobileOpen] = useState(false);
  const navigate = useNavigate();
  const cuentaRef = useRef(null);
  const { usuario, setUsuario } = useAuth();
  const role = usuario?.role || null;

  // Cierre de sesión: limpia token, usuario y redirige a login
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUsuario(null);
    setIsMenuOpen(false);
    setIsCuentaOpen(false);
    setIsCuentaMobileOpen(false);
    navigate("/login");
  };

  // Define la ruta del logo según el rol del usuario
  const getLogoRoute = () => {
    switch (role) {
      case "usuario":
        return "/usuario";
      default:
        return "/";
    }
  };

  // Redirección automática a /usuario si el usuario está autenticado
  useEffect(() => {
    if (role === "usuario" && window.location.pathname === "/") {
      navigate("/usuario");
    }
  }, [role, navigate]);

  // Cierra el menú de cuenta si se hace clic fuera de él
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cuentaRef.current && !(cuentaRef.current as any).contains(event.target)) {
        setIsCuentaOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Enlaces principales de navegación
  const menuItems = [
    { name: "Capacitaciones", path: "/capacitaciones" },
    { name: "Responder Evaluación", path: "/responder" },
    { name: "Historial de Cursos", path: "/historial" },
  ];

  return (
    <>
      {/* Barra de navegación principal (desktop y mobile) */}
      <Navbar
        className="bg-indigo-950 text-white shadow-sm"
        isBordered
        onMenuOpenChange={setIsMenuOpen}
        style={{ minHeight: "64px" }}
      >
        {/* Contenido izquierdo del navbar */}
        <NavbarContent className="items-center">
          {/* Botón para abrir/cerrar el menú lateral (solo en móvil) */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="sm:hidden text-xl text-white"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
          </button>

          {/* Logo y nombre de la aplicación */}
          <NavbarBrand className="ml-1 flex items-center">
            <AcmeLogo />
            <NavLink
              to={getLogoRoute()}
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `ml-2 font-semibold text-white text-base leading-none ${isActive ? "text-blue-400" : ""}`
              }
            >
              SkillBits
            </NavLink>
          </NavbarBrand>
        </NavbarContent>

        {/* Menú principal para pantallas grandes */}
        <NavbarContent className="hidden sm:flex flex-1 items-center" justify="between">
          <div className="flex gap-6 justify-center flex-1">
            {menuItems.map((item, index) => (
              <NavbarItem key={index}>
                <NavLink
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `text-sm transition text-white hover:underline ${isActive ? "text-blue-400" : ""}`
                  }
                >
                  {item.name}
                </NavLink>
              </NavbarItem>
            ))}
          </div>

          {/* Menú de cuenta (desktop) */}
          <NavbarItem className="relative" ref={cuentaRef}>
            <button
              onClick={() => setIsCuentaOpen(!isCuentaOpen)}
              className="text-sm px-4 py-1 rounded-full border border-white text-white bg-transparent hover:bg-white/10 transition flex items-center gap-1"
              aria-haspopup="true"
              aria-expanded={isCuentaOpen}
            >
              👤 {usuario?.nombre ?? "Cuenta"}
              <svg
                className={`w-4 h-4 ml-1 transition-transform ${isCuentaOpen ? "rotate-180" : "rotate-0"}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {/* Dropdown del usuario */}
            {isCuentaOpen && (
              <div
                className="absolute right-0 mt-2 w-40 bg-[#0f172a] border border-white/20 rounded shadow-lg z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <ul>
                  {usuario && (
                    <>
                      <li className="px-4 py-2 text-sm text-blue-300 border-b border-white/10">
                        {usuario.nombre}
                      </li>
                      <li>
                        <Link
                          to="/perfil"
                          onClick={() => setIsCuentaOpen(false)}
                          className="block px-4 py-2 text-white hover:bg-white/10"
                        >
                          Perfil
                        </Link>
                      </li>
                    </>
                  )}
                  <li>
                    <Link
                      to="/login"
                      onClick={() => setIsCuentaOpen(false)}
                      className="block px-4 py-2 text-white hover:bg-white/10"
                    >
                      Login
                    </Link>
                  </li>
                  {usuario && (
                    <li>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-white hover:bg-white/10"
                      >
                        Cerrar sesión
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      {/* Sidebar móvil (pantallas pequeñas) */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-indigo-950 text-white transform transition-transform duration-200 z-50 sm:hidden ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex justify-between items-center p-4 border-b border-white/20">
          <NavLink to={getLogoRoute()} onClick={() => setIsMenuOpen(false)} className="font-semibold text-lg hover:text-blue-400">
            SkillBits
          </NavLink>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="text-white text-xl"
          >
            <AiOutlineClose />
          </button>
        </div>

        {/* Navegación móvil */}
        <nav className="flex flex-col p-4 space-y-2">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `text-sm px-4 py-2 rounded-md transition ${isActive ? "bg-white/10 text-blue-300" : "hover:bg-white/5"}`
              }
            >
              {item.name}
            </NavLink>
          ))}

          {/* Menú de cuenta en móvil */}
          <div className="border-t border-white/20 mt-2 pt-2">
            <button
              onClick={() => setIsCuentaMobileOpen(!isCuentaMobileOpen)}
              className="w-full flex justify-between items-center px-4 py-2 text-sm rounded-md border border-white/20 hover:bg-white/10"
              aria-haspopup="true"
              aria-expanded={isCuentaMobileOpen}
            >
              👤 {usuario?.nombre ?? "Cuenta"}
              <svg
                className={`w-4 h-4 ml-2 transition-transform ${isCuentaMobileOpen ? "rotate-180" : "rotate-0"}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {/* Dropdown usuario (mobile) */}
            {isCuentaMobileOpen && (
              <ul className="mt-1 bg-[#0f172a] rounded-md border border-white/20 shadow-lg z-50">
                {usuario && (
                  <>
                    <li className="px-4 py-2 text-sm text-blue-300 border-b border-white/10">
                      {usuario.nombre}
                    </li>
                    <li>
                      <Link
                        to="/perfil"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsCuentaMobileOpen(false);
                        }}
                        className="block px-4 py-2 text-white hover:bg-white/10"
                      >
                        Perfil
                      </Link>
                    </li>
                  </>
                )}
                <li>
                  <Link
                    to="/login"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsCuentaMobileOpen(false);
                    }}
                    className="block px-4 py-2 text-white hover:bg-white/10"
                  >
                    Login
                  </Link>
                </li>
                {usuario && (
                  <li>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                        setIsCuentaMobileOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-white hover:bg-white/10"
                    >
                      Cerrar sesión
                    </button>
                  </li>
                )}
              </ul>
            )}
          </div>
        </nav>
      </div>
    </>
  );
}
