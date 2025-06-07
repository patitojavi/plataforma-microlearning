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
import "./index.css"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/capacitaciones" element={<Capacitaciones />} />
        <Route path="/responder" element={<ResponderEvaluacion />} />
        <Route path="/admin" element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AdminPage />
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
