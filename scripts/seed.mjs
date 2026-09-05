/**
 * Seed de CelStore hacia Supabase.
 * Carga stores/products/orders desde data/*.json y crea usuarios de login.
 *
 * Uso:
 *   cp .env.example .env.local   # completa SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY
 *   npm run seed
 */
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';
import { toStoreRow, toProductRow, toOrderRow } from '../src/lib/supabaseMappers.js';

dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');

const readJson = (name) =>
  JSON.parse(fs.readFileSync(path.join(DATA_DIR, name), 'utf-8'));

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('❌ Faltan SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en .env.local');
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

async function seedStores() {
  const stores = readJson('stores.json');
  const rows = [];
  for (const store of stores) {
    const hash = await bcrypt.hash(store.managerPassword, 10);
    rows.push({
      ...toStoreRow({ ...store, managerPassword: hash }),
      manager_email: store.managerEmail,
      manager_password_hash: hash,
    });
  }
  const { data, error } = await supabase.from('stores').upsert(rows, { onConflict: 'id' });
  if (error) throw new Error(`stores: ${error.message}`);
  console.log(`✅ Tiendas sincronizadas: ${data?.length ?? rows.length}`);
  return stores;
}

async function seedProducts() {
  const products = readJson('products.json');
  const rows = products.map((p) => toProductRow(p));
  const { data, error } = await supabase.from('products').upsert(rows, { onConflict: 'id' });
  if (error) throw new Error(`products: ${error.message}`);
  console.log(`✅ Productos sincronizados: ${data?.length ?? rows.length}`);
}

async function seedOrders(stores) {
  const orders = readJson('orders.json');
  // Validar que los storeId seed existan en el catálogo de tiendas
  const validIds = new Set(stores.map((s) => s.id));
  const validOrders = orders.filter((o) => validIds.has(o.storeId));
  const rows = validOrders.map((o) => toOrderRow(o));
  const { data, error } = await supabase.from('orders').upsert(rows, { onConflict: 'id' });
  if (error) throw new Error(`orders: ${error.message}`);
  console.log(`✅ Órdenes de demostración sincronizadas: ${data?.length ?? rows.length}`);
}

async function main() {
  console.log('🌱 Seeding CelStore → Supabase\n');
  const stores = await seedStores();
  await seedProducts();
  await seedOrders(stores);
  console.log('\n🚀 Seed completado. Ya podés iniciar `npm run dev`.');
}

main().catch((err) => {
  console.error('❌ Seed fallido:', err.message);
  process.exit(1);
});