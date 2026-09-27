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
  Terminal
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
  const { isAuthenticated } = useAuth();

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
      <header className="sticky top-0 z-40 w-full bg-[#0E0E10] border-b border-[#1A1A1D] px-3 sm:px-6 lg:px-8 py-2.5 transition-all select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          {/* Hardware Identifier & Logo */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-7 h-7 bg-[#141416] border border-[#1A1A1D] flex items-center justify-center font-mono font-bold text-xs text-[#0066FF] group-hover:border-[#0066FF] transition-colors">
              C/
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold tracking-tight text-sm text-[#F5F5F7]">
                  CELSTORE
                </span>
                <span className="text-[10px] font-mono px-1 py-0.2 bg-[#141416] border border-[#1A1A1D] text-[#0066FF] font-bold">
                  PRECISION
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[9px] font-mono text-[#71717A]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF] animate-pulse" />
                <span>MODO PRUEBA // 0 QUOTA</span>
              </div>
            </div>
          </div>

          {/* Stepped Switch Navigation */}
          <nav className="hidden lg:flex items-center bg-[#141416] border border-[#1A1A1D] p-1 font-mono text-[11px] font-bold">
            <button
              type="button"
              onClick={() => handleNavClick('home')}
              className={`px-3 py-1 transition-all cursor-pointer ${
                currentView === 'home' && generationFilter === 'all'
                  ? 'bg-[#F5F5F7] text-[#0E0E10]'
                  : 'text-[#71717A] hover:text-[#F5F5F7] hover:bg-[#1E1E22]'
              }`}
            >
              [ 01: CATÁLOGO ]
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('home', 'last_2_years')}
              className={`px-3 py-1 transition-all cursor-pointer flex items-center gap-1.5 ${
                generationFilter === 'last_2_years'
                  ? 'bg-[#0066FF] text-[#F5F5F7]'
                  : 'text-[#71717A] hover:text-[#F5F5F7] hover:bg-[#1E1E22]'
              }`}
            >
              [ 02: FLAGSHIPS ]
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('home', 'vintage_classic')}
              className={`px-3 py-1 transition-all cursor-pointer ${
                generationFilter === 'vintage_classic'
                  ? 'bg-[#0066FF] text-[#F5F5F7]'
                  : 'text-[#71717A] hover:text-[#F5F5F7] hover:bg-[#1E1E22]'
              }`}
            >
              [ 03: VINTAGE ]
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('accessories')}
              className={`px-3 py-1 transition-all cursor-pointer ${
                currentView === 'accessories'
                  ? 'bg-[#F5F5F7] text-[#0E0E10]'
                  : 'text-[#71717A] hover:text-[#F5F5F7] hover:bg-[#1E1E22]'
              }`}
            >
              [ 04: ACCESORIOS ]
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('store_selector')}
              className={`px-3 py-1 transition-all cursor-pointer ${
                currentView === 'store_selector'
                  ? 'bg-[#F5F5F7] text-[#0E0E10]'
                  : 'text-[#71717A] hover:text-[#F5F5F7] hover:bg-[#1E1E22]'
              }`}
            >
              [ 05: BOUTIQUES ]
            </button>
          </nav>

          {/* Right Action Rack */}
          <div className="flex items-center gap-2 font-mono">
            {/* Search Key */}
            <button
              type="button"
              onClick={() => {
                playSubtleClick();
                setShowSearchModal(true);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-[#141416] border border-[#1A1A1D] hover:border-[#0066FF] text-[#71717A] hover:text-[#F5F5F7] text-[11px] font-bold transition-all cursor-pointer"
              title="Buscar en inventario"
            >
              <Search className="w-3 h-3 text-[#0066FF]" />
              <span className="hidden sm:inline">BUSCAR</span>
              <span className="hidden sm:inline text-[9px] text-[#71717A] font-normal">[⌘K]</span>
            </button>

            {/* Comparer Tool */}
            {comparedProducts.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  playSubtleClick();
                  setIsCompareOpen(true);
                }}
                className="flex items-center gap-1 px-2 py-1 bg-[#141416] border border-[#0066FF] text-[#0066FF] text-[11px] font-bold cursor-pointer"
              >
                <Scale className="w-3 h-3" />
                <span>[{comparedProducts.length}]</span>
              </button>
            )}

            {/* Boutique Hub Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  playSubtleClick();
                  setIsStoreMenuOpen(!isStoreMenuOpen);
                }}
                className="flex items-center gap-2 px-2.5 py-1 bg-[#141416] border border-[#1A1A1D] hover:border-[#0066FF] text-[#F5F5F7] text-[11px] transition-all cursor-pointer max-w-[130px] sm:max-w-[180px]"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF]" />
                <span className="truncate uppercase font-bold">{activeStore?.name || 'TODAS'}</span>
                <ChevronDown className="w-3 h-3 text-[#71717A] shrink-0" />
              </button>

              {isStoreMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-72 bg-[#0E0E10] border border-[#1A1A1D] shadow-2xl p-2 z-50 font-mono">
                  <div className="px-2 py-1.5 border-b border-[#1A1A1D] text-[9px] uppercase tracking-widest text-[#0066FF] font-bold flex items-center justify-between">
                    <span>// BOUTIQUE HUBS</span>
                    <Store className="w-3 h-3" />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleStoreSelect(null)}
                    className={`w-full text-left px-2 py-2 text-xs transition-all cursor-pointer mt-1 ${
                      !activeStore
                        ? 'bg-[#0066FF] text-[#F5F5F7] font-bold'
                        : 'text-[#71717A] hover:bg-[#141416] hover:text-[#F5F5F7]'
                    }`}
                  >
                    [00] TODAS LAS BOUTIQUES (GLOBAL)
                  </button>
                  {stores.map((s, idx) => (
                    <button
                      type="button"
                      key={s.id}
                      onClick={() => handleStoreSelect(s)}
                      className={`w-full text-left px-2 py-2 text-xs transition-all flex items-center justify-between cursor-pointer ${
                        activeStore?.id === s.id
                          ? 'bg-[#0066FF] text-[#F5F5F7] font-bold'
                          : 'text-[#71717A] hover:bg-[#141416] hover:text-[#F5F5F7]'
                      }`}
                    >
                      <span className="truncate">[{String(idx + 1).padStart(2, '0')}] {s.name}</span>
                      <span className="text-[10px] text-[#71717A] shrink-0">★ {s.rating}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Trigger Button (Electric Blue) */}
            <button
              type="button"
              onClick={() => {
                playSubtleClick();
                setIsCartOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1 bg-[#0066FF] hover:bg-[#0052cc] text-[#F5F5F7] font-mono font-bold text-[11px] uppercase tracking-wider cursor-pointer active:translate-y-[1px] transition-all"
              title="Carrito de compras"
            >
              <ShoppingBag className="w-3.5 h-3.5 fill-current" />
              <span>CARRITO</span>
              <span className="px-1 py-0.2 bg-[#0E0E10] text-[#0066FF] text-[10px] tabular-nums font-bold">
                {String(itemCount).padStart(2, '0')}
              </span>
            </button>

            {/* Admin Key */}
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
              className="hidden sm:flex p-1.5 bg-[#141416] border border-[#1A1A1D] hover:border-[#0066FF] text-[#71717A] hover:text-[#F5F5F7] cursor-pointer"
              title="Panel Administrativo"
            >
              <Shield className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Menu */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 bg-[#141416] border border-[#1A1A1D] text-zinc-300 hover:text-white cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Rack Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-2 border-t border-[#1A1A1D] pt-2 space-y-1 font-mono text-xs">
            <button
              type="button"
              onClick={() => handleNavClick('home')}
              className="w-full text-left px-3 py-2 bg-[#141416] text-[#F5F5F7]"
            >
              [ 01: CATÁLOGO ]
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('home', 'last_2_years')}
              className="w-full text-left px-3 py-2 bg-[#141416] text-[#0066FF] font-bold"
            >
              [ 02: FLAGSHIPS 2026 ]
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('home', 'vintage_classic')}
              className="w-full text-left px-3 py-2 bg-[#141416] text-[#71717A]"
            >
              [ 03: VINTAGE ARCHIVE ]
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('accessories')}
              className="w-full text-left px-3 py-2 bg-[#141416] text-[#71717A]"
            >
              [ 04: ACCESORIOS ]
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('store_selector')}
              className="w-full text-left px-3 py-2 bg-[#141416] text-[#71717A]"
            >
              [ 05: BOUTIQUES ]
            </button>
          </div>
        )}
      </header>

      {/* Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/85 backdrop-blur-md">
          <div
            onClick={() => setShowSearchModal(false)}
            className="fixed inset-0"
          />
          <div className="relative w-full max-w-xl bg-[#0E0E10] border border-[#0066FF] p-5 shadow-2xl z-10 font-mono space-y-3">
            <div className="flex items-center justify-between text-[10px] text-[#71717A] border-b border-[#1A1A1D] pb-2">
              <span className="text-[#0066FF] font-bold flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" /> BÚSQUEDA TÉCNICA // DATASHEET
              </span>
              <span>ESC PARA CERRAR</span>
            </div>
            <div className="flex items-center gap-2 bg-[#141416] border border-[#1A1A1D] p-2.5">
              <Search className="w-4 h-4 text-[#0066FF]" />
              <input
                type="text"
                placeholder="Ingresar modelo, procesador o RAM (ej. A18, iPhone, S24)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-transparent text-[#F5F5F7] placeholder-[#71717A] text-xs font-mono focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowSearchModal(false)}
                className="px-2 py-0.5 bg-[#1E1E22] text-[#71717A] hover:text-[#F5F5F7] text-[10px] cursor-pointer"
              >
                CERRAR
              </button>
            </div>
            <div className="text-[10px] text-[#71717A] flex justify-between">
              <span>● FILTRO EN TIEMPO REAL</span>
              <button
                type="button"
                onClick={() => setShowSearchModal(false)}
                className="text-[#0066FF] hover:underline cursor-pointer"
              >
                VER RESULTADOS →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
