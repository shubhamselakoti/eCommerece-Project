import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

app.use(cors());
app.use(express.json());

let products = [
  { id: 1, name: 'Laptop', price: 800, image_url: `${FRONTEND_URL}/img/laptop.png` },
  { id: 2, name: 'Phone', price: 500, image_url: `${FRONTEND_URL}/img/phone.png` },
  { id: 3, name: 'Tablet', price: 350, image_url: `${FRONTEND_URL}/img/tablet.png` },
  { id: 4, name: 'Wireless Headphones', price: 120, image_url: `${FRONTEND_URL}/img/wireless-headphones.png` },
  { id: 5, name: 'Mechanical Keyboard', price: 95, image_url: `${FRONTEND_URL}/img/mechanical-keyboard.png` },
  { id: 6, name: 'Gaming Mouse', price: 60, image_url: `${FRONTEND_URL}/img/gaming-mouse.png` },
  { id: 7, name: 'Smartwatch', price: 180, image_url: `${FRONTEND_URL}/img/smartwatch.png` },
  { id: 8, name: 'Bluetooth Speaker', price: 70, image_url: `${FRONTEND_URL}/img/bluetooth-speaker.png` },
  { id: 9, name: '4K Monitor', price: 300, image_url: `${FRONTEND_URL}/img/4k-monitor.png` },
  { id: 10, name: 'Webcam', price: 45, image_url: `${FRONTEND_URL}/img/webcam.png` },
  { id: 11, name: 'External SSD 1TB', price: 140, image_url: `${FRONTEND_URL}/img/external-ssd.png` },
  { id: 12, name: 'Wireless Charger', price: 25, image_url: `${FRONTEND_URL}/img/wireless-charger.png` },
  { id: 13, name: 'Noise Cancelling Earbuds', price: 85, image_url: `${FRONTEND_URL}/img/earbuds.png` },
  { id: 14, name: 'Portable Power Bank', price: 40, image_url: `${FRONTEND_URL}/img/power-bank.png` },
  { id: 15, name: 'DSLR Camera', price: 900, image_url: `${FRONTEND_URL}/img/dslr-camera.png` },
  { id: 16, name: 'Printer', price: 150, image_url: `${FRONTEND_URL}/img/printer.png` },
  { id: 17, name: 'WiFi Router', price: 110, image_url: `${FRONTEND_URL}/img/wifi-router.png` },
  { id: 18, name: 'Graphics Card', price: 450, image_url: `${FRONTEND_URL}/img/graphics-card.png` },
  { id: 19, name: 'CPU Cooler', price: 55, image_url: `${FRONTEND_URL}/img/cpu-cooler.png` },
  { id: 20, name: 'Desktop Speakers', price: 65, image_url: `${FRONTEND_URL}/img/desktop-speakers.png` }
];

let cartItems = [];

app.get('/api/products', (req, res) => {
  res.json({ success: true, data: products });
});

app.post('/api/cart', (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const existing = cartItems.find(item => item.productId === productId);
  if (existing) existing.quantity += quantity;
  else cartItems.push({ id: Date.now(), productId, quantity });
  res.json({ success: true, data: cartItems });
});

app.get('/api/cart', (req, res) => {
  const items = cartItems.map(item => ({
    ...item,
    product: products.find(p => p.id === item.productId)
  }));
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  res.json({ success: true, data: { items, total } });
});

app.delete('/api/cart/:id', (req, res) => {
  const id = parseInt(req.params.id);
  cartItems = cartItems.filter(i => i.id !== id);
  res.json({ success: true, data: { id }, message: 'Item removed from cart' });
});

app.put('/api/cart/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { quantity } = req.body;
  if (typeof quantity !== 'number' || quantity < 1) {
    return res.status(400).json({ success: false, error: 'Invalid quantity' });
  }

  const item = cartItems.find(i => i.id === id);
  if (!item) {
    return res.status(404).json({ success: false, error: 'Cart item not found' });
  }

  item.quantity = quantity;
  res.json({ success: true, data: item });
});

app.post('/api/checkout', (req, res) => {
  const { cartItems: sentItems, customerName, customerEmail } = req.body;

  if (!Array.isArray(sentItems) || sentItems.length === 0) {
    return res.status(400).json({ success: false, error: 'Cart is empty' });
  }
  if (!customerName || !customerEmail) {
    return res.status(400).json({ success: false, error: 'Missing customer information' });
  }

  // Build receipt items with product details
  const receiptItems = sentItems.map(i => {
    const prod = products.find(p => p.id === i.productId || p.id === i.product?.id);
    return {
      product: prod || i.product || { id: i.productId, name: 'Unknown', price: 0 },
      quantity: i.quantity || 0
    };
  });

  const total = receiptItems.reduce((sum, it) => sum + (it.product.price || 0) * it.quantity, 0);

  const receipt = {
    orderId: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: Date.now(),
    customerName,
    customerEmail,
    items: receiptItems,
    total
  };

  // Clear server-side cart
  cartItems = [];

  res.json({ success: true, data: receipt });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
