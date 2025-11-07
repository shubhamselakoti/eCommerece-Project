import { X, CheckCircle } from 'lucide-react';

export default function ReceiptModal({ receipt, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="receipt-header">
            <CheckCircle size={32} color="#22c55e" />
            <h2>Order Confirmed!</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <div className="receipt-content">
          <div className="receipt-section">
            <p><strong>Order ID:</strong> {receipt.orderId.slice(0, 8)}</p>
            <p><strong>Date:</strong> {new Date(receipt.timestamp).toLocaleString()}</p>
          </div>
          <div className="receipt-section">
            <p><strong>Customer:</strong> {receipt.customerName}</p>
            <p><strong>Email:</strong> {receipt.customerEmail}</p>
          </div>
          <div className="receipt-section">
            <h3>Order Items</h3>
            {receipt.items.map((item, index) => (
              <div key={index} className="receipt-item">
                <span>{item.product.name} x {item.quantity}</span>
                <span>${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="receipt-total">
            <h3>Total: ${receipt.total.toFixed(2)}</h3>
          </div>
          <button className="btn-primary" onClick={onClose}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
