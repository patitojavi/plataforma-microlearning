import { useState, useRef, useEffect } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

export const AcmeLogo = () => (
  <svg fill="none" height="32" viewBox="0 0 32 32" width="32">
    <path
      d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
      fill="currentColor"
    />
  </svg>
);

export default function AppNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCuentaOpen, setIsCuentaOpen] = useState(false);
  const [isCuentaMobileOpen, setIsCuentaMobileOpen] = useState(false);
  const navigate = useNavigate();
  //const token = localStorage.getItem("token");
  const cuentaRef = useRef(null);
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsMenuOpen(false);
    setIsCuentaOpen(false);
    setIsCuentaMobileOpen(false);
    navigate("/login");
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (cuentaRef.current && !cuentaRef.current.contains(event.target)) {
        setIsCuentaOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const menuItems = [
    { name: "Inicio", path: "/" }
  ];

  if (role === 'admin') {
    menuItems.push({ name: "Admin", path: "/admin" });
    menuItems.push({ name: "Agregar Usuario", path: "/admin/agregar-usuario" });
  } else if (role === 'usuario') {
    menuItems.push({ name: "Capacitaciones", path: "/capacitaciones" });
    menuItems.push({ name: "Responder Evaluación", path: "/responder" })
  }
  return (
    <>
      {/* NAVBAR */}
      <Navbar
        className="bg-indigo-950 text-white shadow-sm"
        isBordered
        onMenuOpenChange={setIsMenuOpen}
        style={{ minHeight: "64px" }} // Más alto que el default
      >
        <NavbarContent className="items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="sm:hidden text-xl text-white"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
          </button>
          <NavbarBrand className="ml-2 flex items-center">
            <AcmeLogo />
            <NavLink
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `ml-2 font-semibold text-white text-base leading-none ${isActive ? "text-blue-400 " : ""
                }`
              }
            >
              Microlearning
            </NavLink>
          </NavbarBrand>
        </NavbarContent>

        {/* Desktop menu */}
        <NavbarContent className="hidden sm:flex flex-1 items-center" justify="center">

          {/* Grupo 2: Capacitaciones y Responder Evaluación centrados */}
          <div className="flex gap-6 justify-center flex-1">
            {menuItems.slice(1).map((item, index) => (
              <NavbarItem key={index}>
                <NavLink
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `text-sm transition text-white hover:underline ${isActive ? "text-blue-400 " : ""
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              </NavbarItem>
            ))}
          </div>

          {/* Grupo 3: Cuenta a la derecha */}
          <NavbarItem className="relative" ref={cuentaRef}>
            <button
              onClick={() => setIsCuentaOpen(!isCuentaOpen)}
              className="text-sm px-4 py-1 rounded-full border border-white text-white bg-transparent hover:bg-white/10 transition flex items-center gap-1"
              aria-haspopup="true"
              aria-expanded={isCuentaOpen}
            >
              Cuenta
              <svg
                className={`w-4 h-4 ml-1 transition-transform ${isCuentaOpen ? "rotate-180" : "rotate-0"
                  }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            {isCuentaOpen && (
              <div
                className="absolute right-0 mt-2 w-40 bg-[#0f172a] border border-white/20 rounded shadow-lg z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <ul>
                  <li>
                    <Link
                      to="/login"
                      onClick={() => setIsCuentaOpen(false)}
                      className="block px-4 py-2 text-white hover:bg-white/10"
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-white hover:bg-white/10"
                    >
                      Cerrar sesión
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#0f172a] text-white transform transition-transform duration-200 z-50 sm:hidden ${isMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-white/20">
          <span className="font-semibold text-lg">Microlearning</span>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="text-white text-xl"
          >
            <AiOutlineClose />
          </button>
        </div>
        <nav className="flex flex-col p-4 space-y-2">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `text-sm px-4 py-2 rounded-md transition ${isActive ? "bg-white/10 text-blue-300" : "hover:bg-white/5"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}

          {/* Dropdown Cuenta móvil */}
          <div className="border-t border-white/20 mt-2 pt-2">
            <button
              onClick={() => setIsCuentaMobileOpen(!isCuentaMobileOpen)}
              className="w-full flex justify-between items-center px-4 py-2 text-sm rounded-md border border-white/20 hover:bg-white/10"
              aria-haspopup="true"
              aria-expanded={isCuentaMobileOpen}
            >
              Cuenta
              <svg
                className={`w-4 h-4 ml-2 transition-transform ${isCuentaMobileOpen ? "rotate-180" : "rotate-0"
                  }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {isCuentaMobileOpen && (
              <ul className="mt-1 bg-[#0f172a] rounded-md border border-white/20 shadow-lg z-50">
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
              </ul>
            )}
          </div>
        </nav>
      </div>
    </>
  );
}
