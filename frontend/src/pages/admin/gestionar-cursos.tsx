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
import { crearCapacitacion, obtenerCapacitaciones, eliminarCapacitacion } from "@/services/cursos";
import { crearCurso, eliminarCurso, obtenerCursos } from "@/services/cursos";

interface Course {
  id: string;
  name: string;
  description: string;
  instructor?: string;
  createdAt: string;
  image?: string;
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
    titulo: "",
    descripcion: "",
    creador: "",
    contenido: [""],
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  useEffect(() => {
    const fetchCapacitaciones = async () => {
      try {
        const token = localStorage.getItem('token') || '';
        const capacitaciones = await obtenerCapacitaciones(token);
        setCapacitaciones(capacitaciones);
      } catch (error) {
        console.error("Error al cargar capacitaciones:", error);
      }
    };

    fetchCapacitaciones();

    const mockComments: Comment[] = [
      {
        id: "c1",
        user: "Usuario1",
        text: "Excelente curso, muy útil para mi trabajo diario",
        date: "2023-06-15",
      },
      {
        id: "c2",
        user: "Usuario2",
        text: "El contenido es bueno pero faltan ejemplos prácticos",
        date: "2023-06-18",
      },
    ];
    setComments(mockComments);

    const mockActivity = [
      { hour: "9:00", visits: 5 },
      { hour: "10:00", visits: 12 },
      { hour: "11:00", visits: 8 },
      { hour: "12:00", visits: 15 },
      { hour: "13:00", visits: 3 },
      { hour: "14:00", visits: 7 },
      { hour: "15:00", visits: 10 },
    ];
    setDailyActivity(mockActivity);
  }, []);

  const handleInspect = (capacitacion: Capacitacion) => {
    setSelectedCapacitacion(capacitacion);
    setEditForm({
      instructor: capacitacion.creador || "",
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
    if (!createForm.name || !createForm.description) {
      alert("Nombre y descripción son campos obligatorios");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("No se encontró token de autenticación");
        return;
      }

      const newCourse = await crearCurso({
        name: createForm.name,
        description: createForm.description,
        instructor: createForm.instructor || undefined,
      }, token);

      const updatedCourses = await obtenerCursos(token);
      setCourses(updatedCourses);

      setShowCreateForm(false);
      setCreateForm({ name: "", description: "", instructor: "" });
      alert("Curso creado correctamente");
    } catch (error) {
      console.error("Error detallado:", error);
      alert(`Error al crear curso: ${error instanceof Error ? error.message : "Error desconocido"}`);
    }
  };

  const handleUpdateCourse = () => {
    alert("Curso actualizado correctamente");
    setSelectedCourse(null);
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

  const handleDeleteCourse = async (courseId: string) => {
    try {
      const token = localStorage.getItem('token') || '';
      await eliminarCurso(courseId, token);
      setCourses(courses.filter(course => course.id !== courseId));
      setSelectedCourse(null);
      alert("Curso eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar curso:", error);
      alert("Error al eliminar curso");
    }
  };

  const handleCloseInspection = () => {
    setSelectedCourse(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-100 min-h-screen"
    >
      <AppNavbar />
      <div className="container mx-auto p-4 relative">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold mb-6">Gestión de Cursos</h1>

          {/* Tabla de cursos */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold"></h1>
            <Button onClick={() => setShowCreateForm(true)}>
              Crear Nuevo Curso
            </Button>
          </div>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Capacitador</TableHead>
                  <TableHead>Fecha de Creación</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {capacitaciones.length > 0 ? (
                  capacitaciones.map((capacitacion) => (
                    <TableRow key={capacitacion.id}>
                      <TableCell className="font-medium">{capacitacion.id}</TableCell>
                      <TableCell>{capacitacion.titulo}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {capacitacion.descripcion}
                      </TableCell>
                      <TableCell>{capacitacion.creador?.username || "-"}</TableCell>
                      <TableCell>{capacitacion.createdAt || "-"}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          onClick={() => handleInspect(capacitacion)}
                        >
                          Inspeccionar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      No hay capacitaciones disponibles
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
                        <Label htmlFor="name">Nombre de la capacitación *</Label>
                        <Input
                          id="name"
                          value={createForm.name}
                          onChange={(e) =>
                            setCreateForm({ ...createForm, name: e.target.value })
                          }
                          placeholder="Nombre de la capacitación"
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