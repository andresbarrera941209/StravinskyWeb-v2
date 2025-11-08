import { useEffect, useState } from "react";
import {
  getInstrumentos,
  crearInstrumento,
  actualizarInstrumento,
  eliminarInstrumento,
} from "../api/instrumentosApi";

function InstrumentosPage() {
  const [instrumentos, setInstrumentos] = useState([]);
  const [nuevo, setNuevo] = useState({ nombre: "", tipo: "", marca: "", precio: "" });
  const [editando, setEditando] = useState(null);

  const cargarInstrumentos = async () => {
    const data = await getInstrumentos();
    setInstrumentos(data);
  };

  useEffect(() => {
    cargarInstrumentos();
  }, []);

  const handleChange = (e) => {
    setNuevo({ ...nuevo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editando) {
      await actualizarInstrumento(editando.id, nuevo);
      setEditando(null);
    } else {
      await crearInstrumento(nuevo);
    }
    setNuevo({ nombre: "", tipo: "", marca: "", precio: "" });
    cargarInstrumentos();
  };

  const handleEdit = (inst) => {
    setNuevo(inst);
    setEditando(inst);
  };

  const handleDelete = async (id) => {
    await eliminarInstrumento(id);
    cargarInstrumentos();
  };

  return (
    <div className="container mt-4">
      <h2>Gestión de Instrumentos</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <input name="nombre" placeholder="Nombre" value={nuevo.nombre} onChange={handleChange} />
        <input name="tipo" placeholder="Tipo" value={nuevo.tipo} onChange={handleChange} />
        <input name="marca" placeholder="Marca" value={nuevo.marca} onChange={handleChange} />
        <input name="precio" placeholder="Precio" value={nuevo.precio} onChange={handleChange} />
        <button type="submit">{editando ? "Actualizar" : "Agregar"}</button>
      </form>

      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Marca</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {instrumentos.map((inst) => (
            <tr key={inst.id}>
              <td>{inst.nombre}</td>
              <td>{inst.tipo}</td>
              <td>{inst.marca}</td>
              <td>{inst.precio}</td>
              <td>
                <button onClick={() => handleEdit(inst)}>Editar</button>
                <button onClick={() => handleDelete(inst.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InstrumentosPage;
