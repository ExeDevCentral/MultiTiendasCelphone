import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [stores, setStores] = useState([]);
  const [activeStore, setActiveStore] = useState(null); // null = All stores hub
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generationFilter, setGenerationFilter] = useState('all'); // 'all', 'last_2_years', 'recent_gen', 'vintage_classic'
  const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'phone', 'accessory'
  const [searchQuery, setSearchQuery] = useState('');
  const [comparedProducts, setComparedProducts] = useState([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Load stores and products
  const loadData = async () => {
    setLoading(true);
    try {
      const storesData = await api.getStores();
      setStores(storesData);
      
      const productsData = await api.getProducts();
      setProducts(productsData);
    } catch (err) {
      console.error('Error loading initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered products calculation
  const getFilteredProducts = () => {
    return products.filter(p => {
      // Filter by Store
      if (activeStore && p.storeId !== activeStore.id) return false;
      // Filter by Type
      if (typeFilter !== 'all' && p.type !== typeFilter) return false;
      // Filter by Generation (only applies to phones)
      if (p.type === 'phone' && generationFilter !== 'all' && p.generationCategory !== generationFilter) return false;
      // Filter by Search Query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = p.name?.toLowerCase().includes(query);
        const matchesBrand = p.brand?.toLowerCase().includes(query);
        const matchesTagline = p.tagline?.toLowerCase().includes(query);
        const matchesTags = p.tags?.some(t => t.toLowerCase().includes(query));
        if (!matchesName && !matchesBrand && !matchesTagline && !matchesTags) return false;
      }
      return true;
    });
  };

  // Compare products helper
  const toggleCompare = (product) => {
    setComparedProducts(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      }
      if (prev.length >= 3) {
        alert('Puedes comparar hasta un máximo de 3 modelos simultáneamente.');
        return prev;
      }
      return [...prev, product];
    });
  };

  const removeCompare = (productId) => {
    setComparedProducts(prev => prev.filter(p => p.id !== productId));
  };

  const clearCompare = () => {
    setComparedProducts([]);
  };

  return (
    <StoreContext.Provider
      value={{
        stores,
        activeStore,
        setActiveStore,
        products,
        setProducts,
        loading,
        refreshData: loadData,
        generationFilter,
        setGenerationFilter,
        typeFilter,
        setTypeFilter,
        searchQuery,
        setSearchQuery,
        filteredProducts: getFilteredProducts(),
        comparedProducts,
        toggleCompare,
        removeCompare,
        clearCompare,
        isCompareOpen,
        setIsCompareOpen
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
