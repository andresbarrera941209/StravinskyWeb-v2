import { useEffect, useState } from "react";
import { getUsuarios, crearUsuario, eliminarUsuario, actualizarUsuario } from "../api/usuariosApi";
import "./ListaUsuarios.css";

interface Usuario {
  id: number;
  nombre: string;
  correo: string;
}

export default function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Cargar usuarios al iniciar
  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getUsuarios();
      setUsuarios(data);
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
      setError("Error al cargar los usuarios");
    } finally {
      setLoading(false);
    }
  };

  // Validar email
  const validarEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Agregar o actualizar usuario
  const guardarUsuario = async () => {
    setError("");
    setSuccess("");

    if (!nombre.trim() || !correo.trim()) {
      setError("Por favor ingresa todos los datos");
      return;
    }

    if (!validarEmail(correo)) {
      setError("Por favor ingresa un correo válido");
      return;
    }

    if (!password.trim()) {
      setError("Por favor ingresa una contraseña");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      if (editingId) {
        // Actualizar usuario existente (con password)
        const usuarioActualizado = await actualizarUsuario(editingId, { nombre, correo, password });
        setUsuarios(usuarios.map((u) => (u.id === editingId ? usuarioActualizado : u)));
        setSuccess("Usuario actualizado correctamente");
        setEditingId(null);
      } else {
        // Crear nuevo usuario (con password)
        const usuarioCreado = await crearUsuario({ nombre, correo, password });
        setUsuarios([...usuarios, usuarioCreado]);
        setSuccess("Usuario agregado correctamente");
      }
      setNombre("");
      setCorreo("");
      setPassword("");
    } catch (err: any) {
      console.error("Error al guardar usuario:", err);
      const mensajeError = err.response?.data?.detail || "Error al guardar usuario";
      setError(mensajeError);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar usuario
  const eliminarUserHandler = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este usuario?")) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await eliminarUsuario(id);
      setUsuarios(usuarios.filter((u) => u.id !== id));
      setSuccess("Usuario eliminado correctamente");
    } catch (err) {
      console.error("Error al eliminar:", err);
      setError("Error al eliminar usuario");
    } finally {
      setLoading(false);
    }
  };

  // Editar usuario
  const editarUsuario = (usuario: Usuario) => {
    setNombre(usuario.nombre);
    setCorreo(usuario.correo);
    setPassword(""); // Limpiar password para que el usuario ingrese la nueva
    setEditingId(usuario.id);
    setError("");
    setSuccess("");
  };

  // Cancelar edición
  const cancelarEdicion = () => {
    setNombre("");
    setCorreo("");
    setPassword("");
    setEditingId(null);
    setError("");
    setSuccess("");
  };

  // Filtrar usuarios según búsqueda
  const usuariosFiltrados = usuarios.filter(
    (usuario) =>
      usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.correo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="lista-usuarios-container">
      <div className="usuarios-header">
        <h2>📋 Gestión de Usuarios</h2>
        <p className="usuario-count">Total de usuarios: {usuarios.length}</p>
      </div>

      {/* Mensajes de estado */}
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Formulario de entrada */}
      <div className="formulario-card">
        <h3>{editingId ? "✏️ Editar Usuario" : "➕ Nuevo Usuario"}</h3>
        
        <div className="form-group">
          <label htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            type="text"
            placeholder="Ej: Juan Pérez"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            disabled={loading}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="correo">Correo Electrónico</label>
          <input
            id="correo"
            type="email"
            placeholder="Ej: juan@example.com"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            disabled={loading}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">
            Contraseña {editingId && "(dejar en blanco para mantener la actual)"}
          </label>
          <input
            id="password"
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="form-input"
          />
        </div>

        <div className="form-buttons">
          <button 
            onClick={guardarUsuario} 
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? "Guardando..." : editingId ? "Actualizar" : "Agregar"}
          </button>
          {editingId && (
            <button 
              onClick={cancelarEdicion} 
              disabled={loading}
              className="btn btn-secondary"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>

      {/* Búsqueda */}
      <div className="search-card">
        <input
          type="text"
          placeholder="🔍 Buscar por nombre o correo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Lista de usuarios */}
      <div className="usuarios-card">
        <h3>📊 Usuarios Registrados</h3>
        
        {loading && <p className="loading-message">⏳ Cargando usuarios...</p>}
        
        {usuariosFiltrados.length === 0 ? (
          <p className="empty-message">
            {usuarios.length === 0 ? "No hay usuarios registrados" : "No se encontraron usuarios"}
          </p>
        ) : (
          <div className="usuarios-tabla">
            <div className="tabla-header">
              <div className="col-id">ID</div>
              <div className="col-nombre">Nombre</div>
              <div className="col-correo">Correo</div>
              <div className="col-acciones">Acciones</div>
            </div>

            {usuariosFiltrados.map((usuario) => (
              <div 
                key={usuario.id} 
                className={`tabla-row ${editingId === usuario.id ? "editing" : ""}`}
              >
                <div className="col-id">{usuario.id}</div>
                <div className="col-nombre">{usuario.nombre}</div>
                <div className="col-correo">{usuario.correo}</div>
                <div className="col-acciones">
                  <button
                    onClick={() => editarUsuario(usuario)}
                    disabled={loading}
                    className="btn-action btn-edit"
                    title="Editar usuario"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => eliminarUserHandler(usuario.id)}
                    disabled={loading}
                    className="btn-action btn-delete"
                    title="Eliminar usuario"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
