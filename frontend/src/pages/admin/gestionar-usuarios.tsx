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
import { getUsuarios, deleteUsuario, updateUsuario } from "@/services/usuarios";
import { type UserData } from "@/services/auth";

interface Course {
    id: string;
    name: string;
    image: string;
    progress: number;
}

interface DailyActivity {
    name: string;
    logins: number;
}
export default function ManageUsersPage() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
    const [userCourses, setUserCourses] = useState<Course[]>([]);
    const [activityData, setActivityData] = useState<DailyActivity[]>([]);
    const [editForm, setEditForm] = useState({
        email: "",
        username: "",
        role: "",
    });

    useEffect(() => {
        fetchUsers();
        const mockCourses: Course[] = [
            {
                id: "c1",
                name: "Introducción al Microlearning",
                image: "https://via.placeholder.com/150",
                progress: 75,
            },
            {
                id: "c2",
                name: "Seguridad Informática",
                image: "https://via.placeholder.com/150",
                progress: 30,
            },
        ];
        setUserCourses(mockCourses);

        const mockActivity = [
            { name: "Ene", logins: 3 },
            { name: "Feb", logins: 7 },
            { name: "Mar", logins: 2 },
            { name: "Abr", logins: 5 },
            { name: "May", logins: 8 },
            { name: "Jun", logins: 4 },
        ];
        setActivityData(mockActivity);
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token") || "";
            const usuarios = await getUsuarios(token);
            setUsers(usuarios);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const handleInspect = (user: UserData) => {
        setSelectedUser(user);
        setEditForm({
            email: user.email,
            username: user.username,
            role: user.role,
        });
    };

    const handleDeleteUser = async (userId: string) => {
        try {
            const token = localStorage.getItem("token") || "";
            await deleteUsuario(userId, token);
            setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
            setSelectedUser(null);
            alert("Usuario eliminado correctamente");
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const handleUpdateUser = async () => {
        if (!selectedUser) return;
        try {
            const token = localStorage.getItem("token") || "";
            const updatedUser = {
                ...selectedUser,
                email: editForm.email,
                username: editForm.username,
                role: editForm.role,
            };
            await updateUsuario(selectedUser._id, updatedUser, token);
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user._id === selectedUser._id ? updatedUser : user
                )
            );
            setSelectedUser(updatedUser);
            alert("Usuario actualizado correctamente");
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    const handleCloseInspection = () => {
        setSelectedUser(null);
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
                    <h1 className="text-2xl font-bold mb-6">Gestión de Usuarios</h1>

                    {/* Tabla de usuarios */}
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>RUT</TableHead>
                                    <TableHead>Rol</TableHead>
                                    {/* <TableHead>Fecha Creación</TableHead>
                                    <TableHead>Último Login</TableHead> */}
                                    <TableHead>Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user._id}>
                                        <TableCell>{user._id}</TableCell>
                                        <TableCell>{user.username}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.rut}</TableCell>
                                        <TableCell>{user.role}</TableCell>
                                        {/* <TableCell>{user.createdAt}</TableCell>
                                        <TableCell>{user.lastLogin}</TableCell> */}
                                        <TableCell>
                                            <Button
                                                variant="outline"
                                                onClick={() => handleInspect(user)}
                                            >
                                                Inspeccionar
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </motion.div>

                {/* Overlay y panel de inspección */}
                <AnimatePresence>
                    {selectedUser && (
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
                                            Inspeccionando: {selectedUser.username}
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
                                        {/* Card 1: Actividad del usuario */}
                                        <Card className="border rounded-lg overflow-hidden">
                                            <CardHeader>
                                                <CardTitle>Actividad</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="h-[300px]">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <BarChart data={activityData}>
                                                            <CartesianGrid strokeDasharray="3 3" />
                                                            <XAxis dataKey="name" />
                                                            <YAxis />
                                                            <Tooltip />
                                                            <Legend />
                                                            <Bar dataKey="logins" fill="#8884d8" />
                                                        </BarChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Card 2: Editar usuario */}
                                        <Card className="border rounded-lg overflow-hidden">
                                            <CardHeader>
                                                <CardTitle>Editar Usuario</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-4">
                                                    <div>
                                                        <Label htmlFor="email">Email</Label>
                                                        <Input
                                                            id="email"
                                                            value={editForm.email}
                                                            onChange={(e) =>
                                                                setEditForm({ ...editForm, email: e.target.value })
                                                            }
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="username">Nombre de usuario</Label>
                                                        <Input
                                                            id="username"
                                                            value={editForm.username}
                                                            onChange={(e) =>
                                                                setEditForm({ ...editForm, username: e.target.value })
                                                            }
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="role">Rol</Label>
                                                        <select
                                                            id="role"
                                                            value={editForm.role}
                                                            onChange={(e) =>
                                                                setEditForm({ ...editForm, role: e.target.value })
                                                            }
                                                            className="w-full p-2 border rounded"
                                                        >
                                                            <option value="admin">Administrador</option>
                                                            <option value="usuario">Usuario</option>
                                                            <option value="capacitador">Capacitador</option>
                                                        </select>
                                                    </div>
                                                    <div className="flex justify-between pt-4">
                                                        <Button onClick={handleUpdateUser}>Guardar Cambios</Button>
                                                        <Button
                                                            variant="destructive"
                                                            onClick={() => handleDeleteUser(selectedUser._id)}
                                                        >
                                                            Eliminar Usuario
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Card 3: Cursos del usuario */}
                                        <Card className="border rounded-lg overflow-hidden">
                                            <CardHeader>
                                                <CardTitle>Cursos Inscritos</CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                {userCourses.map((course) => (
                                                    <div
                                                        key={course.id}
                                                        className="relative rounded-lg overflow-hidden h-24"
                                                    >
                                                        <img
                                                            src={course.image}
                                                            alt={course.name}
                                                            className="absolute inset-0 w-full h-full object-cover brightness-50"
                                                        />
                                                        <div className="relative z-10 p-4 h-full flex flex-col justify-end">
                                                            <h3 className="text-white font-medium">{course.name}</h3>
                                                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                                                <div
                                                                    className="bg-blue-600 h-2 rounded-full"
                                                                    style={{ width: `${course.progress}%` }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
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
