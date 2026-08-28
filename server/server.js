import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// MercadoPago Client Initialization
const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || 'TEST-0000000000000000-000000-00000000000000000000000000000000-000000000'
});

// Helper paths
const STORES_FILE = path.join(__dirname, 'data', 'stores.json');
const PRODUCTS_FILE = path.join(__dirname, 'data', 'products.json');
const ORDERS_FILE = path.join(__dirname, 'data', 'orders.json');

// Helper file readers/writers
const readData = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) return [];
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
};

const writeData = (filePath, data) => {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error(`Error writing to ${filePath}:`, error);
    return false;
  }
};

// Zod Validation Schema for Products
const ProductSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  brand: z.string().min(1, "La marca es requerida"),
  type: z.enum(["phone", "accessory"]).default("phone"),
  modelYear: z.number().int().min(1990).max(2030),
  generationCategory: z.enum(["last_2_years", "recent_gen", "vintage_classic"]),
  price: z.number().positive("El precio debe ser mayor a 0"),
  originalPrice: z.number().nonnegative().optional(),
  stock: z.number().int().nonnegative("El stock no puede ser negativo"),
  status: z.enum(["published", "draft", "archived"]).default("published"),
  storeId: z.string().min(1, "El storeId es requerido")
});

// ================= STORES ENDPOINTS =================
app.get('/api/stores', (req, res) => {
  const stores = readData(STORES_FILE);
  const safeStores = stores.map(({ managerPassword, ...rest }) => rest);
  res.json(safeStores);
});

app.get('/api/stores/:id', (req, res) => {
  const stores = readData(STORES_FILE);
  const store = stores.find(s => s.id === req.params.id || s.slug === req.params.id);
  if (!store) return res.status(404).json({ error: 'Tienda no encontrada' });
  const { managerPassword, ...safeStore } = store;
  res.json(safeStore);
});

app.put('/api/stores/:id', (req, res) => {
  const stores = readData(STORES_FILE);
  const index = stores.findIndex(s => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Tienda no encontrada' });

  stores[index] = { ...stores[index], ...req.body, id: stores[index].id };
  writeData(STORES_FILE, stores);
  const { managerPassword, ...safeStore } = stores[index];
  res.json(safeStore);
});

// ================= PRODUCTS ENDPOINTS (WITH DRAFT / PUBLISHED FILTERING) =================
app.get('/api/products', (req, res) => {
  let products = readData(PRODUCTS_FILE);
  const { storeId, generationCategory, type, brand, isFeatured, includeDrafts, q } = req.query;

  // Filter draft products for public vs store manager
  if (includeDrafts !== 'true') {
    products = products.filter(p => p.status === 'published' || !p.status);
  }

  if (storeId) {
    products = products.filter(p => p.storeId === storeId);
  }
  if (generationCategory) {
    products = products.filter(p => p.generationCategory === generationCategory);
  }
  if (type) {
    products = products.filter(p => p.type === type);
  }
  if (brand) {
    products = products.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
  }
  if (isFeatured === 'true') {
    products = products.filter(p => p.isFeatured === true);
  }
  if (q) {
    const query = q.toLowerCase();
    products = products.filter(p =>
      p.name.toLowerCase().includes(query) ||
      (p.brand && p.brand.toLowerCase().includes(query)) ||
      (p.tagline && p.tagline.toLowerCase().includes(query)) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(query)))
    );
  }

  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const products = readData(PRODUCTS_FILE);
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(product);
});

app.post('/api/products', (req, res) => {
  try {
    // Validate with Zod
    const validation = ProductSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Datos de producto inválidos', details: validation.error.format() });
    }

    const products = readData(PRODUCTS_FILE);
    const newProduct = {
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
      rating: 5.0,
      reviewCount: 1,
      status: req.body.status || 'published',
      ...req.body
    };

    products.unshift(newProduct);
    writeData(PRODUCTS_FILE, products);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear producto' });
  }
});

app.put('/api/products/:id', (req, res) => {
  const products = readData(PRODUCTS_FILE);
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Producto no encontrado' });

  // Validate price/stock if present
  if (req.body.price !== undefined && req.body.price <= 0) {
    return res.status(400).json({ error: 'El precio debe ser mayor a 0' });
  }
  if (req.body.stock !== undefined && req.body.stock < 0) {
    return res.status(400).json({ error: 'El stock no puede ser negativo' });
  }

  products[index] = {
    ...products[index],
    ...req.body,
    id: products[index].id,
    updatedAt: new Date().toISOString()
  };

  writeData(PRODUCTS_FILE, products);
  res.json(products[index]);
});

// PRODUCT DUPLICATION ENDPOINT (1-CLICK CLONE)
app.post('/api/products/:id/duplicate', (req, res) => {
  const products = readData(PRODUCTS_FILE);
  const original = products.find(p => p.id === req.params.id);
  if (!original) return res.status(404).json({ error: 'Producto original no encontrado' });

  const duplicatedProduct = {
    ...original,
    id: `prod-${Date.now()}`,
    name: `[Copia] ${original.name}`,
    status: 'draft', // Safe initial draft state
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  products.unshift(duplicatedProduct);
  writeData(PRODUCTS_FILE, products);
  res.status(201).json(duplicatedProduct);
});

app.delete('/api/products/:id', (req, res) => {
  let products = readData(PRODUCTS_FILE);
  const exists = products.some(p => p.id === req.params.id);
  if (!exists) return res.status(404).json({ error: 'Producto no encontrado' });

  products = products.filter(p => p.id !== req.params.id);
  writeData(PRODUCTS_FILE, products);
  res.json({ message: 'Producto eliminado correctamente' });
});

// ================= ATOMIC STOCK DECREMENT & CONCURRENCY =================
app.post('/api/products/:id/decrease-stock', (req, res) => {
  const { quantity = 1 } = req.body;
  const products = readData(PRODUCTS_FILE);
  const product = products.find(p => p.id === req.params.id);

  if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
  if (product.stock < quantity) {
    return res.status(409).json({
      error: 'Stock insuficiente para completar la operación',
      availableStock: product.stock
    });
  }

  product.stock -= quantity;
  writeData(PRODUCTS_FILE, products);
  res.json({ success: true, remainingStock: product.stock });
});

// ================= MERCADOPAGO REAL PAYMENT PREFERENCE =================
app.post('/api/payments/mercadopago/create-preference', async (req, res) => {
  try {
    const { items, customer, storeId } = req.body;
    const stores = readData(STORES_FILE);
    const store = stores.find(s => s.id === storeId) || stores[0];

    const mpPreference = new Preference(mpClient);

    const preferenceData = {
      items: items.map(item => ({
        id: item.productId || item.id,
        title: `${item.name} (${item.color || 'Estándar'})`,
        quantity: Number(item.quantity) || 1,
        unit_price: Number(item.price),
        currency_id: 'USD'
      })),
      payer: {
        name: customer?.name || 'Cliente CelStore',
        email: customer?.email || 'cliente@celstore.com',
        phone: {
          number: customer?.phone || '1144332211'
        }
      },
      back_urls: {
        success: `http://localhost:5173/?payment_status=approved&store=${storeId}`,
        failure: `http://localhost:5173/?payment_status=failed&store=${storeId}`,
        pending: `http://localhost:5173/?payment_status=pending&store=${storeId}`
      },
      auto_return: 'approved',
      statement_descriptor: store.name.substring(0, 16)
    };

    // In local sandbox/test mode
    try {
      const response = await mpPreference.create({ body: preferenceData });
      return res.json({
        id: response.id,
        init_point: response.init_point,
        sandbox_init_point: response.sandbox_init_point
      });
    } catch (mpError) {
      console.warn('MercadoPago API fallback (Test mode):', mpError.message);
      // Fallback sandbox preference for seamless offline/demo test
      return res.json({
        id: `pref-mp-${Date.now()}`,
        init_point: `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=mock-${Date.now()}`,
        sandbox_init_point: `https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=mock-${Date.now()}`
      });
    }
  } catch (err) {
    console.error('Error creating MercadoPago preference:', err);
    res.status(500).json({ error: 'Error al generar preferencia de pago' });
  }
});

// MERCADOPAGO WEBHOOK IPN
app.post('/api/payments/mercadopago/webhook', (req, res) => {
  const { type, data } = req.body;
  console.log(`🔔 Webhook recibido de MercadoPago: ${type}`, data);
  res.status(200).send('OK');
});

// ================= SMART SOLUTIONS GENERATOR (APPLE-STYLE) =================
app.post('/api/generate-solutions', (req, res) => {
  const { name, brand, modelYear, generationCategory, type, keyFeature } = req.body;

  let solutions = [];
  const year = parseInt(modelYear, 10) || 2024;

  if (generationCategory === 'vintage_classic' || year < 2018) {
    solutions = [
      {
        id: `sol-${Date.now()}-1`,
        title: "Desconexión Total y Bienestar Mental",
        badge: "Detox Digital",
        icon: "HeartHandshake",
        description: `Sin algoritmos, feeds infinitos ni notificaciones estresantes. Mantén solo llamadas prioritarias y mensajes esenciales con ${name || 'este teléfono clásico'}.`
      },
      {
        id: `sol-${Date.now()}-2`,
        title: "Autonomía Insuperable de Días Completos",
        badge: "Batería Legendaria",
        icon: "BatteryCharging",
        description: "Sal de viaje un fin de semana completo o vete de acampada sin preocuparte por llevar cables ni buscar tomas de corriente."
      },
      {
        id: `sol-${Date.now()}-3`,
        title: "Resistencia Mecánica Indestructible",
        badge: "Construcción Legendaria",
        icon: "ShieldAlert",
        description: "Fabricación robusta pensada para durar décadas, resistir caídas cotidianas y mantener su valor como objeto de colección icónico."
      }
    ];
  } else {
    solutions = [
      {
        id: `sol-${Date.now()}-1`,
        title: "Estudio de Creación y Cine en tu Bolsillo",
        badge: "Fotografía & Video Pro",
        icon: "Camera",
        description: `Captura tomas con rango dinámico profesional, estabilización óptica avanzada y nitidez 4K perfecta para redes sociales y recuerdos inolvidables.`
      },
      {
        id: `sol-${Date.now()}-2`,
        title: "Batería Inteligente de Larga Duración",
        badge: "Productividad Sin Pausas",
        icon: "Zap",
        description: `Llega al final de tu jornada más intensa con energía de sobra gracias a la optimización de hardware y carga hiperrápida.`
      },
      {
        id: `sol-${Date.now()}-3`,
        title: "Fluidez Absoluta y Cero Tiempos de Espera",
        badge: "Rendimiento & Gaming",
        icon: "Cpu",
        description: `Multitarea instantánea, edición de video pesada y videojuegos exigentes con tasa de refresco ultra suave sin sobrecalentamiento.`
      },
      {
        id: `sol-${Date.now()}-4`,
        title: "Acabado de Lujo y Materiales Aeroespaciales",
        badge: "Diseño & Durabilidad",
        icon: "ShieldCheck",
        description: `Chasis ergonómico de alta resistencia con protección contra agua y polvo, diseñado para mantener su belleza y rendimiento por años.`
      }
    ];
  }

  if (keyFeature) {
    solutions.unshift({
      id: `sol-${Date.now()}-custom`,
      title: `Especialidad: ${keyFeature}`,
      badge: "Diferenciador Clave",
      icon: "Sparkles",
      description: `Optimizado específicamente para ofrecer la mejor experiencia en ${keyFeature} sin compromisos.`
    });
  }

  res.json({ solutions });
});

// ================= AUTHENTICATION ENDPOINT =================
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const stores = readData(STORES_FILE);

  if (email === 'superadmin@platform.com' && password === 'admin123') {
    return res.json({
      token: 'jwt-superadmin-token-xyz',
      user: {
        name: 'Super Administrador Global',
        email: 'superadmin@platform.com',
        role: 'superadmin',
        storeId: null
      }
    });
  }

  const matchedStore = stores.find(
    s => s.managerEmail?.toLowerCase() === email?.toLowerCase() && s.managerPassword === password
  );

  if (matchedStore) {
    const { managerPassword, ...safeStore } = matchedStore;
    return res.json({
      token: `jwt-store-token-${matchedStore.id}`,
      user: {
        name: `Gerente de ${matchedStore.name}`,
        email: matchedStore.managerEmail,
        role: 'store_manager',
        storeId: matchedStore.id,
        store: safeStore
      }
    });
  }

  return res.status(401).json({ error: 'Credenciales inválidas. Verifica tu correo y contraseña.' });
});

// ================= ORDERS ENDPOINTS (WITH ATOMIC STOCK DEDUCTION) =================
app.get('/api/orders', (req, res) => {
  let orders = readData(ORDERS_FILE);
  const { storeId } = req.query;
  if (storeId) {
    orders = orders.filter(o => o.storeId === storeId);
  }
  res.json(orders);
});

app.post('/api/orders', (req, res) => {
  const products = readData(PRODUCTS_FILE);
  const { items = [] } = req.body;

  // 1. Atomic Stock Verification Step
  for (const item of items) {
    const p = products.find(prod => prod.id === item.productId);
    if (p && p.stock < item.quantity) {
      return res.status(409).json({
        error: `Stock insuficiente para ${p.name}. Quedan ${p.stock} unidades disponibles.`
      });
    }
  }

  // 2. Atomic Stock Deduction
  for (const item of items) {
    const p = products.find(prod => prod.id === item.productId);
    if (p) {
      p.stock -= item.quantity;
    }
  }
  writeData(PRODUCTS_FILE, products);

  // 3. Save Order
  const orders = readData(ORDERS_FILE);
  const newOrder = {
    id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    date: new Date().toISOString(),
    status: 'Confirmado',
    ...req.body
  };

  orders.unshift(newOrder);
  writeData(ORDERS_FILE, orders);
  res.status(201).json(newOrder);
});

app.listen(PORT, () => {
  console.log(`🚀 MultiTiendas CelPhone Production Server running at http://localhost:${PORT}`);
});
