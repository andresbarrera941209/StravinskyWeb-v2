# 📡 Endpoints de Usuarios - Documentación Actualizada

## 🔄 Tabla de Endpoints

| Método | Endpoint | Auth | Función | Headers |
|--------|----------|------|---------|---------|
| POST | `/auth/register` | ❌ | Crear cuenta | `Content-Type: application/json` |
| POST | `/auth/login` | ❌ | Obtener token | `Content-Type: application/json` |
| POST | `/usuarios/` | ✅ | Crear usuario | `Authorization: Bearer {token}` |
| GET | `/usuarios/` | ✅ | Listar usuarios | `Authorization: Bearer {token}` |
| GET | `/usuarios/{id}` | ✅ | Obtener usuario | `Authorization: Bearer {token}` |
| PUT | `/usuarios/{id}` | ✅ | Actualizar usuario | `Authorization: Bearer {token}` |
| DELETE | `/usuarios/{id}` | ✅ | Eliminar usuario | `Authorization: Bearer {token}` |
| GET | `/me` | ✅ | Tu perfil | `Authorization: Bearer {token}` |

## 📝 Endpoints Detallados

### 1. Registrar Usuario (Público)
```bash
POST /auth/register
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "correo": "juan@example.com",
  "password": "password123"
}

Response: {
  "id": 1,
  "nombre": "Juan Pérez",
  "correo": "juan@example.com"
}
```

### 2. Iniciar Sesión (Público)
```bash
POST /auth/login
Content-Type: application/json

{
  "correo": "juan@example.com",
  "password": "password123"
}

Response: {
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer"
}
```

### 3. Crear Usuario (Protegido)
```bash
POST /usuarios/
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "María García",
  "correo": "maria@example.com",
  "password": "password456"
}

Response: {
  "id": 2,
  "nombre": "María García",
  "correo": "maria@example.com"
}
```

### 4. Listar Usuarios (Protegido)
```bash
GET /usuarios/
Authorization: Bearer {token}

Response: [
  {
    "id": 1,
    "nombre": "Juan Pérez",
    "correo": "juan@example.com"
  },
  {
    "id": 2,
    "nombre": "María García",
    "correo": "maria@example.com"
  }
]
```

### 5. Obtener Usuario por ID (Protegido)
```bash
GET /usuarios/1
Authorization: Bearer {token}

Response: {
  "id": 1,
  "nombre": "Juan Pérez",
  "correo": "juan@example.com"
}
```

### 6. Actualizar Usuario (Protegido)
```bash
PUT /usuarios/1
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "Juan Carlos Pérez",
  "correo": "juancarlos@example.com",
  "password": "newpassword123"
}

Response: {
  "id": 1,
  "nombre": "Juan Carlos Pérez",
  "correo": "juancarlos@example.com"
}
```

### 7. Eliminar Usuario (Protegido)
```bash
DELETE /usuarios/1
Authorization: Bearer {token}

Response: 204 No Content
```

### 8. Obtener Tu Perfil (Protegido)
```bash
GET /me
Authorization: Bearer {token}

Response: {
  "id": 1,
  "nombre": "Juan Pérez",
  "correo": "juan@example.com"
}
```

## 🔐 Headers Necesarios

### Autenticados
```javascript
{
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json"
}
```

### Públicos
```javascript
{
  "Content-Type": "application/json"
}
```

## 📤 Ejemplos con cURL

### Crear Usuario
```bash
curl -X POST "http://localhost:8000/usuarios/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "nombre": "María García",
    "correo": "maria@example.com",
    "password": "password456"
  }'
```

### Listar Usuarios
```bash
curl -X GET "http://localhost:8000/usuarios/" \
  -H "Authorization: Bearer TOKEN"
```

### Obtener Usuario Específico
```bash
curl -X GET "http://localhost:8000/usuarios/1" \
  -H "Authorization: Bearer TOKEN"
```

### Actualizar Usuario
```bash
curl -X PUT "http://localhost:8000/usuarios/1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "nombre": "María García",
    "correo": "maria.garcia@example.com"
  }'
```

### Eliminar Usuario
```bash
curl -X DELETE "http://localhost:8000/usuarios/1" \
  -H "Authorization: Bearer TOKEN"
```

### Obtener Tu Perfil
```bash
curl -X GET "http://localhost:8000/me" \
  -H "Authorization: Bearer TOKEN"
```

## 🛠️ Implementación en Frontend

### usuariosApi.js
```javascript
import axios from "axios";

const API_URL = "http://localhost:8000/usuarios/";

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

// Crear un nuevo usuario (requiere password)
export const crearUsuario = async (data) => {
  const res = await axios.post(API_URL, data, {
    headers: getAuthHeader()
  });
  return res.data;
};

// Actualizar usuario (sin password)
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
```

### ListaUsuarios.tsx - Uso de Endpoints

**Crear Usuario:**
```typescript
const usuarioCreado = await crearUsuario({ 
  nombre, 
  correo, 
  password 
});
```

**Listar Usuarios:**
```typescript
const data = await getUsuarios();
setUsuarios(data);
```

**Actualizar Usuario:**
```typescript
const usuarioActualizado = await actualizarUsuario(id, { 
  nombre, 
  correo 
});
```

**Eliminar Usuario:**
```typescript
await eliminarUsuario(id);
```

## ✅ Flujo Completo

### 1. Registro
```
Usuario completa: nombre, correo, contraseña
→ POST /auth/register
← Recibe usuario creado
→ Automáticamente hace login
← Recibe token
→ Token se guarda en localStorage
```

### 2. CRUD de Usuarios
```
Login con token en localStorage
→ GET /usuarios/
← Lista de usuarios

Crear nuevo usuario:
→ POST /usuarios/ + { nombre, correo, password }
← Usuario creado

Editar usuario:
→ PUT /usuarios/{id} + { nombre, correo }
← Usuario actualizado

Eliminar usuario:
→ DELETE /usuarios/{id}
← Confirmación
```

## 🔍 Campos Requeridos

### Crear Usuario
- ✅ `nombre` (string, requerido)
- ✅ `correo` (string, email válido, requerido)
- ✅ `password` (string, mínimo 6 caracteres, requerido)

### Actualizar Usuario
- ✅ `nombre` (string, requerido)
- ✅ `correo` (string, email válido, requerido)
- ✅ `password` (string, mínimo 6 caracteres, requerido)

## 🚀 Validaciones en Frontend

```typescript
// Email válido
const validarEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Contraseña (solo para crear)
if (!editingId && password.length < 6) {
  setError("La contraseña debe tener al menos 6 caracteres");
}
```

## 📊 Diferencias: Crear vs Actualizar

| Operación | Endpoint | Campos | Auth |
|-----------|----------|--------|------|
| **Crear** | `POST /usuarios/` | nombre, correo, **password** | ✅ |
| **Editar** | `PUT /usuarios/{id}` | nombre, correo, **password** | ✅ |

## ✨ Mejoras Implementadas

- ✅ Campo de contraseña solo al crear usuario
- ✅ Validación de email con regex
- ✅ Validación de contraseña mínimo 6 caracteres
- ✅ Headers de autorización correctos
- ✅ Manejo de errores robusto
- ✅ Mensajes de éxito y error
- ✅ Estados de carga

## 🔗 Integración con AuthContext

El token se obtiene automáticamente de:
```typescript
const token = localStorage.getItem('token');
```

Se incluye en todos los headers:
```typescript
Authorization: `Bearer ${token}`
```

Sin necesidad de pasarlo manualmente en cada función.
