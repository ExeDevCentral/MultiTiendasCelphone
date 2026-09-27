import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, OrderItem } from '../types/database';

interface CartState {
  items: OrderItem[];
  addItem: (product: Product, options?: { color?: string; storage?: string; price?: number }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, options) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.product_id === product.id && item.color === options?.color && item.storage === options?.storage
          );

          const unitPrice = options?.price || product.price;

          if (existingIndex > -1) {
            const updated = [...state.items];
            updated[existingIndex].quantity += 1;
            return { items: updated };
          }

          const newItem: OrderItem = {
            product_id: product.id,
            name: product.name,
            brand: product.brand,
            price: unitPrice,
            quantity: 1,
            color: options?.color,
            storage: options?.storage || product.specs.almacenamiento,
            image: product.images[0],
          };

          return { items: [...state.items, newItem] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product_id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.product_id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'celstore_cart_precision',
    }
  )
);
