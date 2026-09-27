// Local Mock Store for Zero-Cost Test Mode / Portfolio Demonstration
// Allows all CRUD operations (products, stock, orders, auth) without spending Supabase quotas.

import defaultProducts from '@/data/products.json';
import defaultStores from '@/data/stores.json';
import defaultOrders from '@/data/orders.json';

// In-memory singletons across API routes in dev/serverless container
let memoryProducts = [...defaultProducts];
let memoryOrders = [...(defaultOrders || [])];
let memoryStores = [...defaultStores];

export const mockStore = {
  // Products
  getProducts(filterFn = null) {
    if (filterFn) {
      return memoryProducts.filter(filterFn);
    }
    return memoryProducts;
  },

  getProductById(id) {
    return memoryProducts.find((p) => p.id === id) || null;
  },

  createProduct(productData) {
    const newProduct = {
      id: productData.id || `prod-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      status: productData.status || 'published',
      stock: Number(productData.stock || 0),
      price: Number(productData.price || 0),
      originalPrice: productData.originalPrice ? Number(productData.originalPrice) : null,
      images: productData.images || ['https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80'],
      createdAt: new Date().toISOString(),
      ...productData,
    };
    memoryProducts.unshift(newProduct);
    return newProduct;
  },

  updateProduct(id, updates) {
    const idx = memoryProducts.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    memoryProducts[idx] = {
      ...memoryProducts[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return memoryProducts[idx];
  },

  decreaseStock(id, quantity = 1) {
    const prod = memoryProducts.find((p) => p.id === id);
    if (!prod) return { success: false, error: 'Producto no encontrado' };
    if (prod.stock < quantity) return { success: false, error: 'Stock insuficiente' };
    prod.stock -= quantity;
    return { success: true, remainingStock: prod.stock, product: prod };
  },

  deleteProduct(id) {
    const idx = memoryProducts.findIndex((p) => p.id === id);
    if (idx === -1) return false;
    memoryProducts.splice(idx, 1);
    return true;
  },

  duplicateProduct(id) {
    const original = memoryProducts.find((p) => p.id === id);
    if (!original) return null;
    const duplicated = {
      ...original,
      id: `prod-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: `${original.name} (Copia)`,
      status: 'draft',
      createdAt: new Date().toISOString(),
    };
    memoryProducts.unshift(duplicated);
    return duplicated;
  },

  // Orders
  getOrders(storeId = null) {
    if (storeId) {
      return memoryOrders.filter((o) => o.storeId === storeId);
    }
    return memoryOrders;
  },

  createOrder(orderData) {
    const trackingCode = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const newOrder = {
      id: orderData.id || trackingCode,
      storeId: orderData.storeId || 'store-celstore-premium',
      customer: orderData.customer || { name: 'Cliente de Prueba' },
      items: orderData.items || [],
      total: orderData.total || 0,
      status: orderData.status || 'pending',
      paymentMethod: orderData.paymentMethod || 'coordinacion_whatsapp',
      createdAt: new Date().toISOString(),
      isTestMode: true,
    };
    memoryOrders.unshift(newOrder);

    // Atomically decrement stock in mock memory
    for (const item of newOrder.items) {
      const prodId = item.productId || item.id;
      if (prodId) {
        mockStore.decreaseStock(prodId, item.quantity || 1);
      }
    }

    return newOrder;
  },

  // Stores
  getStores() {
    return memoryStores;
  },

  getStoreById(id) {
    return memoryStores.find((s) => s.id === id || s.slug === id) || null;
  },

  updateStore(id, updates) {
    const idx = memoryStores.findIndex((s) => s.id === id || s.slug === id);
    if (idx === -1) return null;
    memoryStores[idx] = {
      ...memoryStores[idx],
      ...updates,
    };
    return memoryStores[idx];
  },
};
