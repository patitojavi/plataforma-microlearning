import AppNavbar from "@/components/Navbar";

export default function AdminPage() {
    return (
        <div>
            <AppNavbar />
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <h1 className="text-4xl font-bold mb-4">Página de Administración</h1>
                <p className="text-lg text-gray-700 mb-8">
                    Esta es la página de administración. Aquí puedes gestionar usuarios, cursos y más.
                </p>
                <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-3xl">
                    <h2 className="text-2xl font-semibold mb-4">Funciones de Administración</h2>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Gestionar usuarios</li>
                        <li>Crear y editar cursos</li>
                        <li>Ver estadísticas de uso</li>
                        <li>Configurar la plataforma</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}