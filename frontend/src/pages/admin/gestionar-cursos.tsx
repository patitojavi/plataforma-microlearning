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

interface Course {
  id: string;
  name: string;
  description: string;
  instructor?: string;
  createdAt: string;
  image?: string;
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
  const [editForm, setEditForm] = useState({
    instructor: "",
  });

  useEffect(() => {
    const mockCourses: Course[] = [
      {
        id: "1",
        name: "Introducción al Microlearning",
        description: "Curso básico sobre metodologías de microaprendizaje",
        instructor: "Juan Pérez",
        createdAt: "2023-01-15",
        image: "https://via.placeholder.com/150",
      },
      {
        id: "2",
        name: "Seguridad Informática",
        description: "Fundamentos de seguridad en entornos digitales",
        createdAt: "2023-02-10",
      },
      {
        id: "3",
        name: "Comunicación Efectiva",
        description: "Mejora tus habilidades de comunicación en el trabajo",
        instructor: "María Gómez",
        createdAt: "2023-03-05",
        image: "https://via.placeholder.com/150",
      },
    ];
    setCourses(mockCourses);

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

  const handleInspect = (course: Course) => {
    setSelectedCourse(course);
    setEditForm({
      instructor: course.instructor || "",
    });
  };

  const handleUpdateCourse = () => {
    alert("Curso actualizado correctamente");
    setSelectedCourse(null);
  };

  const handleDeleteCourse = (courseId: string) => {
    alert(`Curso ${courseId} eliminado`);
    setSelectedCourse(null);
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