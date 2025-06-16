import AppNavbar from "@/components/NavbarAdmin";

export default function CapacitadorPage() {
    return (
        <div>
            <AppNavbar />
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <h1 className="text-4xl font-bold mb-4">Página del Capacitador</h1>
                <p className="text-lg text-gray-700 mb-8">
                    Aquí puedes gestionar los cursos que asignados y asignar lecciones a tus usuarios.
                </p>
                <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-3xl">
                    <h2 className="text-2xl font-semibold mb-4">Funciones de Capacitador</h2>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Editar cursos</li>
                        <li>Asignar lecciones a usuarios</li>
                        <li>Ver progreso de los usuarios</li>
                        <li>Gestionar evaluaciones</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}