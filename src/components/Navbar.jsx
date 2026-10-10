'use client';

import React, { useState } from 'react';
import {
  ShoppingBag,
  Scale,
  Search,
  Store,
  ChevronDown,
  Shield,
  X,
  Menu,
  Sun,
  Moon,
  Compass,
  Star,
  Tag,
  Truck,
  Terminal,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTrackingStore } from '../store/useTrackingStore';
import { playSubtleClick } from '../utils/audioHaptics';

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
  const { isAuthenticated } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const { openTracking } = useTrackingStore();

  const [isStoreMenuOpen, setIsStoreMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  const handleStoreSelect = (store) => {
    playSubtleClick();
    setActiveStore(store);
    setIsStoreMenuOpen(false);
    if (store) {
      onNavigate('store_catalog', { storeId: store.id });
    } else {
      onNavigate('home');
    }
  };

  const scrollToCatalog = () => {
    if (typeof window !== 'undefined') {
      const elem = document.getElementById('catalog');
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 680, behavior: 'smooth' });
      }
    }
  };

  const handleLogoClick = () => {
    playSubtleClick();
    setGenerationFilter('all');
    if (typeof window !== 'undefined' && window.location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onNavigate('home');
    }
    setIsMobileMenuOpen(false);
  };

  const handleNavClick = (view, genCategory = null) => {
    playSubtleClick();
    if (genCategory) {
      setGenerationFilter(genCategory);
    } else if (view === 'home') {
      setGenerationFilter('all');
    }

    if (view === 'home') {
      if (typeof window !== 'undefined' && window.location.pathname === '/') {
        scrollToCatalog();
      } else {
        onNavigate('home');
        setTimeout(() => scrollToCatalog(), 200);
      }
    } else {
      onNavigate(view);
    }
    setIsMobileMenuOpen(false);
  };

  const handleSearchSubmit = () => {
    setShowSearchModal(false);
    if (typeof window !== 'undefined') {
      if (window.location.pathname !== '/') {
        onNavigate('home');
      }
      setTimeout(() => {
        scrollToCatalog();
      }, 150);
    }
  };

  return (
    <>
      {/* Top Clean Announcement Strip */}
      <div className="w-full bg-[#F5F5F7] dark:bg-[#111113] border-b border-black/5 dark:border-white/5 px-4 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 flex items-center justify-between transition-colors">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>10% OFF con cupón <strong className="text-blue-600 dark:text-blue-400 font-bold">TITANIO10</strong></span>
            <span className="hidden sm:inline text-zinc-400">• Envío asegurado a todo el país</span>
            <span className="hidden md:inline text-zinc-400">• Garantía oficial 24 meses</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-xs font-semibold">
            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Stock Verificado en Vivo
            </span>
          </div>
        </div>
      </div>

      {/* Apple Floating Glass Navbar */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/85 dark:bg-black/85 border-b border-black/5 dark:border-white/10 transition-colors select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <div
            onClick={handleLogoClick}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
              C/
            </div>
            <div className="flex flex-col">
              <span
                className="font-bold tracking-tight text-lg text-black dark:text-white"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                CelStore
              </span>
            </div>
          </div>

          {/* Clean Horizontal Links with High Contrast & Clear Active Indicators */}
          <nav className="hidden lg:flex items-center gap-1.5 text-sm font-semibold">
            <button
              type="button"
              onClick={() => handleNavClick('home')}
              className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                currentView === 'home' && generationFilter === 'all'
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              Catálogo
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('home', 'last_2_years')}
              className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                currentView === 'home' && generationFilter === 'last_2_years'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              Flagships
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('home', 'vintage_classic')}
              className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                currentView === 'home' && generationFilter === 'vintage_classic'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              Vintage Clásicos
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('accessories')}
              className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                currentView === 'accessories'
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              Accesorios
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('store_selector')}
              className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                currentView === 'store_selector'
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              Boutiques
            </button>
          </nav>

          {/* Right Action Rack */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Search Key */}
            <button
              type="button"
              onClick={() => {
                playSubtleClick();
                setShowSearchModal(true);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-300 text-xs sm:text-sm font-medium transition-all cursor-pointer"
              title="Buscar en inventario"
            >
              <Search className="w-3.5 h-3.5 text-zinc-500" />
              <span className="hidden sm:inline">Buscar</span>
              <span className="hidden sm:inline text-xs text-zinc-400 font-mono">⌘K</span>
            </button>

            {/* Comparer Tool */}
            {comparedProducts.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  playSubtleClick();
                  setIsCompareOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-xs font-semibold cursor-pointer"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>{comparedProducts.length}</span>
              </button>
            )}

            {/* Boutique Dropdown Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  playSubtleClick();
                  setIsStoreMenuOpen(!isStoreMenuOpen);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-zinc-700 dark:text-zinc-200 text-xs sm:text-sm font-medium transition-all cursor-pointer max-w-[140px] sm:max-w-[180px]"
              >
                <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                <span className="truncate">{activeStore?.name || 'Todas'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              </button>

              {isStoreMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#161618] border border-black/10 dark:border-white/15 shadow-2xl rounded-2xl p-2 z-50 overflow-hidden">
                  <div className="px-3 py-2 border-b border-black/5 dark:border-white/10 text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400 font-bold flex items-center justify-between">
                    <span>Boutiques Oficiales</span>
                    <Store className="w-3.5 h-3.5" />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleStoreSelect(null)}
                    className={`w-full text-left px-3 py-2 text-xs font-medium rounded-xl transition-all cursor-pointer mt-1 ${
                      !activeStore
                        ? 'bg-blue-600 text-white font-bold'
                        : 'text-zinc-700 dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/10'
                    }`}
                  >
                    Todas las Boutiques (Catálogo Global)
                  </button>
                  {stores.map((s) => (
                    <button
                      type="button"
                      key={s.id}
                      onClick={() => handleStoreSelect(s)}
                      className={`w-full text-left px-3 py-2 text-xs font-medium rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                        activeStore?.id === s.id
                          ? 'bg-blue-600 text-white font-bold'
                          : 'text-zinc-700 dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/10'
                      }`}
                    >
                      <span className="truncate">{s.name}</span>
                      <span className="text-xs text-zinc-400 shrink-0 flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        {s.rating}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Live Order Tracker Trigger */}
            <button
              type="button"
              onClick={() => {
                playSubtleClick();
                openTracking();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-zinc-700 dark:text-zinc-200 text-xs sm:text-sm font-medium transition-all cursor-pointer"
              title="Rastrear pedido en vivo"
            >
              <Compass className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="hidden sm:inline">Rastreo</span>
            </button>

            {/* Theme Switcher */}
            <button
              type="button"
              onClick={() => {
                playSubtleClick();
                toggleTheme();
              }}
              className="p-2 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-zinc-700 dark:text-zinc-200 cursor-pointer transition-colors"
              title={isDark ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-600" />}
            </button>

            {/* Cart Trigger Button */}
            <button
              type="button"
              onClick={() => {
                playSubtleClick();
                setIsCartOpen(true);
              }}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm cursor-pointer active:scale-95 transition-all shadow-sm"
              title="Carrito de compras"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Carrito</span>
              <span className="px-1.5 py-0.5 rounded-full bg-white text-blue-600 text-xs font-bold tabular-nums">
                {itemCount}
              </span>
            </button>

            {/* Mobile Menu */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-black/5 dark:bg-white/5 text-zinc-700 dark:text-zinc-200 cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-black/5 dark:border-white/10 p-4 space-y-2 bg-white dark:bg-black text-sm font-medium">
            <button
              type="button"
              onClick={() => handleNavClick('home')}
              className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-black dark:text-white"
            >
              Catálogo Completo
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('home', 'last_2_years')}
              className="w-full text-left px-4 py-2.5 rounded-xl text-blue-600 font-semibold"
            >
              Flagships 2026
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('home', 'vintage_classic')}
              className="w-full text-left px-4 py-2.5 rounded-xl text-zinc-600 dark:text-zinc-400"
            >
              Vintage Clásicos
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('accessories')}
              className="w-full text-left px-4 py-2.5 rounded-xl text-zinc-600 dark:text-zinc-400"
            >
              Accesorios
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('store_selector')}
              className="w-full text-left px-4 py-2.5 rounded-xl text-zinc-600 dark:text-zinc-400"
            >
              Boutiques
            </button>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-black/5 dark:border-white/10">
              <button
                type="button"
                onClick={() => {
                  playSubtleClick();
                  openTracking();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-center px-3 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold flex items-center justify-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>Rastreo</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  playSubtleClick();
                  toggleTheme();
                }}
                className="w-full text-center px-3 py-2.5 rounded-xl bg-black/5 dark:bg-white/10 font-semibold flex items-center justify-center gap-2"
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-600" />}
                <span>{isDark ? 'Modo Claro' : 'Modo Oscuro'}</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/70 backdrop-blur-md">
          <div
            onClick={() => setShowSearchModal(false)}
            className="fixed inset-0"
          />
          <div className="relative w-full max-w-xl bg-white dark:bg-[#161618] border border-black/10 dark:border-white/15 p-6 shadow-2xl z-10 rounded-2xl space-y-4">
            <div className="flex items-center justify-between text-xs text-zinc-500 border-b border-black/5 dark:border-white/10 pb-3">
              <span className="text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-2">
                <Search className="w-4 h-4" /> Búsqueda en Catálogo CelStore
              </span>
              <span>ESC para cerrar</span>
            </div>
            <div className="flex items-center gap-3 bg-black/5 dark:bg-white/5 p-3.5 rounded-xl">
              <Search className="w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Buscar por modelo, marca o procesador (ej. iPhone 16, S24, A18)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearchSubmit();
                }}
                autoFocus
                className="w-full bg-transparent text-black dark:text-white placeholder-zinc-400 text-sm focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowSearchModal(false)}
                className="px-2.5 py-1 rounded-lg bg-black/10 dark:bg-white/10 text-xs font-medium cursor-pointer"
              >
                Cerrar
              </button>
            </div>
            <div className="text-xs text-zinc-500 flex justify-between">
              <span>Presioná Enter para buscar</span>
              <button
                type="button"
                onClick={handleSearchSubmit}
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
              >
                Ver todos los resultados →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
