const API_URL = 'http://localhost:3001/api';

export const api = {
  async getProducts() {
    const response = await fetch(`${API_URL}/products`);
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result.data;
  },

  async addToCart(productId, quantity = 1) {
    const response = await fetch(`${API_URL}/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity })
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result.data;
  },

  async getCart() {
    const response = await fetch(`${API_URL}/cart`);
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result.data;
  },

  async updateCartItem(id, quantity) {
    const response = await fetch(`${API_URL}/cart/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity })
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result.data;
  },

  async removeFromCart(id) {
    const response = await fetch(`${API_URL}/cart/${id}`, {
      method: 'DELETE'
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result;
  },

  async checkout(cartItems, customerName, customerEmail) {
    const response = await fetch(`${API_URL}/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cartItems, customerName, customerEmail })
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result.data;
  }
};
