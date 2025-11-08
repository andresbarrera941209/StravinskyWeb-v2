import axios from "axios";

const API_URL = "http://localhost:8000/usuarios/"; // URL del backend

// Helper para obtener el token del localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Obtener todos los usuarios
export const getUsuarios = async () => {
  const res = await axios.get(API_URL, {
    headers: getAuthHeader()
  });
  return res.data;
};

// Crear un nuevo usuario
export const crearUsuario = async (data) => {
  const res = await axios.post(API_URL, data, {
    headers: getAuthHeader()
  });
  return res.data;
};

// Actualizar usuario
export const actualizarUsuario = async (id, data) => {
  const res = await axios.put(`${API_URL}${id}/`, data, {
    headers: getAuthHeader()
  });
  return res.data;
};

// Eliminar usuario
export const eliminarUsuario = async (id) => {
  await axios.delete(`${API_URL}${id}/`, {
    headers: getAuthHeader()
  });
};
