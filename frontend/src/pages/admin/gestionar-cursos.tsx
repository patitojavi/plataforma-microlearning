import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { AnimatePresence, motion } from "framer-motion";
import AppNavbar from "@/components/NavbarAdmin";
import { obtenerCursos, crearCurso, eliminarCurso } from "@/services/cursos";

interface Course {
  _id: string;
  titulo: string;
  descripcion: string;
  creador?: { username: string };
  createdAt: string;
}

interface Comment {
  id: string;
  user: string;
  text: string;
  date: string;
}

export default function ManageCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [dailyActivity, setDailyActivity] = useState<any[]>([]);
  const [editForm, setEditForm] = useState({ instructor: "" });
  const [createForm, setCreateForm] = useState({ titulo: "", descripcion: "", instructor: "" });
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchCourses();

    setComments([
      { id: "c1", user: "Usuario1", text: "Excelente curso", date: "2023-06-15" },
      { id: "c2", user: "Usuario2", text: "Faltan ejemplos prácticos", date: "2023-06-18" }
    ]);

    setDailyActivity([
      { hour: "9:00", visits: 5 },
      { hour: "10:00", visits: 12 },
      { hour: "11:00", visits: 8 },
      { hour: "12:00", visits: 15 },
      { hour: "13:00", visits: 3 },
      { hour: "14:00", visits: 7 },
      { hour: "15:00", visits: 10 },
    ]);
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token") || "";
      const cursos = await obtenerCursos(token);
      setCourses(cursos);
    } catch (error) {
      console.error("Error al cargar capacitaciones:", error);
    }
  };

  const handleInspect = (course: Course) => {
    setSelectedCourse(course);
    setEditForm({ instructor: course.creador?.username || "" });
  };

  const handleCreateCourse = async () => {
    if (!createForm.titulo || !createForm.descripcion) {
      alert("Título y descripción son obligatorios");
      return;
    }
    try {
      const token = localStorage.getItem("token") || "";
      await crearCurso({
        titulo: createForm.titulo,
        descripcion: createForm.descripcion,
        contenido: [],
      }, token);
      await fetchCourses();
      setShowCreateForm(false);
      setCreateForm({ titulo: "", descripcion: "", instructor: "" });
      alert("Capacitación creada exitosamente");
    } catch (error) {
      console.error("Error al crear capacitación:", error);
      alert("Error al crear capacitación");
    }
  };

  const handleDeleteCourse = async (id: string) => {
    try {
      const token = localStorage.getItem("token") || "";
      await eliminarCurso(id, token);
      await fetchCourses();
      setSelectedCourse(null);
      alert("Capacitación eliminada correctamente");
    } catch (error) {
      console.error("Error al eliminar capacitación:", error);
      alert("Error al eliminar capacitación");
    }
  };

  return (
    <div>
      <AppNavbar />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Gestión de Capacitaciones</h1>
        <Button onClick={() => setShowCreateForm(true)}>Crear Capacitación</Button>

        {showCreateForm && (
          <div className="mt-4 border p-4 rounded-lg bg-white shadow">
            <h2 className="text-lg font-semibold mb-2">Nueva Capacitación</h2>
            <div className="space-y-2">
              <Label htmlFor="titulo">Título</Label>
              <Input
                id="titulo"
                value={createForm.titulo}
                onChange={e => setCreateForm({ ...createForm, titulo: e.target.value })}
              />
              <Label htmlFor="descripcion">Descripción</Label>
              <Input
                id="descripcion"
                value={createForm.descripcion}
                onChange={e => setCreateForm({ ...createForm, descripcion: e.target.value })}
              />
              <div className="flex gap-2 mt-4">
                <Button onClick={handleCreateCourse}>Guardar</Button>
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>Cancelar</Button>
              </div>
            </div>
          </div>
        )}

        <Table className="mt-6">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Creado por</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map(course => (
              <TableRow key={course._id}>
                <TableCell>{course._id}</TableCell>
                <TableCell>{course.titulo}</TableCell>
                <TableCell>{course.descripcion}</TableCell>
                <TableCell>{course.creador?.username || '-'}</TableCell>
                <TableCell>
                  <Button variant="outline" onClick={() => handleInspect(course)}>Inspeccionar</Button>
                  <Button variant="destructive" onClick={() => handleDeleteCourse(course._id)}>Eliminar</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
  