// src/RouterApp.tsx
import { Routes, Route } from 'react-router-dom';
import App from './App';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Capacitaciones from './pages/Capacitaciones';
import ResponderEvaluacion from './pages/ResponderEvaluacion';
import Perfil from './pages/Perfil/Perfil';

export default function RouterApp() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/capacitaciones" element={<Capacitaciones />} />
      <Route path="/responder" element={<ResponderEvaluacion />} />
    </Routes>
  );
}
