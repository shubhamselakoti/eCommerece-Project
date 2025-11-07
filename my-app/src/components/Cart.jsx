import { X, Plus, Minus } from 'lucide-react';

export default function Cart({ cartData, onUpdateQuantity, onRemove, onCheckout }) {
  if (!cartData || cartData.items.length === 0) {
    return (
      <div className="cart-empty">
        <p>Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>
      <div className="cart-items">
        {cartData.items.map(item => (
          <div key={item.id} className="cart-item">
            <img
              src={item.product.image_url}
              alt={item.product.name}
              className="cart-item-image"
            />
            <div className="cart-item-info">
              <h3>{item.product.name}</h3>
              <p className="cart-item-price">${item.product.price}</p>
            </div>
            <div className="cart-item-controls">
              <div className="quantity-controls">
                <button
                  className="quantity-btn"
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <span className="quantity">{item.quantity}</span>
                <button
                  className="quantity-btn"
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                >
                  <Plus size={16} />
                </button>
              </div>
              <p className="cart-item-subtotal">
                ${(item.product.price * item.quantity).toFixed(2)}
              </p>
              <button
                className="remove-btn"
                onClick={() => onRemove(item.id)}
                title="Remove item"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-total">
        <h3>Total: ${cartData.total.toFixed(2)}</h3>
        <button className="checkout-btn" onClick={onCheckout}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
