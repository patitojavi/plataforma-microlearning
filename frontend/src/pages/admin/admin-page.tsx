import AppNavbar from "@/components/NavbarAdmin";
import { useState, useEffect } from "react";
import { obtenerCursos, type Capacitaciones } from "@/services/cursos";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

ChartJS.register(...registerables);

const generateMockData = (type: "dia" | "mes" | "año", date: Date) => {
  if (type === "dia") {
    const labels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
    const values = labels.map(() => Math.floor(Math.random() * 50) + 10);
    return { labels, values };
  } else if (type === "mes") {
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const labels = Array.from({ length: daysInMonth }, (_, i) => `Día ${i + 1}`);
    const values = labels.map(() => Math.floor(Math.random() * 100) + 20);
    return { labels, values };
  } else {
    const labels = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const values = labels.map(() => Math.floor(Math.random() * 200) + 50);
    return { labels, values };
  }
};

export default function AdminPage() {
  const [listaCapacitaciones, setListaCapacitaciones] = useState<Capacitaciones[]>([]);
  const [activeTab, setActiveTab] = useState<"dia" | "mes" | "año">("dia");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedCapacitacion, setSelectedCapacitacion] = useState<string>("all");
  const [chartData, setChartData] = useState<{ labels: string[]; values: number[] } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token") || "";
      const data = await obtenerCursos(token);
      setListaCapacitaciones(data);
      processChartData(data);
    } catch (error) {
      console.error("Error al cargar capacitaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  const processChartData = (data: Capacitaciones[]) => {
    if (data.length === 0) {
      setChartData(null);
      return;
    }

    const hasData = data.some((c) => c.graficos !== undefined);
    if (!hasData) {
      setChartData(generateMockData(activeTab, selectedDate));
      return;
    }

    let labels: string[] = [];
    let values: number[] = [];

    if (selectedCapacitacion === "all") {
      if (activeTab === "dia") {
        labels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
        values = labels.map((_, i) => data.reduce((sum, c) => sum + (c.graficos?.dia?.[i] || 0), 0));
      } else if (activeTab === "mes") {
        const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
        labels = Array.from({ length: daysInMonth }, (_, i) => `Día ${i + 1}`);
        values = labels.map((_, i) => data.reduce((sum, c) => sum + (c.graficos?.mes?.[i] || 0), 0));
      } else {
        labels = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
        values = labels.map((_, i) => data.reduce((sum, c) => sum + (c.graficos?.año?.[i] || 0), 0));
      }
    } else {
      const curso = data.find((c) => c._id === selectedCapacitacion);
      if (!curso || !curso.graficos) return;

      if (activeTab === "dia") {
        labels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
        values = curso.graficos.dia;
      } else if (activeTab === "mes") {
        const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
        labels = Array.from({ length: daysInMonth }, (_, i) => `Día ${i + 1}`);
        values = curso.graficos.mes.slice(0, daysInMonth);
      } else {
        labels = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
        values = curso.graficos.año;
      }
    }

    setChartData({ labels, values });
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (listaCapacitaciones.length > 0) {
      processChartData(listaCapacitaciones);
    }
  }, [activeTab, selectedDate, selectedCapacitacion]);

  const getChartTitle = () => {
    if (selectedCapacitacion === "all") {
      return `Estadísticas ${activeTab === "dia" ? "del día" : activeTab === "mes" ? "del mes" : "del año"} - Todas las capacitaciones`;
    } else {
      const curso = listaCapacitaciones.find((c) => c._id === selectedCapacitacion);
      return `Estadísticas ${activeTab === "dia" ? "del día" : activeTab === "mes" ? "del mes" : "del año"} - ${curso?.titulo || ""}`;
    }
  };

  const colors = {
    dia: { bg: "rgba(54, 162, 235, 0.5)", border: "rgba(54, 162, 235, 1)" },
    mes: { bg: "rgba(75, 192, 192, 0.5)", border: "rgba(75, 192, 192, 1)" },
    año: { bg: "rgba(153, 102, 255, 0.5)", border: "rgba(153, 102, 255, 1)" }
  };
    return (
        <div>
            <AppNavbar />
            <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
                <h1 className="text-4xl font-bold mb-4">Página de Administración</h1>

                <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-6xl">
                    <h2 className="text-2xl font-semibold mb-4">Estadísticas de Capacitaciones</h2>

                    {/* Controles */}
                    <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
                        <div className="flex border-b overflow-x-auto">
                            <button
                                className={`py-2 px-4 font-medium whitespace-nowrap ${activeTab === "dia" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                                onClick={() => setActiveTab("dia")}
                            >
                                Por Día
                            </button>
                            <button
                                className={`py-2 px-4 font-medium whitespace-nowrap ${activeTab === "mes" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                                onClick={() => setActiveTab("mes")}
                            >
                                Por Mes
                            </button>
                            <button
                                className={`py-2 px-4 font-medium whitespace-nowrap ${activeTab === "año" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                                onClick={() => setActiveTab("año")}
                            >
                                Por Año
                            </button>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            {activeTab !== "año" && (
                                <div className="flex items-center">
                                    <label className="mr-2 font-medium">Fecha:</label>
                                    <DatePicker
                                        selected={selectedDate}
                                        onChange={setSelectedDate}
                                        className="border rounded p-2"
                                        dateFormat={activeTab === "mes" ? "MM/yyyy" : "dd/MM/yyyy"}
                                        showMonthYearPicker={activeTab === "mes"}
                                    />
                                </div>
                            )}

                            <div className="flex items-center">
                                <label className="mr-2 font-medium">Curso:</label>
                                <select
                                    value={selectedCapacitacion}
                                    onChange={(e) => setSelectedCapacitacion(e.target.value)}
                                    className="border rounded p-2"
                                >
                                    <option value="all">Todas las capacitaciones</option>
                                    {capacitaciones.map(capacitaciones => (
                                        <option key={capacitaciones._id} value={capacitaciones._id}>
                                            {capacitaciones.titulo}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Gráfico */}
                    <div className="h-96 flex items-center justify-center">
                        {loading ? (
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                                <p className="mt-2">Cargando datos...</p>
                            </div>
                        ) : chartData ? (
                            <div className="w-full h-full">
                                <h3 className="text-xl font-semibold mb-4">{getChartTitle()}</h3>
                                {activeTab === "dia" ? (
                                    <Line
                                        data={{
                                            labels: chartData.labels,
                                            datasets: [{
                                                label: 'Interacciones',
                                                data: chartData.values,
                                                backgroundColor: colors.dia.bg,
                                                borderColor: colors.dia.border,
                                                tension: 0.1,
                                                fill: true
                                            }]
                                        }}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false
                                        }}
                                    />
                                ) : (
                                    <Bar
                                        data={{
                                            labels: chartData.labels,
                                            datasets: [{
                                                label: 'Interacciones',
                                                data: chartData.values,
                                                backgroundColor: activeTab === "mes" ? colors.mes.bg : colors.año.bg,
                                                borderColor: activeTab === "mes" ? colors.mes.border : colors.año.border,
                                                borderWidth: 1
                                            }]
                                        }}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false
                                        }}
                                    />
                                )}
                                <p className="mt-2 text-sm text-gray-500">
                                    Total: {chartData.values.reduce((a, b) => a + b, 0)} interacciones
                                </p>
                            </div>
                        ) : (
                            <p>No hay datos disponibles</p>
                        )}
                    </div>

                    {/* Resumen */}
                    {!loading && chartData && (
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h3 className="font-medium text-blue-800">Interacciones totales</h3>
                                <p className="text-2xl font-bold">
                                    {chartData.values.reduce((a, b) => a + b, 0)}
                                </p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg">
                                <h3 className="font-medium text-green-800">Capacitaciones mostradas</h3>
                                <p className="text-2xl font-bold">
                                    {selectedCapacitacion === "all" ? capacitaciones.length : 1}
                                </p>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg">
                                <h3 className="font-medium text-purple-800">Pico de actividad</h3>
                                <p className="text-2xl font-bold">
                                    {Math.max(...chartData.values)}
                                    <span className="text-sm ml-1">
                                        ({activeTab === "dia" ? "por hora" : activeTab === "mes" ? "por día" : "por mes"})
                                    </span>
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}