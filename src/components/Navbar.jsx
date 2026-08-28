import React, { useState } from 'react';
import {
  Smartphone,
  ShoppingBag,
  Scale,
  Search,
  Store,
  ChevronDown,
  User,
  Shield,
  Layers,
  Zap,
  History,
  X,
  Menu
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ currentView, onNavigate }) => {
  const {
    stores,
    activeStore,
    setActiveStore,
    generationFilter,
    setGenerationFilter,
    searchQuery,
    setSearchQuery,
    comparedProducts,
    setIsCompareOpen
  } = useStore();

  const { itemCount, setIsCartOpen } = useCart();
  const { isAuthenticated, user, logout } = useAuth();

  const [isStoreMenuOpen, setIsStoreMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  const handleStoreSelect = (store) => {
    setActiveStore(store);
    setIsStoreMenuOpen(false);
    if (store) {
      onNavigate('store_catalog', { storeId: store.id });
    } else {
      onNavigate('home');
    }
  };

  const handleNavClick = (view, genCategory = null) => {
    if (genCategory) {
      setGenerationFilter(genCategory);
    }
    onNavigate(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full px-4 py-3 transition-all duration-300">
        <div className="max-w-7xl mx-auto rounded-full glass-panel border border-white/10 px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-2xl backdrop-blur-2xl">
          {/* Brand Logo */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 p-0.5 shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-white flex items-center gap-1">
                CelStore<span className="text-blue-400 text-xs font-mono">3D</span>
              </span>
              <span className="text-[9px] text-neutral-400 tracking-wider uppercase font-semibold hidden sm:inline">
                Multi-Tiendas Generacional
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-medium text-neutral-300">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3 py-1.5 rounded-full transition-all ${
                currentView === 'home' ? 'bg-white/10 text-white font-semibold' : 'hover:text-white hover:bg-white/5'
              }`}
            >
              Inicio
            </button>

            <button
              onClick={() => handleNavClick('home', 'last_2_years')}
              className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                generationFilter === 'last_2_years' ? 'bg-blue-500/20 text-blue-400 font-semibold' : 'hover:text-white hover:bg-white/5'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-blue-400" />
              <span>Últimos 2 Años</span>
            </button>

            <button
              onClick={() => handleNavClick('home', 'vintage_classic')}
              className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                generationFilter === 'vintage_classic' ? 'bg-amber-500/20 text-amber-400 font-semibold' : 'hover:text-white hover:bg-white/5'
              }`}
            >
              <History className="w-3.5 h-3.5 text-amber-400" />
              <span>Clásicos & Vintage</span>
            </button>

            <button
              onClick={() => handleNavClick('accessories')}
              className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                currentView === 'accessories' ? 'bg-cyan-500/20 text-cyan-400 font-semibold' : 'hover:text-white hover:bg-white/5'
              }`}
            >
              <span>Accesorios</span>
            </button>

            <button
              onClick={() => handleNavClick('store_selector')}
              className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                currentView === 'store_selector' ? 'bg-white/10 text-white font-semibold' : 'hover:text-white hover:bg-white/5'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Sucursales</span>
            </button>
          </nav>

          {/* Right Action Icons & Active Store Selector */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Active Store Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsStoreMenuOpen(!isStoreMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-neutral-200 transition-all"
                title="Cambiar Tienda / Sucursal"
              >
                <Store className="w-3.5 h-3.5 text-blue-400" />
                <span className="max-w-[90px] sm:max-w-[120px] truncate font-medium">
                  {activeStore ? activeStore.name : 'Todas las Tiendas'}
                </span>
                <ChevronDown className="w-3 h-3 text-neutral-400" />
              </button>

              {/* Store Dropdown Menu */}
              {isStoreMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl glass-panel border border-white/15 p-2 shadow-2xl z-50 text-xs">
                  <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-neutral-400 tracking-wider border-b border-white/10 mb-1">
                    Selecciona Sucursal
                  </div>
                  <button
                    onClick={() => handleStoreSelect(null)}
                    className={`w-full text-left px-3 py-2 rounded-xl transition-colors flex items-center justify-between ${
                      !activeStore ? 'bg-blue-600 text-white font-semibold' : 'text-neutral-300 hover:bg-white/10'
                    }`}
                  >
                    <span>🌐 Todas las Tiendas (Hub Global)</span>
                  </button>

                  {stores.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleStoreSelect(s)}
                      className={`w-full text-left px-3 py-2 rounded-xl transition-colors flex flex-col mt-1 ${
                        activeStore?.id === s.id
                          ? 'bg-blue-600 text-white font-semibold'
                          : 'text-neutral-300 hover:bg-white/10'
                      }`}
                    >
                      <span className="font-medium truncate">{s.name}</span>
                      <span className="text-[10px] opacity-75">{s.specialty}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Search Button */}
            <button
              onClick={() => setShowSearchModal(true)}
              className="p-2 rounded-full hover:bg-white/10 text-neutral-300 hover:text-white transition-colors"
              title="Buscar celular o solución"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Compare Badge Trigger */}
            {comparedProducts.length > 0 && (
              <button
                onClick={() => setIsCompareOpen(true)}
                className="relative p-2 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/40 hover:bg-blue-600/30 transition-colors"
                title="Comparar modelos seleccionados"
              >
                <Scale className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md">
                  {comparedProducts.length}
                </span>
              </button>
            )}

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 sm:px-3 sm:py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white transition-all flex items-center gap-1.5 shadow-md shadow-blue-600/25 hover:scale-105"
              title="Ver Bolsa de Compras"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline text-xs font-bold font-mono">{itemCount}</span>
              {itemCount > 0 && (
                <span className="sm:hidden absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Admin / Store Manager Portal Link */}
            {isAuthenticated ? (
              <button
                onClick={() => handleNavClick('admin_dashboard')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/30 transition-all"
                title="Panel de Administración"
              >
                <Shield className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Panel Admin</span>
              </button>
            ) : (
              <button
                onClick={() => handleNavClick('admin_login')}
                className="p-2 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                title="Login Dueños de Tienda"
              >
                <User className="w-4 h-4" />
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-full hover:bg-white/10 text-neutral-300 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-2 max-w-7xl mx-auto rounded-3xl glass-panel border border-white/15 p-4 shadow-2xl space-y-2 text-sm text-neutral-200">
            <button
              onClick={() => handleNavClick('home')}
              className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-white/10 transition-colors"
            >
              🏠 Inicio
            </button>
            <button
              onClick={() => handleNavClick('home', 'last_2_years')}
              className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-blue-400 font-semibold"
            >
              🚀 Últimos 2 Años (2024 - 2026)
            </button>
            <button
              onClick={() => handleNavClick('home', 'vintage_classic')}
              className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-amber-400 font-semibold"
            >
              📟 Clásicos & Vintage Legends
            </button>
            <button
              onClick={() => handleNavClick('accessories')}
              className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-cyan-400"
            >
              ⚡ Mini-Tienda de Accesorios
            </button>
            <button
              onClick={() => handleNavClick('store_selector')}
              className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-white/10 transition-colors"
            >
              🏬 Directorio de Sucursales
            </button>
            <button
              onClick={() => handleNavClick(isAuthenticated ? 'admin_dashboard' : 'admin_login')}
              className="w-full text-left px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-emerald-400 font-semibold"
            >
              🔒 {isAuthenticated ? 'Mi Panel de Tienda' : 'Acceso Administrador de Tienda'}
            </button>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          <div
            onClick={() => setShowSearchModal(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />
          <div className="relative w-full max-w-xl bg-neutral-950 border border-white/20 rounded-3xl p-5 shadow-2xl text-white z-10">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-neutral-400 text-xs font-semibold uppercase">
                <Search className="w-4 h-4 text-blue-400" />
                <span>Búsqueda Inteligente de Celulares & Soluciones</span>
              </div>
              <button
                onClick={() => setShowSearchModal(false)}
                className="p-1 text-neutral-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4">
              <input
                type="text"
                autoFocus
                placeholder="Ej. iPhone 16, Nokia Snake, Batería 2 días, Cámara 4K..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-900 border border-white/15 rounded-2xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="text-neutral-500 text-[11px] self-center">Populares:</span>
              <button
                onClick={() => { setSearchQuery('iPhone 16'); setShowSearchModal(false); }}
                className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-blue-600 text-neutral-300 hover:text-white transition-colors"
              >
                iPhone 16 Pro Max
              </button>
              <button
                onClick={() => { setSearchQuery('Nokia'); setShowSearchModal(false); }}
                className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-amber-600 text-neutral-300 hover:text-white transition-colors"
              >
                Nokia 3310
              </button>
              <button
                onClick={() => { setSearchQuery('RAZR'); setShowSearchModal(false); }}
                className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-pink-600 text-neutral-300 hover:text-white transition-colors"
              >
                Motorola RAZR V3
              </button>
              <button
                onClick={() => { setSearchQuery('MagSafe'); setShowSearchModal(false); }}
                className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-cyan-600 text-neutral-300 hover:text-white transition-colors"
              >
                Cargador MagSafe
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
