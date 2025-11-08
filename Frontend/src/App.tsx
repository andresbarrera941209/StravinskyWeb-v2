import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Header from "./components/Header";
import Carrito from "./components/Carrito";
import ListaUsuarios from "./components/ListaUsuarios";
import ListaProductos from "./components/ListaProductos";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="App">
            <Header />
            <Carrito />

            <main>
              <Routes>
                {/* Rutas públicas - sin autenticación */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Rutas protegidas - requieren autenticación */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <ListaProductos />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/usuarios"
                  element={
                    <ProtectedRoute>
                      <ListaUsuarios />
                    </ProtectedRoute>
                  }
                />

                {/* Ruta 404 */}
                <Route
                  path="*"
                  element={<h2 style={{ textAlign: "center" }}>Página no encontrada</h2>}
                />
              </Routes>
            </main>

            <footer className="app-footer">
              <p>&copy; 2025 Stravinsky MusicShop</p>
            </footer>
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
