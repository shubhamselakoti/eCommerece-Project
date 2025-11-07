import { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import CheckoutModal from './components/CheckoutModal';
import ReceiptModal from './components/ReceiptModal';
import { api } from './services/api';

function App() {
  const [products, setProducts] = useState([]);
  const [cartData, setCartData] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProducts();
    loadCart();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await api.getProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError('Failed to load products. Please make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const loadCart = async () => {
    try {
      const data = await api.getCart();
      setCartData(data);
    } catch (err) {
      console.error('Failed to load cart:', err);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      await api.addToCart(product.id);
      await loadCart();
      setError(null);
    } catch (err) {
      setError('Failed to add item to cart');
    }
  };

  const handleUpdateQuantity = async (id, quantity) => {
    if (quantity < 1) return;
    try {
      await api.updateCartItem(id, quantity);
      await loadCart();
    } catch (err) {
      setError('Failed to update cart');
    }
  };

  const handleRemove = async (id) => {
    try {
      await api.removeFromCart(id);
      await loadCart();
    } catch (err) {
      setError('Failed to remove item');
    }
  };

  const handleCheckoutSubmit = async (name, email) => {
    try {
      const receiptData = await api.checkout(cartData.items, name, email);
      setReceipt(receiptData);
      setShowCheckout(false);
      setShowCart(false);
      await loadCart();
    } catch (err) {
      setError('Checkout failed. Please try again.');
    }
  };

  const cartItemCount = cartData?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>Nexora eCommerce</h1>
          <button
            className="cart-button"
            onClick={() => setShowCart(!showCart)}
          >
            <ShoppingCart size={24} />
            {cartItemCount > 0 && (
              <span className="cart-badge">{cartItemCount}</span>
            )}
          </button>
        </div>
      </header>

      <main className="main-content">
        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        {showCart ? (
          <Cart
            cartData={cartData}
            onUpdateQuantity={handleUpdateQuantity}
            onRemove={handleRemove}
            onCheckout={() => setShowCheckout(true)}
          />
        ) : (
          <div className="products-section">
            <h2>Products</h2>
            {loading ? (
              <div className="loading">Loading products...</div>
            ) : (
              <div className="products-grid">
                {products.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {showCheckout && (
        <CheckoutModal
          onClose={() => setShowCheckout(false)}
          onSubmit={handleCheckoutSubmit}
        />
      )}

      {receipt && (
        <ReceiptModal
          receipt={receipt}
          onClose={() => setReceipt(null)}
        />
      )}

      <div className="footer">
        <p>&copy; {new Date().getFullYear()} Nexora eCommerce. All rights reserved.</p>
      </div>
    </div>
  );
}

export default App;
