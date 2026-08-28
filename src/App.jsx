import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ComparisonModal } from './components/ComparisonModal';
import { PhoneViewer3D } from './components/PhoneViewer3D';

// Views
import { Home } from './views/Home';
import { StoreCatalog } from './views/StoreCatalog';
import { ProductDetail } from './views/ProductDetail';
import { AccessoriesShop } from './views/AccessoriesShop';
import { StoreSelector } from './views/StoreSelector';
import { AdminLogin } from './views/AdminLogin';
import { AdminDashboard } from './views/AdminDashboard';
import { X, Sparkles, Eye, ShoppingBag } from 'lucide-react';
import { useCart } from './context/CartContext';

const AppContent = () => {
  const [currentView, setCurrentView] = useState('home');
  const [viewParams, setViewParams] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Quick 3D Preview Modal state
  const [preview3DProduct, setPreview3DProduct] = useState(null);
  const [preview3DColor, setPreview3DColor] = useState(null);

  const { addToCart } = useCart();

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

  const handleOpen3DModal = (product, color) => {
    setPreview3DProduct(product);
    setPreview3DColor(color || product.colors?.[0] || { name: 'Titanio Natural', hex: '#8e867b' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100 selection:bg-blue-600 selection:text-white">
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

      {/* Global Quick 3D Preview Modal */}
      {preview3DProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            onClick={() => setPreview3DProduct(null)}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          <div className="relative w-full max-w-4xl bg-neutral-950 border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl text-white z-10 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                  Inspección 360° en Tiempo Real
                </span>
                <h3 className="text-xl font-extrabold text-white">{preview3DProduct.name}</h3>
              </div>

              <button
                onClick={() => setPreview3DProduct(null)}
                className="p-1.5 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <PhoneViewer3D
              modelType={preview3DProduct.model3dType || 'modern_flagship'}
              selectedColor={preview3DColor}
              availableColors={preview3DProduct.colors || []}
              onColorChange={(c) => setPreview3DColor(c)}
              phoneName={preview3DProduct.name}
              height="450px"
            />

            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <div className="text-xl font-extrabold text-white">
                ${preview3DProduct.price} <span className="text-xs text-neutral-400 font-normal">USD</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    handleOpenDetail(preview3DProduct);
                    setPreview3DProduct(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
                >
                  Ver Ficha Completa
                </button>

                <button
                  onClick={() => {
                    addToCart(preview3DProduct, { color: preview3DColor.name });
                    setPreview3DProduct(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-blue-600/30"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Añadir a la Bolsa</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Apple-grade Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
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
