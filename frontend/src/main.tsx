import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import Login from './pages/Login/Login';
import Register from './pages/Register';
import Capacitaciones from './pages/Capacitaciones';
import ResponderEvaluacion from './pages/ResponderEvaluacion';
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
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
