import { ShoppingCart } from 'lucide-react';

export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="product-card">
      <img src={product.image_url} alt={product.name} className="product-image" />
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-footer">
          <span className="product-price">${product.price}</span>
          <button
            className="add-to-cart-btn"
            onClick={() => onAddToCart(product)}
          >
            <ShoppingCart size={18} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
