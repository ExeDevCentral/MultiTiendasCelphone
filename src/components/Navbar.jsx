'use client';

import React, { useState } from 'react';
import {
  ShoppingBag,
  Scale,
  Search,
  Store,
  ChevronDown,
  Shield,
  History,
  X,
  Menu
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
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
  const { isAuthenticated, user, logout } = useAuth();

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

  const handleNavClick = (view, genCategory = null) => {
    playSubtleClick();
    if (genCategory) {
      setGenerationFilter(genCategory);
    }
    onNavigate(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full px-6 sm:px-10 lg:px-12 py-4 bg-[#0a0a0c]/85 backdrop-blur-md border-b border-[rgba(243,239,230,0.08)] transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand Logo Wordmark (Cormorant Garamond Italic 22px) */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <span className="wordmark text-[22px] sm:text-[24px] text-[#f3efe6] tracking-[0.02em] hover:text-[#e4c972] transition-colors">
              CelStore
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-[13px] tracking-[0.04em] text-[#8b8680]">
            <button
              type="button"
              onClick={() => handleNavClick('home')}
              className={`transition-colors cursor-pointer ${
                currentView === 'home' && generationFilter === 'all'
                  ? 'text-[#f3efe6] font-medium'
                  : 'hover:text-[#f3efe6]'
              }`}
            >
              Colección
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('home', 'last_2_years')}
              className={`transition-colors cursor-pointer ${
                generationFilter === 'last_2_years'
                  ? 'text-[#e4c972] font-medium'
                  : 'hover:text-[#f3efe6]'
              }`}
            >
              Flagships 2024-2026
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('home', 'vintage_classic')}
              className={`transition-colors cursor-pointer ${
                generationFilter === 'vintage_classic'
                  ? 'text-[#e4c972] font-medium'
                  : 'hover:text-[#f3efe6]'
              }`}
            >
              Vintage Archive
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('accessories')}
              className={`transition-colors cursor-pointer ${
                currentView === 'accessories'
                  ? 'text-[#f3efe6] font-medium'
                  : 'hover:text-[#f3efe6]'
              }`}
            >
              Accesorios
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('store_selector')}
              className={`transition-colors cursor-pointer ${
                currentView === 'store_selector'
                  ? 'text-[#f3efe6] font-medium'
                  : 'hover:text-[#f3efe6]'
              }`}
            >
              Boutiques
            </button>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            {/* Search Trigger */}
            <button
              type="button"
              onClick={() => {
                playSubtleClick();
                setShowSearchModal(true);
              }}
              className="p-2 text-[#8b8680] hover:text-[#f3efe6] transition-colors cursor-pointer"
              title="Buscar en catálogo"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Comparador de Modelos */}
            {comparedProducts.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  playSubtleClick();
                  setIsCompareOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#c9a227] text-[#e4c972] bg-[rgba(201,162,39,0.08)] text-[11px] font-medium transition-all hover:bg-[rgba(201,162,39,0.15)] cursor-pointer"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>{comparedProducts.length}</span>
              </button>
            )}

            {/* Selector de Sucursal Activa */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  playSubtleClick();
                  setIsStoreMenuOpen(!isStoreMenuOpen);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[rgba(243,239,230,0.16)] text-[#8b8680] hover:text-[#f3efe6] text-[11px] transition-all cursor-pointer max-w-[130px] sm:max-w-[170px]"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#c9a227] shrink-0" />
                <span className="truncate">{activeStore?.name || 'Todas las Tiendas'}</span>
                <ChevronDown className="w-3 h-3 shrink-0 text-[#8b8680]" />
              </button>

              {isStoreMenuOpen && (
                <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-[#131316] border border-[rgba(243,239,230,0.16)] shadow-2xl p-2 z-50 backdrop-blur-2xl">
                  <div className="px-3 py-2 border-b border-[rgba(243,239,230,0.08)] text-[9px] tracking-[0.25em] uppercase text-[#e4c972]">
                    Seleccionar Sucursal
                  </div>
                  <button
                    type="button"
                    onClick={() => handleStoreSelect(null)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                      !activeStore ? 'bg-[rgba(243,239,230,0.08)] text-[#f3efe6]' : 'text-[#8b8680] hover:text-[#f3efe6]'
                    }`}
                  >
                    Todas las Boutiques (Catálogo Global)
                  </button>
                  {stores.map((s) => (
                    <button
                      type="button"
                      key={s.id}
                      onClick={() => handleStoreSelect(s)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer ${
                        activeStore?.id === s.id
                          ? 'bg-[rgba(201,162,39,0.15)] text-[#e4c972]'
                          : 'text-[#8b8680] hover:text-[#f3efe6]'
                      }`}
                    >
                      <span className="truncate">{s.name}</span>
                      <span className="text-[10px] text-[#c9a227]">★ {s.rating}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Bolsa de Compras (Cart) */}
            <button
              type="button"
              onClick={() => {
                playSubtleClick();
                setIsCartOpen(true);
              }}
              className="relative p-2.5 rounded-xl border border-[rgba(243,239,230,0.16)] hover:border-[#c9a227] text-[#f3efe6] hover:text-[#e4c972] transition-colors cursor-pointer"
              title="Bolsa de compras"
            >
              <ShoppingBag className="w-4 h-4" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#c9a227] text-[#0a0a0c] text-[10px] font-bold flex items-center justify-center shadow-md">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Acceso Admin */}
            <button
              type="button"
              onClick={() => {
                playSubtleClick();
                if (isAuthenticated) {
                  onNavigate('admin_dashboard');
                } else {
                  onNavigate('admin_login');
                }
              }}
              className="hidden sm:flex p-2 text-[#8b8680] hover:text-[#f3efe6] transition-colors cursor-pointer"
              title={isAuthenticated ? 'Panel de Administración' : 'Ingreso Admin'}
            >
              <Shield className="w-4 h-4" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-[#8b8680] hover:text-[#f3efe6]"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-[#f3efe6]" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-3 max-w-[1180px] mx-auto rounded-2xl bg-[#131316] border border-[rgba(243,239,230,0.16)] p-5 space-y-2">
            <button
              type="button"
              onClick={() => handleNavClick('home')}
              className="w-full text-left px-4 py-3 rounded-xl text-xs text-[#8b8680] hover:text-[#f3efe6]"
            >
              Colección Principal
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('home', 'last_2_years')}
              className="w-full text-left px-4 py-3 rounded-xl text-xs text-[#8b8680] hover:text-[#f3efe6]"
            >
              Flagships (2024 - 2026)
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('home', 'vintage_classic')}
              className="w-full text-left px-4 py-3 rounded-xl text-xs text-[#8b8680] hover:text-[#f3efe6]"
            >
              Vintage Archive Legends
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('accessories')}
              className="w-full text-left px-4 py-3 rounded-xl text-xs text-[#8b8680] hover:text-[#f3efe6]"
            >
              Accesorios Exclusivos
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('store_selector')}
              className="w-full text-left px-4 py-3 rounded-xl text-xs text-[#8b8680] hover:text-[#f3efe6]"
            >
              Boutiques CelStore™
            </button>
          </div>
        )}
      </header>

      {/* Modal de Búsqueda */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/85 backdrop-blur-xl">
          <div
            onClick={() => setShowSearchModal(false)}
            className="fixed inset-0"
          />
          <div className="relative w-full max-w-2xl bg-[#131316] border border-[rgba(243,239,230,0.16)] rounded-3xl p-6 shadow-2xl z-10 space-y-4">
            <div className="flex items-center gap-3 border-b border-[rgba(243,239,230,0.08)] pb-4">
              <Search className="w-5 h-5 text-[#c9a227]" />
              <input
                type="text"
                placeholder="Buscar por modelo, marca (Apple, Samsung, Nokia) o año..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-transparent text-[#f3efe6] placeholder-[#8b8680] text-sm focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowSearchModal(false)}
                className="p-1.5 text-[#8b8680] hover:text-[#f3efe6] cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="flex items-center justify-between text-[10px] tracking-widest uppercase text-[#8b8680]">
              <span>Presiona Esc para salir</span>
              <span>Resultados en tiempo real</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
