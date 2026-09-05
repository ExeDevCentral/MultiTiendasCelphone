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
    try {
      const res = await fetch(`${API_BASE}/stores`);
      if (!res.ok) throw new Error('Failed to fetch stores');
      return await res.json();
    } catch (err) {
      console.warn('Using local stores fallback:', err);
      const data = await import('../../server/data/stores.json');
      return data.default.map(({ managerPassword, ...rest }) => rest);
    }
  },

  async getStore(id) {
    try {
      const res = await fetch(`${API_BASE}/stores/${id}`);
      if (!res.ok) throw new Error('Store not found');
      return await res.json();
    } catch (err) {
      const stores = await this.getStores();
      return stores.find(s => s.id === id || s.slug === id);
    }
  },

  async updateStore(id, data) {
    try {
      const res = await fetch(`${API_BASE}/stores/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Error al actualizar tienda');
      }
      return await res.json();
    } catch (err) {
      console.error('Update store error:', err);
      throw err;
    }
  },

  // Product endpoints
  async getProducts(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/products?${query}`, {
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error('Failed to fetch products');
      return await res.json();
    } catch (err) {
      console.warn('Using local products fallback:', err);
      const data = await import('../../server/data/products.json');
      let products = data.default;
      if (params.includeDrafts !== 'true') {
        products = products.filter(p => p.status === 'published' || !p.status);
      }
      if (params.storeId) products = products.filter(p => p.storeId === params.storeId);
      if (params.generationCategory) products = products.filter(p => p.generationCategory === params.generationCategory);
      if (params.type) products = products.filter(p => p.type === params.type);
      return products;
    }
  },

  async getProduct(id) {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error('Product not found');
      return await res.json();
    } catch (err) {
      const products = await this.getProducts();
      return products.find(p => p.id === id);
    }
  },

  async createProduct(productData) {
    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(productData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al crear producto');
      return data;
    } catch (err) {
      console.error('Create product error:', err);
      throw err;
    }
  },

  async updateProduct(id, productData) {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(productData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al actualizar producto');
      return data;
    } catch (err) {
      console.error('Update product error:', err);
      throw err;
    }
  },

  async duplicateProduct(id) {
    try {
      const res = await fetch(`${API_BASE}/products/${id}/duplicate`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al duplicar producto');
      return data;
    } catch (err) {
      console.error('Duplicate product error:', err);
      throw err;
    }
  },

  async deleteProduct(id) {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al eliminar producto');
      return data;
    } catch (err) {
      console.error('Delete product error:', err);
      throw err;
    }
  },

  // Smart Solution Generator
  async generateSolutions(data) {
    try {
      const res = await fetch(`${API_BASE}/generate-solutions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await res.json();
    } catch (err) {
      return {
        solutions: [
          {
            id: `sol-${Date.now()}-1`,
            title: "Rendimiento y Experiencia de Primer Nivel",
            badge: "Solución Clave",
            icon: "Zap",
            description: "Diseñado para brindar fluidez, durabilidad y máxima satisfacción en cada uso diario."
          }
        ]
      };
    }
  },

  // Auth endpoint
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al iniciar sesión');
    return data;
  },

  // Orders
  async getOrders(storeId) {
    try {
      const url = storeId ? `${API_BASE}/orders?storeId=${storeId}` : `${API_BASE}/orders`;
      const res = await fetch(url, {
        headers: getAuthHeaders()
      });
      return await res.json();
    } catch (err) {
      const data = await import('../../server/data/orders.json');
      let orders = data.default;
      if (storeId) orders = orders.filter(o => o.storeId === storeId);
      return orders;
    }
  },

  async createOrder(orderData) {
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al procesar pedido');
      return data;
    } catch (err) {
      return { id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`, ...orderData };
    }
  }
};
