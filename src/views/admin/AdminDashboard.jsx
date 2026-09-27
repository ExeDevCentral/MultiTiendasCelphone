'use client';

import React, { useState, useEffect } from 'react';
import {
  Store,
  Plus,
  Eye,
  LogOut,
  Smartphone,
  Package,
  ShoppingBag,
  DollarSign,
  Layers,
  Sparkles,
  SlidersHorizontal,
  Terminal,
  Activity,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { api } from '../../services/api';
import { playSubtleClick } from '../../utils/audioHaptics';

// Modular Subcomponents
import { ProductList } from './components/ProductList';
import { ProductFormModal } from './components/ProductFormModal';
import { BulkStockEditor } from './components/BulkStockEditor';
import { StoreSettingsForm } from './components/StoreSettingsForm';
import { OrdersTracker } from './components/OrdersTracker';

export const AdminDashboard = ({ onNavigate }) => {
  const { user, logout, isSuperAdmin } = useAuth();
  const { stores, products, refreshData } = useStore();

  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'bulk_editor' | 'store_settings' | 'orders'
  const [selectedStoreId, setSelectedStoreId] = useState(user?.storeId || stores[0]?.id || 'store-celstore-premium');
  const [storeOrders, setStoreOrders] = useState([]);
  const [allStoreProducts, setAllStoreProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const currentStore = stores.find((s) => s.id === selectedStoreId) || stores[0];

  const loadStoreData = async (sId) => {
    setIsLoading(true);
    try {
      const [ordersData, prodsData] = await Promise.all([
        api.getOrders(sId),
        api.getProducts({ storeId: sId, includeDrafts: 'true' })
      ]);
      setStoreOrders(ordersData || []);
      setAllStoreProducts(prodsData || []);
    } catch (err) {
      console.error('Error loading store dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedStoreId) {
      loadStoreData(selectedStoreId);
    }
  }, [selectedStoreId, products]);

  // Product Actions
  const handleOpenNew = () => {
    playSubtleClick();
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEdit = (prod) => {
    playSubtleClick();
    setEditingProduct(prod);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (productData) => {
    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, productData);
      } else {
        await api.createProduct(productData);
      }
      setIsProductModalOpen(false);
      await refreshData();
      await loadStoreData(selectedStoreId);
    } catch (err) {
      console.error('Error saving product:', err);
    }
  };

  const handleDuplicateProduct = async (prodId) => {
    playSubtleClick();
    try {
      await api.duplicateProduct(prodId);
      await refreshData();
      await loadStoreData(selectedStoreId);
    } catch (err) {
      console.error('Error duplicating product:', err);
    }
  };

  const handleDeleteProduct = async (prodId) => {
    playSubtleClick();
    if (!window.confirm('¿Confirmas eliminar este elemento del inventario?')) return;
    try {
      await api.deleteProduct(prodId);
      await refreshData();
      await loadStoreData(selectedStoreId);
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  // Metrics (Tabular calculation)
  const totalStock = allStoreProducts.reduce((acc, p) => acc + (Number(p.stock) || 0), 0);
  const totalRevenue = storeOrders.reduce((acc, o) => acc + (Number(o.total) || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6 font-mono">
      {/* Precision Hardware Console Header */}
      <div className="bg-[#0E0E10] border border-[#1A1A1D] p-5 sm:p-6 space-y-4">
        {/* Top Status & Telemetry Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1A1A1D] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-[#0066FF] animate-pulse" />
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#F5F5F7] tracking-wider uppercase">
                TERMINAL // CENTRO DE CONTROL
              </span>
              <span className="text-[10px] px-2 py-0.5 bg-[#141416] border border-[#0066FF] text-[#0066FF] font-bold">
                MODO PRUEBA // 0 QUOTA SUPABASE
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-[#71717A]">
            <span>SESIÓN: <strong className="text-[#F5F5F7]">{user?.email || 'admin@celstore.com'}</strong></span>
            <span>[{user?.role === 'superadmin' ? 'SUPERADMIN' : 'GERENTE'}]</span>
          </div>
        </div>

        {/* Store Title & Quick Operation Rack */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-1">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-sans tracking-tight text-[#F5F5F7]">
              {currentStore?.name || 'CelStore Central'}
            </h1>
            <p className="text-xs text-[#71717A] mt-0.5">
              Gestión atómica de stock, catálogo técnico y pedidos de sucursal.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isSuperAdmin && (
              <select
                value={selectedStoreId}
                onChange={(e) => setSelectedStoreId(e.target.value)}
                className="bg-[#141416] border border-[#1A1A1D] text-[#F5F5F7] text-xs px-3 py-1.5 outline-none font-bold cursor-pointer hover:border-[#0066FF] transition-colors"
              >
                {stores.map((s) => (
                  <option key={s.id} value={s.id}>
                    SUCURSAL: {s.name.toUpperCase()}
                  </option>
                ))}
              </select>
            )}

            <button
              type="button"
              onClick={() => onNavigate('store_catalog', { storeId: selectedStoreId })}
              className="px-3 py-1.5 bg-[#141416] hover:bg-[#1E1E22] border border-[#1A1A1D] hover:border-[#0066FF] text-[#F5F5F7] text-xs flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Eye className="w-3.5 h-3.5 text-[#0066FF]" />
              <span>[ VER TIENDA EN VIVO ]</span>
            </button>

            <button
              type="button"
              onClick={() => {
                logout();
                onNavigate('home');
              }}
              className="px-3 py-1.5 bg-[#141416] hover:bg-[#251010] border border-[#1A1A1D] hover:border-[#FF3B30] text-[#FF3B30] text-xs flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>[ SALIR ]</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid (Tabular-nums) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-[#0E0E10] border border-[#1A1A1D] p-4 flex flex-col justify-between">
          <span className="text-[10px] text-[#71717A] uppercase tracking-wider font-bold">
            MODELOS EN CATÁLOGO
          </span>
          <div className="text-2xl font-bold font-mono text-[#F5F5F7] tabular-nums mt-2">
            {String(allStoreProducts.length).padStart(2, '0')}
          </div>
          <span className="text-[9px] text-[#71717A] mt-1">// DISPONIBLES EN SISTEMA</span>
        </div>

        <div className="bg-[#0E0E10] border border-[#1A1A1D] p-4 flex flex-col justify-between">
          <span className="text-[10px] text-[#71717A] uppercase tracking-wider font-bold">
            INVENTARIO FÍSICO
          </span>
          <div className="text-2xl font-bold font-mono text-[#0066FF] tabular-nums mt-2">
            {totalStock} <span className="text-xs text-[#71717A]">U</span>
          </div>
          <span className="text-[9px] text-[#71717A] mt-1">// CONTROL ATÓMICO ACTIVO</span>
        </div>

        <div className="bg-[#0E0E10] border border-[#1A1A1D] p-4 flex flex-col justify-between">
          <span className="text-[10px] text-[#71717A] uppercase tracking-wider font-bold">
            PEDIDOS REGISTRADOS
          </span>
          <div className="text-2xl font-bold font-mono text-[#F5F5F7] tabular-nums mt-2">
            {String(storeOrders.length).padStart(2, '0')}
          </div>
          <span className="text-[9px] text-[#71717A] mt-1">// HISTORIAL COMPLETO</span>
        </div>

        <div className="bg-[#0E0E10] border border-[#1A1A1D] p-4 flex flex-col justify-between">
          <span className="text-[10px] text-[#71717A] uppercase tracking-wider font-bold">
            VOLUMEN ESTIMADO
          </span>
          <div className="text-2xl font-bold font-mono text-[#F5F5F7] tabular-nums mt-2">
            ${totalRevenue.toLocaleString()} <span className="text-xs text-[#71717A]">USD</span>
          </div>
          <span className="text-[9px] text-[#71717A] mt-1">// SIMULACIÓN DE VENTAS</span>
        </div>
      </div>

      {/* Tabs Navigation Rack */}
      <div className="flex items-center gap-1.5 border-b border-[#1A1A1D] pb-3 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => {
            playSubtleClick();
            setActiveTab('products');
          }}
          className={`px-3 py-1.5 text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
            activeTab === 'products'
              ? 'bg-[#0066FF] text-[#F5F5F7]'
              : 'bg-[#141416] text-[#71717A] hover:text-[#F5F5F7] hover:bg-[#1E1E22] border border-[#1A1A1D]'
          }`}
        >
          [ 01: CATÁLOGO ({allStoreProducts.length}) ]
        </button>

        <button
          type="button"
          onClick={() => {
            playSubtleClick();
            setActiveTab('bulk_editor');
          }}
          className={`px-3 py-1.5 text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
            activeTab === 'bulk_editor'
              ? 'bg-[#0066FF] text-[#F5F5F7]'
              : 'bg-[#141416] text-[#71717A] hover:text-[#F5F5F7] hover:bg-[#1E1E22] border border-[#1A1A1D]'
          }`}
        >
          [ 02: EDITOR DE STOCK ]
        </button>

        <button
          type="button"
          onClick={() => {
            playSubtleClick();
            setActiveTab('orders');
          }}
          className={`px-3 py-1.5 text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
            activeTab === 'orders'
              ? 'bg-[#0066FF] text-[#F5F5F7]'
              : 'bg-[#141416] text-[#71717A] hover:text-[#F5F5F7] hover:bg-[#1E1E22] border border-[#1A1A1D]'
          }`}
        >
          [ 03: PEDIDOS ({storeOrders.length}) ]
        </button>

        <button
          type="button"
          onClick={() => {
            playSubtleClick();
            setActiveTab('store_settings');
          }}
          className={`px-3 py-1.5 text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
            activeTab === 'store_settings'
              ? 'bg-[#0066FF] text-[#F5F5F7]'
              : 'bg-[#141416] text-[#71717A] hover:text-[#F5F5F7] hover:bg-[#1E1E22] border border-[#1A1A1D]'
          }`}
        >
          [ 04: DATOS SUCURSAL & WHATSAPP ]
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'products' && (
        <ProductList
          products={allStoreProducts}
          onOpenNew={handleOpenNew}
          onOpenEdit={handleOpenEdit}
          onDuplicate={handleDuplicateProduct}
          onDelete={handleDeleteProduct}
        />
      )}

      {activeTab === 'bulk_editor' && (
        <BulkStockEditor
          products={allStoreProducts}
          onRefresh={() => loadStoreData(selectedStoreId)}
        />
      )}

      {activeTab === 'orders' && (
        <OrdersTracker orders={storeOrders} />
      )}

      {activeTab === 'store_settings' && (
        <StoreSettingsForm
          store={currentStore}
          onSaveSuccess={() => {
            refreshData();
            loadStoreData(selectedStoreId);
          }}
        />
      )}

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSave={handleSaveProduct}
        editingProduct={editingProduct}
        storeId={selectedStoreId}
      />
    </div>
  );
};
