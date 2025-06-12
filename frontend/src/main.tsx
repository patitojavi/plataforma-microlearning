import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RouterApp from './RouterApp';
import "./index.css";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <RouterApp />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
