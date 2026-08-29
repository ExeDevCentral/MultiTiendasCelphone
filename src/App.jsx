import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ComparisonModal } from './components/ComparisonModal';
import { Photo3DModal } from './components/Photo3DModal';
import { SmoothScroll } from './components/SmoothScroll';
import { LuxuryToaster } from './components/LuxuryToaster';
import { AlertCircle } from 'lucide-react';

// Views
import { Home } from './views/Home';
import { StoreCatalog } from './views/StoreCatalog';
import { ProductDetail } from './views/ProductDetail';
import { AccessoriesShop } from './views/AccessoriesShop';
import { StoreSelector } from './views/StoreSelector';
import { AdminLogin } from './views/AdminLogin';
import { AdminDashboard } from './views/admin/AdminDashboard';

const AppContent = () => {
  const [currentView, setCurrentView] = useState('home');
  const [viewParams, setViewParams] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Quick 3D Preview Modal state
  const [preview3DProduct, setPreview3DProduct] = useState(null);

  const { crossStoreConflict, resolveCrossStoreConflict } = useCart();
  const { stores } = useStore();

  const handleNavigate = (view, params = {}) => {
    setCurrentView(view);
    setViewParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDetail = (product) => {
    setSelectedProduct(product);
    setCurrentView('product_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpen3DModal = (product) => {
    setPreview3DProduct(product);
  };

  const currentConflictStore = stores.find((s) => s.id === crossStoreConflict?.currentStoreId);
  const newConflictStore = stores.find((s) => s.id === crossStoreConflict?.newStoreId);

  return (
    <SmoothScroll>
      <div className="min-h-screen flex flex-col bg-[#08080a] text-[#f5f5f0] selection:bg-[#c5a880] selection:text-black">
        {/* Top Navbar */}
        <Navbar currentView={currentView} onNavigate={handleNavigate} />

        {/* Main View Router */}
        <main className="flex-1">
          {currentView === 'home' && (
            <Home
              onNavigate={handleNavigate}
              onOpenDetail={handleOpenDetail}
              onOpen3DModal={handleOpen3DModal}
            />
          )}

          {currentView === 'store_catalog' && (
            <StoreCatalog
              storeId={viewParams.storeId}
              onOpenDetail={handleOpenDetail}
              onOpen3DModal={handleOpen3DModal}
              onNavigate={handleNavigate}
            />
          )}

          {currentView === 'product_detail' && selectedProduct && (
            <ProductDetail
              product={selectedProduct}
              onBack={() => handleNavigate('home')}
              onNavigate={handleNavigate}
            />
          )}

          {currentView === 'accessories' && (
            <AccessoriesShop onNavigate={handleNavigate} />
          )}

          {currentView === 'store_selector' && (
            <StoreSelector onNavigate={handleNavigate} />
          )}

          {currentView === 'admin_login' && (
            <AdminLogin onNavigate={handleNavigate} />
          )}

          {currentView === 'admin_dashboard' && (
            <AdminDashboard onNavigate={handleNavigate} />
          )}
        </main>

        {/* Global Drawers & Modals */}
        <CartDrawer />
        <CheckoutModal />
        <ComparisonModal />

        {/* MULTI-TENANT CART CONFLICT MODAL */}
        {crossStoreConflict && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <div
              onClick={() => resolveCrossStoreConflict(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            <div className="relative w-full max-w-md bg-[#0c0c0e] border border-[#c5a880]/30 rounded-3xl p-6 shadow-2xl text-white z-10 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#c5a880]/15 text-[#c5a880] border border-[#c5a880]/30 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-lg font-light text-white font-serif">Cambio de Sucursal en la Bolsa</h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-light">
                  Tu bolsa de compras actualmente contiene artículos de <strong className="text-white">{currentConflictStore?.name || 'otra sucursal'}</strong>.
                </p>
                <p className="text-xs text-neutral-300 font-light">
                  ¿Deseas iniciar una nueva orden exclusiva en <strong className="text-[#c5a880]">{newConflictStore?.name || 'esta sucursal'}</strong>?
                </p>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => resolveCrossStoreConflict(true)}
                  className="w-full py-3 rounded-xl bg-[#c5a880] hover:bg-[#d4af37] text-black text-xs font-medium tracking-wider uppercase transition-all shadow-lg cursor-pointer"
                >
                  Iniciar Bolsa en {newConflictStore?.name || 'Nueva Tienda'}
                </button>

                <button
                  type="button"
                  onClick={() => resolveCrossStoreConflict(false)}
                  className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white text-xs font-light tracking-wider uppercase transition-colors cursor-pointer"
                >
                  Conservar mi Bolsa Actual
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal 3D de Alta Costura iPhone x Gucci (Lazy Canvas & GPU Dispose) */}
        <Photo3DModal
          isOpen={!!preview3DProduct}
          product={preview3DProduct}
          onClose={() => setPreview3DProduct(null)}
        />

        {/* Global Toaster de Lujo */}
        <LuxuryToaster />

        {/* Global Apple-grade Footer */}
        <Footer onNavigate={handleNavigate} />
      </div>
    </SmoothScroll>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </StoreProvider>
    </AuthProvider>
  );
}
