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
