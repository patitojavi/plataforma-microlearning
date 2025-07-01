import axios from 'axios';

const API_URL = 'https://plataforma-microlearning-x4bz.onrender.com/api/evaluaciones';

export const crearEvaluacion = async (data: {
  capacitacionId: string;
  preguntas: { pregunta: string; opciones: string[]; respuestaCorrecta: string }[];
}, token: string) => {
  const res = await axios.post(API_URL, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const responderEvaluacion = async (data: {
  evaluacionId: string;
  respuestas: string[];
}, token: string) => {
  const res = await axios.post(`${API_URL}/responder`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
