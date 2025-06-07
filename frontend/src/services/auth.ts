import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const register = async (data: {
  email: string;
  username: string;
  rut: string;
  password: string;
}) => {
  const res = await axios.post(`${API_URL}/register`, data);
  return res.data;
};

export const login = async (data: { email: string; password: string }) => {
  const res = await axios.post(`${API_URL}/login`, data);
  return res.data;
};
