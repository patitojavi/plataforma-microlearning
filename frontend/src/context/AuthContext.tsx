import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

// Tipo de usuario
interface Usuario {
  _id: string;
  nombre: string;
  email: string;
  rut: string;
  role: string;
}


// Tipo del contexto
interface AuthContextType {
  usuario: Usuario | null;
  setUsuario: (user: Usuario | null) => void;
}

// Crear el contexto con valor inicial null y tipo explícito
const AuthContext = createContext<AuthContextType | null>(null);

// Proveedor del contexto
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuarioState] = useState<Usuario | null>(null);

  // Cargar usuario del localStorage en el primer render
  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      try {
        setUsuarioState(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error al parsear usuario desde localStorage", e);
      }
    }
  }, []);

  // Guardar usuario y sincronizar con localStorage
  const setUsuario = (user: Usuario | null) => {
    if (user) {
      localStorage.setItem("usuario", JSON.stringify(user));
    } else {
      localStorage.removeItem("usuario");
    }
    setUsuarioState(user);
  };

  return (
    <AuthContext.Provider value={{ usuario, setUsuario }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  }
  return context;
};
