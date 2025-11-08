import axios from "axios";

const API_URL = "http://localhost:8000";

export interface LoginCredentials {
  correo: string;
  password: string;
}

export interface RegisterData {
  nombre: string;
  correo: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id: number;
  nombre: string;
  correo: string;
}

// Login de usuario
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/auth/login`, {
    correo: credentials.correo,
    password: credentials.password
  }, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

// Registro de usuario
export const register = async (userData: RegisterData): Promise<User> => {
  const response = await axios.post(`${API_URL}/auth/register`, {
    nombre: userData.nombre,
    correo: userData.correo,
    password: userData.password
  }, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

// Obtener información del usuario actual
export const getCurrentUser = async (token: string): Promise<User> => {
  const response = await axios.get(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Logout (principalmente limpia el token del cliente)
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
