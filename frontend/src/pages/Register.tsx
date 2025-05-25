import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/auth';

export default function Register() {
  const [form, setForm] = useState({ email: '', username: '', rut: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await register(form);
      localStorage.setItem('token', res.token);
      navigate('/capacitaciones');
    } catch (err) {
      alert('Error al registrar');
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Registro</h2>
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="username" placeholder="Nombre de usuario" onChange={handleChange} />
      <input name="rut" placeholder="RUT" onChange={handleChange} />
      <input name="password" placeholder="Contraseña" type="password" onChange={handleChange} />
      <button type="submit">Registrarse</button>
    </form>
  );
}
