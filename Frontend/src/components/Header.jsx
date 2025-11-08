import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Header.css";

const Header = () => {
  const { isAuthenticated, user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // No mostrar header si está cargando o si no está autenticado
  if (loading || !isAuthenticated) {
    return null;
  }

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          Stravinsky Instrumentos
        </Link>

        <nav className="navigation">
          <Link to="/" className="nav-link">Inicio</Link>
          <Link to="/usuarios" className="nav-link">Usuarios</Link>
          <span className="nav-user">👤 {user?.nombre}</span>
          <button onClick={handleLogout} className="nav-link logout-btn">
            Cerrar Sesión
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
