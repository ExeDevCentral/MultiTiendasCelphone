import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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

// ================= STORES ENDPOINTS =================
app.get('/api/stores', (req, res) => {
  const stores = readData(STORES_FILE);
  // Omit managerPassword from public store listing
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

// ================= PRODUCTS ENDPOINTS =================
app.get('/api/products', (req, res) => {
  let products = readData(PRODUCTS_FILE);
  const { storeId, generationCategory, type, brand, isFeatured, q } = req.query;

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
  const products = readData(PRODUCTS_FILE);
  const newProduct = {
    id: `prod-${Date.now()}`,
    createdAt: new Date().toISOString(),
    rating: 5.0,
    reviewCount: 1,
    ...req.body
  };

  products.unshift(newProduct);
  writeData(PRODUCTS_FILE, products);
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', (req, res) => {
  const products = readData(PRODUCTS_FILE);
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Producto no encontrado' });

  products[index] = {
    ...products[index],
    ...req.body,
    id: products[index].id,
    updatedAt: new Date().toISOString()
  };

  writeData(PRODUCTS_FILE, products);
  res.json(products[index]);
});

app.delete('/api/products/:id', (req, res) => {
  let products = readData(PRODUCTS_FILE);
  const exists = products.some(p => p.id === req.params.id);
  if (!exists) return res.status(404).json({ error: 'Producto no encontrado' });

  products = products.filter(p => p.id !== req.params.id);
  writeData(PRODUCTS_FILE, products);
  res.json({ message: 'Producto eliminado correctamente' });
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

  // Check SuperAdmin
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

  // Check Store Managers
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

// ================= ORDERS ENDPOINTS =================
app.get('/api/orders', (req, res) => {
  let orders = readData(ORDERS_FILE);
  const { storeId } = req.query;
  if (storeId) {
    orders = orders.filter(o => o.storeId === storeId);
  }
  res.json(orders);
});

app.post('/api/orders', (req, res) => {
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
  console.log(`🚀 MultiTiendas CelPhone Server running at http://localhost:${PORT}`);
});
