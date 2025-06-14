import axios from "axios";

interface Course {
  id: string;
  name: string;
  description: string;
  instructor?: string;
  createdAt: string;
  image?: string;
}

const API_URL = "http://localhost:5000/api/capacitaciones";

export const crearCurso = async (data: {
  name: string; 
  description: string;
  instructor?: string; 
}, token: string) => {
  try {
    console.log("Enviando datos a:", API_URL);
    console.log("Datos enviados:", data);
    
    const today = new Date();
    const createdAt = today.toISOString();
    const res = await axios.post(API_URL, {...data, createdAt}, {
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    return res.data;
  } catch (error) {
    console.error("Error detallado al crear curso:", error);
    if (axios.isAxiosError(error)) {
      console.error("Respuesta del servidor:", error.response?.data);
    }
    throw error;
  }
};

export const obtenerCursos = async (token: string): Promise<Course[]> => {
  try {
    const res = await axios.get<Course[]>(API_URL, {
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    return res.data;
  } catch (error) {
    console.error("Error al obtener cursos:", error);
    throw error;
  }
};

export const eliminarCurso = async (id: string, token: string) => {
  try {
    const res = await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (error) {
    console.error("Error al eliminar curso:", error);
    throw error;
  }
};

export const crearCapacitacion = async (data: {
  titulo: string; 
  descripcion: string;
  contenido?: string[];
  miembros?: string[];
  progreso?: Record<string, number>;
  creador?: string; // ID del creador, opcional si se maneja en el backend
}, token: string) => {
  try {
    console.log("Enviando datos a:", API_URL);
    console.log("Datos enviados:", data);
    
    const today = new Date();
    const createdAt = today.toISOString();
    const res = await axios.post(API_URL, { ...data, createdAt }, {
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    return res.data;
  } catch (error) {
    console.error("Error detallado al crear capacitación:", error);
    if (axios.isAxiosError(error)) {
      console.error("Respuesta del servidor:", error.response?.data);
      throw new Error(error.response?.data?.message || "Error al crear capacitación");
    }
    throw error;
  }
};

export const obtenerCapacitaciones = async (token: string): Promise<Capacitacion[]> => {
  try {
    const res = await axios.get<Capacitacion[]>(API_URL, {
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    return res.data.map(cap => ({
      ...cap,
      id: cap._id, // Mapear _id a id para consistencia con el frontend
      instructor: cap.creador?.username // Mapear creador.username a instructor
    }));
  } catch (error) {
    console.error("Error al obtener capacitaciones:", error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Error al obtener capacitaciones");
    }
    throw error;
  }
};

export const eliminarCapacitacion = async (id: string, token: string) => {
  try {
    const res = await axios.delete(`${API_URL}/${id}`, {
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    return res.data;
  } catch (error) {
    console.error("Error al eliminar capacitación:", error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Error al eliminar capacitación");
    }
    throw error;
  }
};