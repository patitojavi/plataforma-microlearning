import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', background: '#eee' }}>
      <Link to="/">Inicio</Link>
      <Link to="/capacitaciones">Capacitaciones</Link>
      <Link to="/login">Login</Link>
      <Link to="/register">Registro</Link>
      <Link to="/responder">Responder Evaluación</Link>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </nav>
  );
}
