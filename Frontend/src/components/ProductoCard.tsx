import "./ProductoCard.css";
import React, { useState } from "react";
import { useCart } from "../context/CartContext";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

interface Props {
  product: Product;
}

const ProductoCard = ({ product }: Props) => {
  const { addToCart } = useCart();
  const [showNotification, setShowNotification] = useState(false);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    img.style.display = "none";
    const parent = img.parentElement;
    if (parent) {
      parent.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
      parent.style.display = "flex";
      parent.style.alignItems = "center";
      parent.style.justifyContent = "center";
      const text = document.createElement("p");
      text.textContent = "📸";
      text.style.fontSize = "48px";
      parent.appendChild(text);
    }
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    
    // Mostrar notificación
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  return (
    <div className="producto-card">
      {showNotification && (
        <div className="cart-notification">✓ Agregado al carrito</div>
      )}
      <img
        src={product.image}
        alt={product.name}
        className="producto-imagen"
        onError={handleImageError}
      />
      <h3>{product.name}</h3>
      <p className="categoria">{product.category}</p>
      <p className="descripcion">{product.description}</p>
      <p className="precio">${product.price.toLocaleString("es-CO")}</p>
      <button className="btn-comprar" onClick={handleAddToCart}>
        🛒 Agregar al carrito
      </button>
    </div>
  );
};

export default ProductoCard;
