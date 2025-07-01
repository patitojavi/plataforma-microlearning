import AppNavbar from "@/components/NavbarAdmin";
import { useEffect, useState } from "react";
import { type Capacitaciones } from "@/services/cursos";
import { obtenerCursos, actualizarCurso } from "@/services/cursos";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function CapacitadorCursos() {
    const [capacitaciones, setCapacitaciones] = useState<Capacitaciones[]>([]);
    const [selectedCapacitacion, setSelectedCapacitacion] = useState<Capacitaciones | null>(null);
    const [editingContent, setEditingContent] = useState<any>(null);
    const [newContent, setNewContent] = useState({
        titulo: "",
        descripcion: "",
        contenido: ""
    });
    const [showContentForm, setShowContentForm] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token") || "";
            const capacitaciones = (await obtenerCursos(token)) || [];
            setCapacitaciones(capacitaciones);
        };
        fetchData();
    }, []);

    const handleCapacitacionSelect = (capacitacion: Capacitaciones) => {
        setSelectedCapacitacion(capacitacion);
        setEditingContent(null);
        setShowContentForm(false);
    };

    const handleCapacitacionDeselect = () => {
        setSelectedCapacitacion(null);
        setEditingContent(null);
        setShowContentForm(false);
    };

    const handleAddContent = () => {
        setShowContentForm(true);
        setEditingContent(null);
        setNewContent({
            titulo: "",
            descripcion: "",
            contenido: ""
        });
    };

    const handleSaveContent = async () => {
        if (!selectedCapacitacion) return;

        try {
            const token = localStorage.getItem("token") || "";

            // Crear el string del contenido combinando los campos
            const contenidoStr = `${newContent.titulo}|${newContent.descripcion}|${newContent.contenido}`;

            let updatedContenido = [...selectedCapacitacion.contenido];

            if (editingContent) {
                // Encontrar y reemplazar el contenido existente
                const index = updatedContenido.findIndex(item =>
                    item.includes(editingContent.titulo)
                );
                if (index !== -1) {
                    updatedContenido[index] = contenidoStr;
                }
            } else {
                // Agregar nuevo contenido
                updatedContenido.push(contenidoStr);
            }

            const updatedCapacitacion = {
                ...selectedCapacitacion,
                contenido: updatedContenido
            };

            await actualizarCurso(selectedCapacitacion._id, updatedCapacitacion, token);
            setSelectedCapacitacion(updatedCapacitacion);
            setShowContentForm(false);
            setEditingContent(null);

            // Actualizar la lista de capacitaciones
            const updatedCapacitaciones = capacitaciones.map(cap =>
                cap._id === selectedCapacitacion._id ? updatedCapacitacion : cap
            );
            setCapacitaciones(updatedCapacitaciones);

        } catch (error) {
            console.error("Error al guardar contenido:", error);
        }
    };

    const handleDeleteContent = async (titulo: string) => {
        if (!selectedCapacitacion) return;

        try {
            const token = localStorage.getItem("token") || "";
            const updatedContenido = selectedCapacitacion.contenido.filter(
                item => item.titulo !== titulo
            );

            const updatedCapacitacion = {
                ...selectedCapacitacion,
                contenido: updatedContenido
            };

            await actualizarCurso(selectedCapacitacion._id, updatedCapacitacion, token);
            setSelectedCapacitacion(updatedCapacitacion);

            // Actualizar la lista de capacitaciones
            const updatedCapacitaciones = capacitaciones.map(cap =>
                cap._id === selectedCapacitacion._id ? updatedCapacitacion : cap
            );
            setCapacitaciones(updatedCapacitaciones);

        } catch (error) {
            console.error("Error al eliminar contenido:", error);
        }
    };

    const handleEditContent = (contentStr: string) => {
        const [titulo, descripcion, contenido] = contentStr.split('|');
        setEditingContent({ titulo, descripcion, contenido });
        setNewContent({
            titulo,
            descripcion,
            contenido
        });
        setShowContentForm(true);
    };

    return (
        <div>
            <AppNavbar />
            <div className="container mx-auto p-4">
                <h2 className="text-2xl font-bold mb-6">Capacitaciones disponibles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {capacitaciones.map(cap => (
                        <Card key={cap._id} className="p-4">
                            <h3 className="text-xl font-semibold">{cap.titulo}</h3>
                            <p className="text-gray-600 mt-2">{cap.descripcion}</p>
                            <Button
                                onClick={() => handleCapacitacionSelect(cap)}
                                className="mt-4 w-full"
                                variant="outline"
                            >
                                Ver detalles
                            </Button>
                        </Card>
                    ))}
                </div>

                <AnimatePresence>
                    {selectedCapacitacion && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.5 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black z-40"
                                onClick={handleCapacitacionDeselect}
                                style={{ marginTop: '64px' }}
                            />
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 50 }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                className="fixed inset-x-0 mx-auto top-24 z-50 w-full max-w-4xl px-4"
                            >
                                <Card className="p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h1 className="text-2xl font-bold">{selectedCapacitacion.titulo}</h1>
                                        <button
                                            className="text-gray-500 hover:text-gray-700"
                                            onClick={handleCapacitacionDeselect}
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="mb-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-semibold">Contenido de la capacitación</h3>
                                            <Button onClick={handleAddContent} variant="outline">
                                                + Agregar contenido
                                            </Button>
                                        </div>

                                        {showContentForm && (
                                            <Card className="p-4 mb-4">
                                                <h4 className="font-semibold mb-4">
                                                    {editingContent ? "Editar contenido" : "Nuevo contenido"}
                                                </h4>
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium mb-1">Título</label>
                                                        <Input
                                                            value={newContent.titulo}
                                                            onChange={(e) => setNewContent({ ...newContent, titulo: e.target.value })}
                                                            placeholder="Título del contenido"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium mb-1">Descripción</label>
                                                        <Input
                                                            value={newContent.descripcion}
                                                            onChange={(e) => setNewContent({ ...newContent, descripcion: e.target.value })}
                                                            placeholder="Descripción breve"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium mb-1">Contenido</label>
                                                        <Textarea
                                                            value={newContent.contenido}
                                                            onChange={(e) => setNewContent({ ...newContent, contenido: e.target.value })}
                                                            placeholder="Contenido detallado"
                                                            rows={5}
                                                        />
                                                    </div>
                                                    <div className="flex justify-end space-x-2">
                                                        <Button
                                                            variant="outline"
                                                            onClick={() => {
                                                                setShowContentForm(false);
                                                                setEditingContent(null);
                                                            }}
                                                        >
                                                            Cancelar
                                                        </Button>
                                                        <Button onClick={handleSaveContent}>
                                                            {editingContent ? "Actualizar" : "Guardar"}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </Card>
                                        )}

                                        {selectedCapacitacion.contenido.map((item, index) => {
                                            const [titulo, descripcion, contenido] = item.split('|');
                                            return (
                                                <Card key={index} className="p-4 mb-4">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h4 className="font-semibold">{titulo}</h4>
                                                            <p className="text-gray-600 text-sm mt-1">{descripcion}</p>
                                                        <p className="mt-2 text-gray-700">{contenido}</p>
                                                    </div>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                                </svg>
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => handleEditContent(item)}>
                                                                Editar
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="text-red-600"
                                                                onClick={() => handleDeleteContent(titulo)}
                                                            >
                                                                Eliminar
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </Card>
                                        );
                                    })}
                                </div>
                            </Card>
                        </motion.div>
                    </>
                )}
                </AnimatePresence>
            </div>
        </div>
    )
}