import { useEffect, useState } from "react";
import { getUsuarios } from "../api/usuariosApi"; // Ajusta la ruta según dónde tengas tu función de fetch

interface Usuario {
  id: number;
  nombre: string;
  correo: string;
}

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [token, setToken] = useState<string>(""); // Si usas autenticación, aquí va tu token

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUsuarios(token);
        setUsuarios(data);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    };
    fetchData();
  }, [token]);

  return (
    <div className="container mt-4">
      <h2>Lista de Usuarios</h2>
      <ul>
        {usuarios.map((u) => (
          <li key={u.id}>
            {u.nombre} — {u.correo}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsuariosPage;

