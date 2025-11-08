import { products } from "../data/products";
import ProductoCard from "./ProductoCard";
import "./ListaProductos.css";

export default function ListaProductos() {
  return (
    <section className="productos-section">
      <h2 className="titulo-productos">🎸 Productos Disponibles</h2>
      <div className="productos-grid">
        {products.map((p) => (
          <ProductoCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}


