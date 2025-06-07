import { motion } from 'framer-motion';
import Navbar from './components/Navbar';


function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      {/* Contenido principal con animaciones */}
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex-grow flex flex-col items-center justify-center px-4 text-center"
      >
        <motion.h1 
          className="text-5xl md:text-6xl font-bold text-indigo-900 mb-6"
          whileHover={{ scale: 1.02 }}
        >
          Plataforma de <span className="text-indigo-600">Microlearning</span> Empresarial
        </motion.h1>
        
        <motion.p 
          className="text-xl text-gray-700 max-w-2xl mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Transforma la capacitación de tu equipo con lecciones breves, evaluaciones interactivas y seguimiento de progreso.
        </motion.p>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-indigo-600 text-white px-8 py-3 rounded-lg shadow-lg cursor-pointer"
        >
          Comenzar ahora
        </motion.div>
      </motion.main>

      {/* Footer con información de contacto */}
      <footer className="bg-indigo-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Contacto</h3>
              <p className="mb-2">Email: contacto@microlearning.com</p>
              <p className="mb-2">Teléfono: +56 9 1234 5678</p>
              <p>Dirección: Temuco, Chile</p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Horarios</h3>
              <p className="mb-2">Lunes a Viernes: 9:00 - 18:00</p>
              <p>Sábado: 10:00 - 14:00</p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Redes Sociales</h3>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-indigo-300 transition">Facebook</a>
                <a href="#" className="hover:text-indigo-300 transition">LinkedIn</a>
                <a href="#" className="hover:text-indigo-300 transition">Twitter</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-indigo-700 mt-8 pt-6 text-center">
            <p>© {new Date().getFullYear()} Plataforma de Microlearning Empresarial. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
