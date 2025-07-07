// src/RouterApp.tsx
import { Routes, Route } from 'react-router-dom';
import App from './App';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Capacitaciones from './pages/usuario/Capacitaciones';
import ResponderEvaluacion from './pages/usuario/ResponderEvaluacion';
import HistorialCursos from './pages/usuario/historial';
import Perfil from './pages/Perfil/Perfil';
import UsuarioPage from './pages/usuario/usuarioPage';
import AdminPage from './pages/admin/admin-page';
import PrivateRoute from './services/PrivateRoute';
import ManageUsersPage from './pages/admin/gestionar-usuarios';
import ManageCoursesPage from './pages/admin/gestionar-cursos';
import CapacitadorPage from './pages/capacitador/capacitador-page';
import CapacitadorCursos from './pages/capacitador/capacitador-cursos';

export default function RouterApp() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/perfil" element={<Perfil />} />

      {/* Rutas protegidas - usuario */}
      <Route path="/usuario" element={
        <PrivateRoute allowedRoles={["usuario"]}>
          <UsuarioPage />
        </PrivateRoute>
      } />
      <Route path="/capacitaciones" element={
        <PrivateRoute allowedRoles={["usuario"]}>
          <Capacitaciones />
        </PrivateRoute>
      } />
      <Route path="/responder" element={
        <PrivateRoute allowedRoles={["usuario"]}>
          <ResponderEvaluacion />
        </PrivateRoute>
      } />
      <Route path="/historial" element={
        <PrivateRoute allowedRoles={["usuario"]}>
          <HistorialCursos />
        </PrivateRoute>
      } />
      {/* Rutas protegidas - admin */}
      <Route path="/admin" element={
        <PrivateRoute allowedRoles={["admin"]}>
          <AdminPage />
        </PrivateRoute>
      } />
      <Route path="/admin/gestionar-usuario" element={
        <PrivateRoute allowedRoles={["admin"]}>
          <ManageUsersPage />
        </PrivateRoute>
      } />
      <Route path="/admin/gestionar-cursos" element={
        <PrivateRoute allowedRoles={["admin"]}>
          <ManageCoursesPage />
        </PrivateRoute>
      } />

      {/* Rutas protegidas - capacitador */}
      <Route path="/capacitador" element={
        <PrivateRoute allowedRoles={["capacitador"]}>
          <CapacitadorPage />
        </PrivateRoute>
      } />
      <Route path="/capacitador/cursos" element={
        <PrivateRoute allowedRoles={["capacitador"]}>
          <CapacitadorCursos />
        </PrivateRoute>
      } />
    </Routes>
  );
}
