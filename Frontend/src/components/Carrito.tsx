import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import "./Carrito.css";

export default function Carrito() {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice } =
    useCart();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Botón flotante del carrito */}
      <button
        className="carrito-flotante"
        onClick={() => setIsOpen(true)}
        title="Ver carrito"
      >
        🛒 {items.length > 0 && <span className="badge">{items.length}</span>}
      </button>

      {/* Modal del carrito */}
      {isOpen && (
        <div className="carrito-modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="carrito-modal" onClick={(e) => e.stopPropagation()}>
            <div className="carrito-header">
              <h2>🛒 Tu Carrito</h2>
              <button
                className="btn-cerrar"
                onClick={() => setIsOpen(false)}
                title="Cerrar"
              >
                ✕
              </button>
            </div>

            {items.length === 0 ? (
              <div className="carrito-vacio">
                <p>El carrito está vacío</p>
                <p className="emoji">🛍️</p>
              </div>
            ) : (
              <>
                <div className="carrito-items">
                  {items.map((item) => (
                    <div key={item.id} className="carrito-item">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="item-imagen"
                      />
                      <div className="item-info">
                        <h4>{item.name}</h4>
                        <p className="item-precio">
                          ${item.price.toLocaleString("es-CO")}
                        </p>
                      </div>

                      <div className="item-cantidad">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="btn-cantidad"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(
                              item.id,
                              parseInt(e.target.value) || 1
                            )
                          }
                          className="cantidad-input"
                        />
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="btn-cantidad"
                        >
                          +
                        </button>
                      </div>

                      <div className="item-subtotal">
                        ${(item.price * item.quantity).toLocaleString("es-CO")}
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="btn-eliminar"
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>

                <div className="carrito-resumen">
                  <div className="resumen-fila">
                    <span>Subtotal:</span>
                    <span>${totalPrice.toLocaleString("es-CO")}</span>
                  </div>
                  <div className="resumen-fila">
                    <span>Envío:</span>
                    <span>$0 (A confirmar)</span>
                  </div>
                  <div className="resumen-total">
                    <span>Total:</span>
                    <span>${totalPrice.toLocaleString("es-CO")}</span>
                  </div>

                  <button className="btn-pagar">💳 Proceder al pago</button>
                  <button
                    className="btn-vaciar"
                    onClick={() => {
                      if (confirm("¿Vaciar carrito?")) {
                        clearCart();
                      }
                    }}
                  >
                    Vaciar carrito
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
