import axios from 'axios';

const API_URL = 'https://plataforma-microlearning-x4bz.onrender.com/api/auth';

interface AuthResponse {
  token: string;
  user: {
    _id: string;
    email: string;
    username: string;
    rut: string;
    role: string;
  };
}

export interface UserData {
  _id: string;
  email: string;
  username: string;
  rut: string;
  role: string;
}

export const register = async (data: {
  email: string;
  username: string;
  rut: string;
  password: string;
}) => {
  const res = await axios.post(`${API_URL}/register`, data);
  return res.data;
};

export const login = async (data: { email: string; password: string }): Promise<AuthResponse> => {
  const res = await axios.post<AuthResponse>(`${API_URL}/login`, data);
  return res.data;
};

export const getCurrentUser = (): UserData | null => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      _id: payload.id, 
      email: payload.email,
      username: payload.username,
      rut: payload.rut,
      role: payload.role
    };
  } catch (e) {
    console.error('Error decoding token', e);
    return null;
  }
};
