export interface ProductSpecs {
  ram: string;
  almacenamiento: string;
  camara: string;
  bateria: string;
  procesador: string;
  pantalla: string;
  peso?: string;
  material?: string;
  [key: string]: string | undefined;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  model: string;
  price: number;
  stock: number;
  description: string;
  specs: ProductSpecs;
  images: string[];
  category_id?: string;
  featured: boolean;
  created_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at?: string;
}

export interface OrderItem {
  product_id: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  color?: string;
  storage?: string;
  image?: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  provinceState: string;
  postalCode: string;
  notes?: string;
}

export interface Order {
  id: string;
  user_id?: string | null;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'coordinating_whatsapp' | 'confirmed' | 'shipped' | 'cancelled';
  shipping_address: ShippingAddress;
  contact_phone: string;
  notes?: string;
  created_at?: string;
}

export interface Profile {
  id: string;
  full_name: string;
  phone: string;
  shipping_address?: ShippingAddress;
  role: 'customer' | 'admin';
  created_at?: string;
  updated_at?: string;
}
