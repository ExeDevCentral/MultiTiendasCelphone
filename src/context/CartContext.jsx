import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('celstore_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('celstore_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product, options = {}) => {
    const {
      color = product.colors?.[0]?.name || 'Estándar',
      storage = product.storageOptions?.[0] || 'Base',
      quantity = 1,
      bundleDiscount = 0
    } = options;

    const cartItemId = `${product.id}-${color}-${storage}`;

    setItems(prev => {
      const existing = prev.find(item => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map(item =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          cartItemId,
          product,
          productId: product.id,
          name: product.name,
          image: product.images?.[0] || '',
          brand: product.brand,
          type: product.type,
          price: product.price,
          originalPrice: product.originalPrice,
          storeId: product.storeId,
          color,
          storage,
          quantity,
          bundleDiscount
        }
      ];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId) => {
    setItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId, delta) => {
    setItems(prev =>
      prev
        .map(item => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  // Calculations
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountTotal = items.reduce((acc, item) => {
    if (item.originalPrice && item.originalPrice > item.price) {
      return acc + (item.originalPrice - item.price) * item.quantity;
    }
    return acc;
  }, 0);
  const shippingCost = subtotal > 500 ? 0 : subtotal > 0 ? 15 : 0;
  const total = subtotal + shippingCost;

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        discountTotal,
        shippingCost,
        total,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
