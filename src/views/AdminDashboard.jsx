import React, { useState, useEffect } from 'react';
import {
  Store,
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  Zap,
  History,
  ShieldCheck,
  ShoppingBag,
  Eye,
  Check,
  X,
  LogOut,
  Save,
  Search,
  Layers,
  ArrowRight,
  TrendingUp,
  Package,
  DollarSign,
  Smartphone,
  Palette
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { api } from '../services/api';

export const AdminDashboard = ({ onNavigate }) => {
  const { user, logout, isSuperAdmin } = useAuth();
  const { stores, products, refreshData } = useStore();

  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'store_settings' | 'orders'
  const [selectedStoreId, setSelectedStoreId] = useState(user?.storeId || stores[0]?.id);
  const [storeOrders, setStoreOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State for Adding/Editing Product
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isGeneratingSolutions, setIsGeneratingSolutions] = useState(false);

  // Current managed store object
  const currentStore = stores.find(s => s.id === selectedStoreId) || stores[0];

  // Store editable form state
  const [storeForm, setStoreForm] = useState({
    name: '',
    tagLine: '',
    description: '',
    phoneWhatsApp: '',
    banner: ''
  });

  // Product Form State
  const initialProductState = {
    name: '',
    brand: 'Apple',
    type: 'phone',
    modelYear: 2025,
    generationCategory: 'last_2_years',
    price: 999,
    originalPrice: 1099,
    stock: 10,
    condition: 'Nuevo Sellado con Garantía 1 Año',
    tagline: '',
    model3dType: 'modern_flagship',
    images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800'],
    colors: [
      { name: 'Titanio Natural', hex: '#9e9689', threeHex: '#8e867b' },
      { name: 'Negro Espacial', hex: '#2c2c2e', threeHex: '#1c1c1e' }
    ],
    storageOptions: ['256 GB', '512 GB'],
    specs: {
      screen: 'OLED 120Hz',
      processor: 'Procesador de Alta Eficiencia',
      battery: '5000 mAh',
      camera: 'Triple Lente 48MP',
      os: 'Sistema Actualizado'
    },
    solutions: []
  };

  const [productForm, setProductForm] = useState(initialProductState);

  useEffect(() => {
    if (currentStore) {
      setStoreForm({
        name: currentStore.name || '',
        tagLine: currentStore.tagLine || '',
        description: currentStore.description || '',
        phoneWhatsApp: currentStore.phoneWhatsApp || '',
        banner: currentStore.banner || ''
      });
      loadOrders(currentStore.id);
    }
  }, [currentStore]);

  const loadOrders = async (sId) => {
    try {
      const orders = await api.getOrders(sId);
      setStoreOrders(orders);
    } catch (err) {
      console.error('Error loading orders:', err);
    }
  };

  // Filter products belonging ONLY to this store
  const storeProducts = products.filter(p => p.storeId === selectedStoreId);
  const filteredProducts = storeProducts.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.brand && p.brand.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Open modal for new product
  const handleOpenNewProduct = () => {
    setEditingProduct(null);
    setProductForm({
      ...initialProductState,
      storeId: selectedStoreId
    });
    setIsProductModalOpen(true);
  };

  // Open modal for editing product
  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      ...prod,
      colors: prod.colors || initialProductState.colors,
      storageOptions: prod.storageOptions || ['256 GB'],
      specs: prod.specs || initialProductState.specs,
      solutions: prod.solutions || []
    });
    setIsProductModalOpen(true);
  };

  // Smart Solution Generator (Apple-Style copy assistant)
  const handleGenerateSolutions = async () => {
    setIsGeneratingSolutions(true);
    try {
      const res = await api.generateSolutions({
        name: productForm.name,
        brand: productForm.brand,
        modelYear: productForm.modelYear,
        generationCategory: productForm.generationCategory,
        type: productForm.type
      });

      if (res.solutions && res.solutions.length > 0) {
        setProductForm(prev => ({
          ...prev,
          solutions: res.solutions
        }));
      }
    } catch (err) {
      console.error('Error generating solutions:', err);
    } finally {
      setIsGeneratingSolutions(false);
    }
  };

  // Save Product (Create or Update)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, {
          ...productForm,
          storeId: selectedStoreId
        });
      } else {
        await api.createProduct({
          ...productForm,
          storeId: selectedStoreId
        });
      }
      setIsProductModalOpen(false);
      await refreshData();
    } catch (err) {
      console.error('Error saving product:', err);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (prodId) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto del inventario de tu tienda?')) return;
    try {
      await api.deleteProduct(prodId);
      await refreshData();
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  // Save Store Settings
  const handleSaveStoreSettings = async (e) => {
    e.preventDefault();
    try {
      await api.updateStore(selectedStoreId, storeForm);
      await refreshData();
      alert('¡Configuración de la tienda actualizada con éxito!');
    } catch (err) {
      console.error('Error updating store:', err);
    }
  };

  // Calculate quick metrics
  const totalStock = storeProducts.reduce((acc, p) => acc + (p.stock || 0), 0);
  const totalOrdersAmount = storeOrders.reduce((acc, o) => acc + (o.total || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Admin Navigation & Profile Bar */}
      <div className="p-6 rounded-3xl glass-panel border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <img
            src={currentStore?.logo || 'https://images.unsplash.com/photo-1616469829941-c7200edec809?w=150'}
            alt="Store Logo"
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

        {/* SuperAdmin Store Switcher or Action Buttons */}
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

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-panel border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-400">Modelos en Catálogo</span>
            <div className="text-2xl font-extrabold text-white mt-1">{storeProducts.length}</div>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Smartphone className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-400">Unidades en Stock</span>
            <div className="text-2xl font-extrabold text-emerald-400 mt-1">{totalStock}</div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-400">Pedidos Registrados</span>
            <div className="text-2xl font-extrabold text-amber-400 mt-1">{storeOrders.length}</div>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-400">Ventas Totales</span>
            <div className="text-2xl font-extrabold text-blue-400 mt-1">${totalOrdersAmount} USD</div>
          </div>
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'products'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-neutral-400 hover:text-white hover:bg-white/5'
          }`}
        >
          📦 Catálogo & Productos ({storeProducts.length})
        </button>

        <button
          onClick={() => setActiveTab('store_settings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'store_settings'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-neutral-400 hover:text-white hover:bg-white/5'
          }`}
        >
          🏬 Personalizar Sucursal & WhatsApp
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'orders'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-neutral-400 hover:text-white hover:bg-white/5'
          }`}
        >
          📋 Pedidos Recibidos ({storeOrders.length})
        </button>
      </div>

      {/* TAB 1: PRODUCT CATALOG MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por nombre o marca..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-neutral-900 border border-white/10 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              onClick={handleOpenNewProduct}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Cargar Nuevo Producto (Nuevo o Vintage)</span>
            </button>
          </div>

          {/* Products Table */}
          <div className="rounded-2xl glass-panel border border-white/10 overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-300">
              <thead className="bg-white/5 text-[11px] uppercase tracking-wider text-neutral-400 border-b border-white/10 font-bold">
                <tr>
                  <th className="p-4">Producto</th>
                  <th className="p-4">Generación / Época</th>
                  <th className="p-4">Modelo 3D</th>
                  <th className="p-4">Precio</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-neutral-500">
                      No hay productos registrados en esta tienda. Haz clic en "Cargar Nuevo Producto".
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images?.[0]}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-contain bg-neutral-900 p-1 shrink-0"
                          />
                          <div>
                            <span className="font-bold text-white block">{p.name}</span>
                            <span className="text-[11px] text-neutral-400">{p.brand}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        {p.generationCategory === 'last_2_years' ? (
                          <span className="badge-last-2-years px-2 py-0.5 rounded-full text-[10px] font-bold">
                            🚀 Últimos 2 Años • {p.modelYear}
                          </span>
                        ) : p.generationCategory === 'vintage_classic' ? (
                          <span className="badge-vintage px-2 py-0.5 rounded-full text-[10px] font-bold">
                            📟 Vintage Legend • {p.modelYear}
                          </span>
                        ) : (
                          <span className="badge-recent px-2 py-0.5 rounded-full text-[10px] font-bold">
                            ⏳ Reciente • {p.modelYear}
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="text-[11px] font-mono text-neutral-400 bg-white/5 px-2 py-1 rounded-lg">
                          {p.model3dType === 'vintage_bar' ? 'Nokia Barra 3D' : p.model3dType === 'vintage_flip' ? 'RAZR Flip 3D' : 'Flagship Titanio 3D'}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-white">${p.price} USD</td>
                      <td className="p-4">
                        <span className={`font-semibold ${p.stock < 5 ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {p.stock} un.
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditProduct(p)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-blue-600 text-neutral-300 hover:text-white transition-colors"
                          title="Editar producto y textos de solución"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-600 text-neutral-300 hover:text-white transition-colors"
                          title="Eliminar producto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: STORE SETTINGS CUSTOMIZER */}
      {activeTab === 'store_settings' && (
        <form onSubmit={handleSaveStoreSettings} className="p-6 rounded-3xl glass-panel border border-white/10 space-y-5 max-w-2xl">
          <h3 className="text-base font-bold text-white">Configuración de Sucursal</h3>
          
          <div>
            <label className="text-xs text-neutral-400 font-semibold block mb-1">Nombre de la Tienda</label>
            <input
              type="text"
              value={storeForm.name}
              onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-xs text-neutral-400 font-semibold block mb-1">Lema / Tagline</label>
            <input
              type="text"
              value={storeForm.tagLine}
              onChange={(e) => setStoreForm({ ...storeForm, tagLine: e.target.value })}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-xs text-neutral-400 font-semibold block mb-1">Descripción de Especialidad</label>
            <textarea
              rows="3"
              value={storeForm.description}
              onChange={(e) => setStoreForm({ ...storeForm, description: e.target.value })}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-xs text-neutral-400 font-semibold block mb-1">WhatsApp de Contacto Oficial</label>
            <input
              type="text"
              value={storeForm.phoneWhatsApp}
              onChange={(e) => setStoreForm({ ...storeForm, phoneWhatsApp: e.target.value })}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              placeholder="+5491145239900"
            />
          </div>

          <div>
            <label className="text-xs text-neutral-400 font-semibold block mb-1">URL de Imagen de Banner</label>
            <input
              type="text"
              value={storeForm.banner}
              onChange={(e) => setStoreForm({ ...storeForm, banner: e.target.value })}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Cambios de Tienda</span>
          </button>
        </form>
      )}

      {/* TAB 3: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="rounded-2xl glass-panel border border-white/10 overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-white/5 text-[11px] uppercase tracking-wider text-neutral-400 border-b border-white/10 font-bold">
              <tr>
                <th className="p-4">Orden ID</th>
                <th className="p-4">Cliente</th>
                <th className="p-4">Artículos</th>
                <th className="p-4">Método de Pago</th>
                <th className="p-4">Total</th>
                <th className="p-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {storeOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-neutral-500">
                    Aún no se han recibido órdenes para esta tienda.
                  </td>
                </tr>
              ) : (
                storeOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-white/[0.02]">
                    <td className="p-4 font-mono font-bold text-blue-400">{o.id}</td>
                    <td className="p-4">
                      <span className="font-semibold text-white block">{o.customer?.name}</span>
                      <span className="text-[11px] text-neutral-500">{o.customer?.phone}</span>
                    </td>
                    <td className="p-4">
                      {o.items?.map((item, idx) => (
                        <div key={idx} className="text-neutral-300">
                          {item.quantity}x {item.name}
                        </div>
                      ))}
                    </td>
                    <td className="p-4 font-medium text-emerald-400">{o.paymentMethod}</td>
                    <td className="p-4 font-extrabold text-white">${o.total} USD</td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {o.status || 'Confirmado'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* PRODUCT CREATION / EDIT MODAL WITH SMART SOLUTIONS GENERATOR */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            onClick={() => setIsProductModalOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          <div className="relative w-full max-w-3xl bg-neutral-950 border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl text-white z-10 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-xl font-bold">
                {editingProduct ? 'Editar Producto & Soluciones' : 'Cargar Nuevo Producto (Nuevo o Vintage)'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-5">
              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-neutral-400 font-semibold block mb-1">Nombre del Modelo</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. iPhone 16 Pro Max / Nokia 3310"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-neutral-400 font-semibold block mb-1">Marca</label>
                  <input
                    type="text"
                    required
                    placeholder="Apple, Samsung, Nokia, Motorola..."
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-neutral-400 font-semibold block mb-1">Año de Lanzamiento</label>
                  <input
                    type="number"
                    required
                    value={productForm.modelYear}
                    onChange={(e) => setProductForm({ ...productForm, modelYear: parseInt(e.target.value) || 2025 })}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-neutral-400 font-semibold block mb-1">Segmentación Generacional</label>
                  <select
                    value={productForm.generationCategory}
                    onChange={(e) => setProductForm({ ...productForm, generationCategory: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="last_2_years">🚀 Últimos 2 Años (2024 - 2026)</option>
                    <option value="recent_gen">⏳ Generaciones Recientes (2020 - 2023)</option>
                    <option value="vintage_classic">📟 Clásicos & Vintage Legends</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-neutral-400 font-semibold block mb-1">Precio de Venta ($ USD)</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-neutral-400 font-semibold block mb-1">Stock Disponible</label>
                  <input
                    type="number"
                    required
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: parseInt(e.target.value) || 0 })}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-neutral-400 font-semibold block mb-1">Plantilla de Render 3D</label>
                  <select
                    value={productForm.model3dType}
                    onChange={(e) => setProductForm({ ...productForm, model3dType: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="modern_flagship">Smartphone Moderno (Titanio / Pantalla OLED / Triple Lente)</option>
                    <option value="vintage_bar">Nokia / Teléfono Barra Clásico (Teclado / LCD Retro)</option>
                    <option value="vintage_flip">Motorola RAZR / Clamshell con Tapa Abatible</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-neutral-400 font-semibold block mb-1">Condición</label>
                  <input
                    type="text"
                    value={productForm.condition}
                    onChange={(e) => setProductForm({ ...productForm, condition: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    placeholder="Nuevo Sellado / Restaurado Coleccionista"
                  />
                </div>
              </div>

              {/* SMART SOLUTIONS SECTION (APPLE-STYLE COPY ASSISTANT) */}
              <div className="p-5 rounded-2xl bg-blue-950/30 border border-blue-500/20 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Textos de Storytelling: "¿Qué soluciona para ti?"
                    </h4>
                    <p className="text-[11px] text-neutral-400">
                      Enfocado en soluciones de vida (creadores, batería, detox digital, resistencia).
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleGenerateSolutions}
                    disabled={isGeneratingSolutions}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/25 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isGeneratingSolutions ? 'Generando...' : 'Generar Automático'}</span>
                  </button>
                </div>

                {/* Solutions List */}
                <div className="space-y-3">
                  {productForm.solutions && productForm.solutions.length > 0 ? (
                    productForm.solutions.map((sol, sIdx) => (
                      <div key={sIdx} className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Etiqueta (Ej. Creadores, Batería)"
                            value={sol.badge}
                            onChange={(e) => {
                              const newSol = [...productForm.solutions];
                              newSol[sIdx].badge = e.target.value;
                              setProductForm({ ...productForm, solutions: newSol });
                            }}
                            className="w-1/3 bg-neutral-900 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-blue-300 font-bold"
                          />
                          <input
                            type="text"
                            placeholder="Título de la Solución"
                            value={sol.title}
                            onChange={(e) => {
                              const newSol = [...productForm.solutions];
                              newSol[sIdx].title = e.target.value;
                              setProductForm({ ...productForm, solutions: newSol });
                            }}
                            className="w-2/3 bg-neutral-900 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white font-semibold"
                          />
                        </div>
                        <textarea
                          rows="2"
                          placeholder="Descripción de la solución que aporta..."
                          value={sol.description}
                          onChange={(e) => {
                            const newSol = [...productForm.solutions];
                            newSol[sIdx].description = e.target.value;
                            setProductForm({ ...productForm, solutions: newSol });
                          }}
                          className="w-full bg-neutral-900 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-neutral-300"
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-neutral-500 italic">
                      Haz clic en "Generar Automático" para que el asistente de redacción cree los argumentos de venta por ti.
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-neutral-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all"
                >
                  {editingProduct ? 'Guardar Cambios' : 'Publicar Producto en Tienda'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
