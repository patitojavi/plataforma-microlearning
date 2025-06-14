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
import AppNavbar from "@/components/Navbar";
import { obtenerCursos } from "@/services/cursos";
import { crearCurso, eliminarCurso } from "@/services/cursos";

interface Course {
  _id: string;
  titulo: string;
  descripcion: string;
  creador?: { username: string };
  createdAt: string;
}

interface Capacitacion {
  id: string;
  titulo: string;
  descripcion: string;
  creador: {
    _id: string;
    username: string;
  };
  createdAt: string;
}

interface Comment {
  id: string;
  user: string;
  text: string;
  date: string;
}

export default function ManageCoursesPage() {
  const [capacitaciones, setCapacitaciones] = useState<Capacitacion[]>([]);
  const [selectedCapacitacion, setSelectedCapacitacion] = useState<Capacitacion | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [dailyActivity, setDailyActivity] = useState<any[]>([]);
  const [editForm, setEditForm] = useState({
    instructor: "",
  });
  const [createForm, setCreateForm] = useState({
    name: "",
    description: "",
    instructor: "",
  });
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token') || '';
        const cursos = await obtenerCursos(token);
        setCourses(cursos);
      } catch (error) {
        console.error("Error al cargar cursos:", error);
      }
    };

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
    setEditForm({
      instructor: course.instructor || "",
    });
  };

  const handleCreateCapacitacion = async () => {
    if (!createForm.titulo || !createForm.descripcion) {
      alert("Título y descripción son campos obligatorios");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("No se encontró token de autenticación");
        return;
      }

      const newCapacitacion = await crearCapacitacion({
        titulo: createForm.titulo,
        descripcion: createForm.descripcion,
        contenido: createForm.contenido,
        creador: createForm.creador || undefined,
      }, token);

      const updatedCapacitaciones = await obtenerCapacitaciones(token);
      setCapacitaciones(updatedCapacitaciones);

      setShowCreateForm(false);
      setCreateForm({ titulo: "", descripcion: "", contenido: [""], creador: "" });
      alert("Capacitación creada correctamente");
    } catch (error) {
      console.error("Error detallado:", error);
      alert(`Error al crear capacitación: ${error instanceof Error ? error.message : "Error desconocido"}`);
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

  const handleDeleteCapacitacion = async (capacitacionId: string) => {
    try {
      const token = localStorage.getItem('token') || '';
      await eliminarCapacitacion(capacitacionId, token);
      setCapacitaciones(capacitaciones.filter(cap => cap.id !== capacitacionId));
      setSelectedCapacitacion(null);
      alert("Capacitación eliminada correctamente");
    } catch (error) {
      console.error("Error al eliminar capacitación:", error);
      alert("Error al eliminar capacitación");
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
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Capacitador</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.length > 0 ? (
                  courses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">{course.id}</TableCell>
                      <TableCell>{course.name}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {course.description}
                      </TableCell>
                      <TableCell>{course.instructor || "-"}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          onClick={() => handleInspect(course)}
                        >
                          Inspeccionar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      No hay cursos disponibles
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </motion.div>
        <AnimatePresence>
          {showCreateForm && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black z-40"
                onClick={() => setShowCreateForm(false)}
                style={{ marginTop: '64px' }}
              />

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed inset-x-0 mx-auto top-24 z-50 w-full max-w-md px-4"
              >
                <Card className="bg-white rounded-xl shadow-2xl overflow-hidden">
                  <CardHeader>
                    <CardTitle>Crear Nuevo Curso</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Nombre del Curso *</Label>
                        <Input
                          id="name"
                          value={createForm.name}
                          onChange={(e) =>
                            setCreateForm({ ...createForm, name: e.target.value })
                          }
                          placeholder="Nombre del curso"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Descripción *</Label>
                        <Input
                          id="description"
                          value={createForm.description}
                          onChange={(e) =>
                            setCreateForm({ ...createForm, description: e.target.value })
                          }
                          placeholder="Descripción del curso"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="instructor">Instructor/Capacitador</Label>
                        <Input
                          id="instructor"
                          value={createForm.instructor}
                          onChange={(e) =>
                            setCreateForm({ ...createForm, instructor: e.target.value })
                          }
                          placeholder="Nombre del instructor (opcional)"
                        />
                      </div>
                      <div className="flex justify-end pt-4 space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => setShowCreateForm(false)}
                        >
                          Cancelar
                        </Button>
                        <Button
                          onClick={handleCreateCourse}
                          disabled={!createForm.name || !createForm.description}
                        >
                          Crear Curso
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Overlay y panel de inspección */}
        <AnimatePresence>
          {selectedCourse && (
            <>
              {/* Overlay sombreado */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black z-40"
                onClick={handleCloseInspection}
                style={{ marginTop: '64px' }}
              />

              {/* Panel de inspección */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed inset-x-0 mx-auto top-24 z-50 w-full max-w-6xl px-4"
              >
                <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                  <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-semibold">
                      Inspeccionando: {selectedCourse.name}
                    </h2>
                    <button
                      onClick={handleCloseInspection}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                    {/* Card 1: Actividad del día */}
                    <Card className="border rounded-lg overflow-hidden">
                      <CardHeader>
                        <CardTitle>Actividad Hoy</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dailyActivity}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="hour" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="visits" fill="#8884d8" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Card 2: Editar capacitador */}
                    <Card className="border rounded-lg overflow-hidden">
                      <CardHeader>
                        <CardTitle>Asignar Capacitador</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="instructor">Capacitador</Label>
                            <Input
                              id="instructor"
                              value={editForm.instructor}
                              onChange={(e) =>
                                setEditForm({ ...editForm, instructor: e.target.value })
                              }
                              placeholder="Nombre del capacitador"
                            />
                          </div>
                          <div className="flex justify-between pt-4">
                            <Button onClick={handleUpdateCourse}>
                              Guardar Cambios
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleDeleteCourse(selectedCourse.id)}
                            >
                              Eliminar Curso
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Card 3: Comentarios */}
                    <Card className="border rounded-lg overflow-hidden">
                      <CardHeader>
                        <CardTitle>Comentarios</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4 max-h-[400px] overflow-y-auto">
                        {comments.length > 0 ? (
                          comments.map((comment) => (
                            <div
                              key={comment.id}
                              className="border-b border-gray-200 pb-4 last:border-0"
                            >
                              <div className="flex justify-between items-start">
                                <h4 className="font-medium">{comment.user}</h4>
                                <span className="text-sm text-gray-500">
                                  {comment.date}
                                </span>
                              </div>
                              <p className="mt-1 text-gray-700">{comment.text}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 text-center py-4">
                            No hay comentarios aún
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
  