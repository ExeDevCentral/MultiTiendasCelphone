import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'server', 'data');
export const STORES_FILE = path.join(DATA_DIR, 'stores.json');
export const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
export const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

export const readData = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) return [];
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
};

export const writeData = (filePath, data) => {
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
