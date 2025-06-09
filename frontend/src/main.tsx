import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Capacitaciones from './pages/Capacitaciones';
import ResponderEvaluacion from './pages/ResponderEvaluacion';
import AdminPage from './pages/admin/admin-page';
import PrivateRoute from './services/PrivateRoute';
import ManageUsersPage from './pages/admin/gestionar-usuarios';
import ManageCoursesPage from './pages/admin/gestionar-cursos';
import CapacitadorPage from './pages/capacitador/capacitador-page';
import CapacitadorCursos from './pages/capacitador/capacitador-cursos';
import "./index.css"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/capacitaciones" element={
          <PrivateRoute allowedRoles={["usuario"]}>
            <Capacitaciones />
          </PrivateRoute>
        } />
        
        {/* Ruta para administradores */}
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
        {/* Ruta para responder evaluaciones */}
        <Route path="/responder" element={
          <PrivateRoute allowedRoles={["usuario"]}>
            <ResponderEvaluacion />
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
