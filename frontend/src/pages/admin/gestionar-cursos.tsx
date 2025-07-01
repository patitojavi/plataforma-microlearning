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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppNavbar from "@/components/NavbarAdmin";
import { obtenerCursos, crearCurso, eliminarCurso } from "@/services/cursos";

interface Course {
  _id: string;
  titulo: string;
  descripcion: string;
  creador?: { username: string };
  createdAt: string;
}

export default function ManageCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [createForm, setCreateForm] = useState({
    titulo: "",
    descripcion: "",
    instructor: "",
  });
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token") || "";
      const cursos = await obtenerCursos(token);
      setCourses(cursos as unknown as Course[]);
    } catch (error) {
      console.error("Error al cargar capacitaciones:", error);
    }
  };

  const handleCreateCourse = async () => {
    if (!createForm.titulo || !createForm.descripcion) {
      alert("Título y descripción son obligatorios");
      return;
    }
    try {
      const token = localStorage.getItem("token") || "";
      await crearCurso({
        name: createForm.titulo,
        description: createForm.descripcion,
        instructor: createForm.instructor,
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
                onChange={(e) => setCreateForm({ ...createForm, titulo: e.target.value })}
              />
              <Label htmlFor="descripcion">Descripción</Label>
              <Input
                id="descripcion"
                value={createForm.descripcion}
                onChange={(e) => setCreateForm({ ...createForm, descripcion: e.target.value })}
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
            {courses.map((course) => (
              <TableRow key={course._id}>
                <TableCell>{course._id}</TableCell>
                <TableCell>{course.titulo}</TableCell>
                <TableCell>{course.descripcion}</TableCell>
                <TableCell>{course.creador?.username || "-"}</TableCell>
                <TableCell className="space-x-2">
                  <Button variant="destructive" onClick={() => handleDeleteCourse(course._id)}>
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
