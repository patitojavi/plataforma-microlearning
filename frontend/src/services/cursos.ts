import axios from "axios";

export interface Capacitaciones {
  _id: string;
  titulo: string;
  descripcion: string;
  creador?: {
    _id: string;
    username: string;
  };
  contenido: string[];
  miembros: string[];
  progreso: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  __v: number;
  esCapacitador?: boolean;
  yaInscrito?: boolean;
  graficos?: {
    dia: number[];
    mes: number[];
    año: number[];
  };
  comentarios?: string[];
}

const API_URL = "https://plataforma-microlearning-x4bz.onrender.com/api/capacitaciones";

export const crearCurso = async (data: {
  titulo: string;
  descripcion: string;
  creador?: { username: string; };
  contenido: [];
}, token: string, date: Date = new Date) => {
  try {
    console.log("Enviando datos a:", API_URL);
    console.log("Datos enviados:", data);
    const daysInMonth = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    )
    const graficos = { dia: Array.from({ length: 24 }, () => 0), mes: Array.from({ length: daysInMonth.getDate() }, () => 0), año: Array.from({ length: 12 }, () => 0) };
    const today = new Date();
    const createdAt = today.toISOString();
    const res = await axios.post(API_URL, { ...data, createdAt, graficos }, {
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

export const obtenerCursos = async (token: string): Promise<Capacitaciones[]> => {
  try {
    const res = await axios.get<Capacitaciones[]>(API_URL, {
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

export const actualizarCurso = async (id: string, data: Partial<Capacitaciones>, token: string) => {
  try {
    const res = await axios.put(`${API_URL}/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (error) {
    console.error("Error al actualizar curso:", error);
    throw error;
  }
};
