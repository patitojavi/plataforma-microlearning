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
import { obtenerCursos, crearCurso, eliminarCurso, type Capacitaciones } from "@/services/cursos";
import { toast } from "sonner";
import { getUsuarios } from "@/services/usuarios";

interface Comment {
  id: string;
  user: string;
  text: string;
  date: string;
}

interface DailyActivity {
  hour: string;
  visits: number;
}

const tableVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 0.5 },
};

const modalVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 50 },
};

export default function ManageCoursesPage() {
  const [courses, setCourses] = useState<Capacitaciones[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Capacitaciones | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [dailyActivity, setDailyActivity] = useState<DailyActivity[]>([]);
  const [editForm, setEditForm] = useState({ capacitador: "" });
  const [createForm, setCreateForm] = useState({ titulo: "", descripcion: "", creador: "" });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [users, setUsers] = useState<{ _id: string; username: string; role: string }[]>([]);

  useEffect(() => {
    fetchCourses();
    fetchUsers();
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
      // const comentarios = cursos.flatMap(course =>
      //   course.comentarios.map(comment => ({
      //     id: comment._id,
      //     user: comment.usuario?.username || "Anónimo",
      //     text: comment.texto,
      //     date: new Date(comment.fecha).toLocaleDateString(),
      //   })) || []
      // );
      setCourses(cursos);
    } catch (error) {
      console.error("Error al cargar capacitaciones:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token") || "";
      const users = await getUsuarios(token);
      const filteredUsers = users.filter(user => user.role === "capacitador");
      setUsers(filteredUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleInspect = (course: Capacitaciones) => {
    setSelectedCourse(course);
    setEditForm({ capacitador: course.creador?.username || "" });
  };

  const handleCloseInspection = () => {
    setSelectedCourse(null);
    setEditForm({ capacitador: "" });
  };

  const handleCreateCourse = async () => {
    if (!createForm.titulo || !createForm.descripcion) {
      toast.error("Por favor, completa todos los campos requeridos.");
      return;
    }
    try {
      const token = localStorage.getItem("token") || "";
      await crearCurso({
        titulo: createForm.titulo,
        descripcion: createForm.descripcion,
        creador: { username: createForm.creador },
        contenido: [],
      }, token);
      await fetchCourses();
      setShowCreateForm(false);
      setCreateForm({ titulo: "", descripcion: "", creador: "" });
      toast.success("Capacitación creada correctamente", {
        position: "top-center",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error al crear capacitación:", error);
      toast.error("Error al crear capacitación", {
        position: "top-center",
        duration: 3000,
      });
    }
  };

  const handleDeleteCourse = async (id: string) => {
    try {
      const token = localStorage.getItem("token") || "";
      await eliminarCurso(id, token);
      await fetchCourses();
      setSelectedCourse(null);
      toast.success("Capacitación eliminada correctamente", {
        position: "top-center",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error al eliminar capacitación:", error);
      toast.error("Error al eliminar capacitación", {
        position: "top-center",
        duration: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNavbar />
      <div className="p-4 container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold mb-6">Gestión de Capacitaciones</h1>
        </motion.div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-lg font-semibold"></h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => setShowCreateForm(true)}
            >
              Crear Capacitación
            </Button>
          </motion.div>
        </div>

        <motion.div
          variants={tableVariants}
          initial="hidden"
          animate="visible"
          className="border rounded-lg overflow-hidden"
        >
          <Table>
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
              {courses.length > 0 ? (
                courses.map((course, index) => (
                  <motion.tr
                    key={course._id}
                    variants={rowVariants}
                    custom={index}
                    className="hover:bg-gray-50"
                  >
                    <TableCell>{course._id}</TableCell>
                    <TableCell>{course.titulo}</TableCell>
                    <TableCell className="max-w-xs truncate">{course.descripcion}</TableCell>
                    <TableCell>{course.creador?.username || '-'}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        onClick={() => handleInspect(course)}
                      >
                        Inspeccionar
                      </Button>
                    </TableCell>
                  </motion.tr>
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
        </motion.div>

        {/* Formulario de creación */}
        <AnimatePresence>
          {showCreateForm && (
            <>
              <motion.div
                variants={overlayVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="fixed inset-0 bg-black z-40"
                onClick={() => setShowCreateForm(false)}
              />

              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className="fixed inset-x-0 mx-auto top-24 z-50 w-full max-w-md px-4"
              >
                <Card className="bg-white rounded-xl shadow-2xl overflow-hidden">
                  <CardHeader>
                    <CardTitle>Crear Nueva Capacitación</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Nombre del Curso *</Label>
                        <Input
                          id="name"
                          value={createForm.titulo}
                          onChange={(e) =>
                            setCreateForm({ ...createForm, titulo: e.target.value })
                          }
                          placeholder="Nombre del curso"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Descripción *</Label>
                        <Input
                          id="description"
                          value={createForm.descripcion}
                          onChange={(e) =>
                            setCreateForm({ ...createForm, descripcion: e.target.value })
                          }
                          placeholder="Descripción del curso"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="instructor">Instructor/Capacitador</Label>
                        <Input
                          id="instructor"
                          value={createForm.creador}
                          onChange={(e) =>
                            setCreateForm({ ...createForm, creador: e.target.value })
                          }
                          placeholder="Nombre del creador (opcional)"
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
                          disabled={!createForm.titulo || !createForm.descripcion}
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

        {/* Panel de inspección */}
        <AnimatePresence>
          {selectedCourse && (
            <>
              <motion.div
                variants={overlayVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="fixed inset-0 bg-black z-40"
                onClick={handleCloseInspection}
              />

              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className="fixed inset-x-0 mx-auto top-24 z-50 w-full max-w-6xl px-4"
              >
                <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                  <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-semibold">
                      Inspeccionando: {selectedCourse.titulo}
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

                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
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
                            <Label htmlFor="capacitador">Seleccione Capacitador</Label>
                            <select
                              id="capacitador"
                              value={editForm.capacitador}
                              onChange={(e) =>
                                setEditForm({ ...editForm, capacitador: e.target.value })
                              }
                              className="w-full p-2 border rounded"
                            >
                              {users
                                .map((user) => (
                                  <option key={user._id} value={user.username}>
                                    {user.username}
                                  </option>
                                ))}
                            </select>
                          </div>
                          <div className="flex justify-between pt-4">
                            <Button onClick={() => handleCloseInspection()}>
                              Guardar Cambios
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleDeleteCourse(selectedCourse._id)}
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
                            <motion.div
                              key={comment.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="border-b border-gray-200 pb-4 last:border-0"
                            >
                              <div className="flex justify-between items-start">
                                <h4 className="font-medium">{comment.user}</h4>
                                <span className="text-sm text-gray-500">
                                  {comment.date}
                                </span>
                              </div>
                              <p className="mt-1 text-gray-700">{comment.text}</p>
                            </motion.div>
                          ))
                        ) : (
                          <p className="text-gray-500 text-center py-4">
                            No hay comentarios aún
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
