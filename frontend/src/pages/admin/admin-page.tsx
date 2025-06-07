export default function AdminPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Página de Administración</h1>
      <p className="text-lg text-gray-700 mb-8">
        Esta es la página de administración. Aquí puedes gestionar usuarios, cursos y más.
      </p>
      <button
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        onClick={() => alert("Funcionalidad de administración aún no implementada.")}
      >
        Administrar
      </button>
    </div>
  );
}