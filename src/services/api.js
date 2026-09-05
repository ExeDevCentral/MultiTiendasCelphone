// API Client for CelStore Platform
const API_BASE = '/api';

const getAuthHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('celstore_auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
};

export const api = {
  // Store endpoints
  async getStores() {
    const res = await fetch(`${API_BASE}/stores`);
    if (!res.ok) throw new Error('Failed to fetch stores');
    return await res.json();
  },

  async getStore(id) {
    try {
      const res = await fetch(`${API_BASE}/stores/${id}`);
      if (!res.ok) throw new Error('Store not found');
      return await res.json();
    } catch {
      const stores = await this.getStores();
      return stores.find((s) => s.id === id || s.slug === id);
    }
  },

  async updateStore(id, data) {
    const res = await fetch(`${API_BASE}/stores/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Error al actualizar tienda');
    return json;
  },

  // Product endpoints
  async getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/products?${query}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch products');
    return await res.json();
  },

  async getProduct(id) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Product not found');
    return await res.json();
  },

  async createProduct(productData) {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al crear producto');
    return data;
  },

  async updateProduct(id, productData) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al actualizar producto');
    return data;
  },

  async duplicateProduct(id) {
    const res = await fetch(`${API_BASE}/products/${id}/duplicate`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al duplicar producto');
    return data;
  },

  async deleteProduct(id) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al eliminar producto');
    return data;
  },

  async decreaseStock(id, quantity = 1) {
    const res = await fetch(`${API_BASE}/products/${id}/decrease-stock`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ quantity }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al descontar stock');
    return data;
  },

  async generateDepthMap(id) {
    const res = await fetch(`${API_BASE}/products/${id}/generate-depth`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al generar mapa de profundidad');
    return data;
  },

  // Smart Solution Generator
  async generateSolutions(data) {
    try {
      const res = await fetch(`${API_BASE}/generate-solutions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch {
      return {
        solutions: [
          {
            id: `sol-${Date.now()}-1`,
            title: 'Rendimiento y Experiencia de Primer Nivel',
            badge: 'Solución Clave',
            icon: 'Zap',
            description:
              'Diseñado para brindar fluidez, durabilidad y máxima satisfacción en cada uso diario.',
          },
        ],
      };
    }
  },

  // Auth endpoint
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al iniciar sesión');
    return data;
  },

  // Orders
  async getOrders(storeId) {
    const url = storeId ? `${API_BASE}/orders?storeId=${storeId}` : `${API_BASE}/orders`;
    const res = await fetch(url, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch orders');
    return await res.json();
  },

  async createOrder(orderData) {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al procesar pedido');
    return data;
  },
};