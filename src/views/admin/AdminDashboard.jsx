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
  SlidersHorizontal
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { api } from '../../services/api';

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
  const [selectedStoreId, setSelectedStoreId] = useState(user?.storeId || stores[0]?.id);
  const [storeOrders, setStoreOrders] = useState([]);
  const [allStoreProducts, setAllStoreProducts] = useState([]);

  // Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const currentStore = stores.find(s => s.id === selectedStoreId) || stores[0];

  const loadStoreData = async (sId) => {
    try {
      const [ordersData, prodsData] = await Promise.all([
        api.getOrders(sId),
        api.getProducts({ storeId: sId, includeDrafts: 'true' })
      ]);
      setStoreOrders(ordersData);
      setAllStoreProducts(prodsData);
    } catch (err) {
      console.error('Error loading store dashboard data:', err);
    }
  };

  useEffect(() => {
    if (selectedStoreId) {
      loadStoreData(selectedStoreId);
    }
  }, [selectedStoreId, products]);

  // Product Actions
  const handleOpenNew = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEdit = (prod) => {
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
    try {
      await api.duplicateProduct(prodId);
      await refreshData();
      await loadStoreData(selectedStoreId);
    } catch (err) {
      console.error('Error duplicating product:', err);
    }
  };

  const handleDeleteProduct = async (prodId) => {
    if (!window.confirm('¿Deseas eliminar este producto del catálogo de tu tienda?')) return;
    try {
      await api.deleteProduct(prodId);
      await refreshData();
      await loadStoreData(selectedStoreId);
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  // Metrics
  const totalStock = allStoreProducts.reduce((acc, p) => acc + (p.stock || 0), 0);
  const totalRevenue = storeOrders.reduce((acc, o) => acc + (o.total || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Header & Store Selector */}
      <div className="p-6 rounded-3xl glass-panel border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <img
            src={currentStore?.logo || 'https://images.unsplash.com/photo-1616469829941-c7200edec809?w=150'}
            alt="Logo"
            className="w-14 h-14 rounded-2xl object-cover border border-white/20 bg-neutral-900 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Panel de Administración
              </span>
              {isSuperAdmin && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/30">
                  SuperAdmin
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-white mt-0.5">{currentStore?.name}</h2>
            <p className="text-xs text-neutral-400">{user?.email}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {isSuperAdmin && (
            <select
              value={selectedStoreId}
              onChange={(e) => setSelectedStoreId(e.target.value)}
              className="bg-neutral-900 border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-semibold"
            >
              {stores.map(s => (
                <option key={s.id} value={s.id}>🏬 {s.name}</option>
              ))}
            </select>
          )}

          <button
            onClick={() => onNavigate('store_catalog', { storeId: selectedStoreId })}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-semibold flex items-center gap-1.5 border border-white/10 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Ver Tienda en Vivo</span>
          </button>

          <button
            onClick={() => {
              logout();
              onNavigate('home');
            }}
            className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold flex items-center gap-1.5 border border-rose-500/20 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-panel border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-400">Modelos en Catálogo</span>
            <div className="text-2xl font-extrabold text-white mt-1">{allStoreProducts.length}</div>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Smartphone className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-400">Stock Total</span>
            <div className="text-2xl font-extrabold text-emerald-400 mt-1">{totalStock}</div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-400">Pedidos Totales</span>
            <div className="text-2xl font-extrabold text-amber-400 mt-1">{storeOrders.length}</div>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-400">Ingresos Totales</span>
            <div className="text-2xl font-extrabold text-blue-400 mt-1">${totalRevenue} USD</div>
          </div>
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'products' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'text-neutral-400 hover:text-white hover:bg-white/5'
          }`}
        >
          📦 Catálogo & Productos ({allStoreProducts.length})
        </button>

        <button
          onClick={() => setActiveTab('bulk_editor')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'bulk_editor' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'text-neutral-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Editor Rápido de Stock</span>
        </button>

        <button
          onClick={() => setActiveTab('store_settings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'store_settings' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'text-neutral-400 hover:text-white hover:bg-white/5'
          }`}
        >
          🏬 Personalizar Sucursal & WhatsApp
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'orders' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'text-neutral-400 hover:text-white hover:bg-white/5'
          }`}
        >
          📋 Pedidos Recibidos ({storeOrders.length})
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

      {activeTab === 'store_settings' && (
        <StoreSettingsForm
          store={currentStore}
          onSaveSuccess={() => {
            refreshData();
            loadStoreData(selectedStoreId);
          }}
        />
      )}

      {activeTab === 'orders' && (
        <OrdersTracker orders={storeOrders} />
      )}

      {/* Product Form Modal (Decomposed) */}
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
