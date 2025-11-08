import axios from "axios";

const API_URL = "http://localhost:8000/instrumentos/instrumentos/";

// Helper para obtener el token del localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getInstrumentos = async () => {
  const res = await axios.get(API_URL, {
    headers: getAuthHeader()
  });
  return res.data;
};

export const crearInstrumento = async (data) => {
  const res = await axios.post(API_URL, data, {
    headers: getAuthHeader()
  });
  return res.data;
};

export const actualizarInstrumento = async (id, data) => {
  const res = await axios.put(`${API_URL}${id}/`, data, {
    headers: getAuthHeader()
  });
  return res.data;
};

export const eliminarInstrumento = async (id) => {
  await axios.delete(`${API_URL}${id}/`, {
    headers: getAuthHeader()
  });
};
