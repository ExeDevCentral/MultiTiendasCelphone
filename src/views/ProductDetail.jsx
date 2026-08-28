import React, { useState, Suspense, lazy } from 'react';
import {
  ArrowLeft,
  ShoppingBag,
  MessageSquare,
  ShieldCheck,
  Truck,
  RotateCw,
  Star,
  CheckCircle,
  Zap,
  Sparkles,
  Scale,
  CreditCard
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { SEOHead } from '../components/SEOHead';
import { WebGLErrorBoundary } from '../components/WebGLErrorBoundary';
import { mercadopagoService } from '../services/mercadopago';

// Lazy load 3D Studio to drastically optimize initial bundle and mobile LCP
const PhoneViewer3D = lazy(() =>
  import('../components/PhoneViewer3D').then(m => ({ default: m.PhoneViewer3D }))
);

export const ProductDetail = ({ product, onBack, onNavigate }) => {
  const { addToCart, setIsCheckoutOpen } = useCart();
  const { stores, toggleCompare, comparedProducts } = useStore();

  const storeInfo = stores.find(s => s.id === product.storeId) || stores[0];
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || { name: 'Estándar', hex: '#8e867b' });
  const [selectedStorage, setSelectedStorage] = useState(product.storageOptions?.[0] || '256 GB');
  const [includeBundle, setIncludeBundle] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);

  const isCompared = comparedProducts.some(p => p.id === product.id);

  const handleAddToCart = () => {
    addToCart(product, {
      color: selectedColor.name,
      storage: selectedStorage,
      quantity: 1
    });

    if (includeBundle) {
      addToCart({
        id: 'bundle-acc-charger-case',
        name: 'Combo Pro: Cargador GaN + Funda Blindada',
        price: 49,
        originalPrice: 78,
        type: 'accessory',
        storeId: product.storeId,
        images: ['https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400']
      });
    }
  };

  const handleMercadoPagoDirect = async () => {
    setLoadingPayment(true);
    try {
      const preference = await mercadopagoService.createPreference({
        storeId: product.storeId,
        items: [
          {
            productId: product.id,
            name: product.name,
            color: selectedColor.name,
            price: includeBundle ? product.price + 49 : product.price,
            quantity: 1
          }
        ],
        customer: {
          name: 'Comprador CelStore',
          email: 'comprador@example.com'
        }
      });
      mercadopagoService.redirectToCheckout(preference);
    } catch (err) {
      console.warn('MercadoPago fallback to checkout modal:', err);
      handleAddToCart();
      setIsCheckoutOpen(true);
    } finally {
      setLoadingPayment(false);
    }
  };

  const handleWhatsApp = () => {
    const phone = storeInfo?.phoneWhatsApp || '+5491145239900';
    const text = encodeURIComponent(
      `¡Hola *${storeInfo?.name}*! Quiero comprar el *${product.name}*:\n` +
      `• Acabado: ${selectedColor.name}\n` +
      `• Almacenamiento: ${selectedStorage}\n` +
      `• Precio: $${product.price} USD\n` +
      (includeBundle ? `• Combo Accesorio: Sí (+$49 USD)\n` : '') +
      `• Enlace del producto: ${window.location.href}\n\n` +
      `¿Tienen stock para despacho inmediato?`
    );
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
      {/* Dynamic SEO & OpenGraph Meta Tags for WhatsApp Sharing */}
      <SEOHead
        title={`${product.name} en ${storeInfo?.name || 'CelStore'} - $${product.price} USD`}
        description={product.tagline || product.solutions?.[0]?.description || `Compra ${product.name} con garantía oficial en CelStore MultiTiendas.`}
        image={product.images?.[0] || 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1200'}
      />

      {/* Top Breadcrumb Bar */}
      <div className="flex items-center justify-between text-xs text-neutral-400">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Volver al Catálogo</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-neutral-500">Tienda:</span>
          <span className="text-blue-400 font-semibold">{storeInfo?.name}</span>
        </div>
      </div>

      {/* Main Product Showcase (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Interactive 3D Phone Studio with WebGL Error Boundary & Suspense */}
        <div className="lg:col-span-7 space-y-4">
          <WebGLErrorBoundary fallbackImages={product.images} height="550px">
            <Suspense
              fallback={
                <div className="h-[550px] w-full rounded-2xl glass-panel flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs text-neutral-400 font-mono">Cargando motor 3D WebGL...</p>
                </div>
              }
            >
              <PhoneViewer3D
                modelType={product.model3dType || 'modern_flagship'}
                selectedColor={selectedColor}
                availableColors={product.colors || []}
                onColorChange={(c) => setSelectedColor(c)}
                phoneName={product.name}
                height="550px"
              />
            </Suspense>
          </WebGLErrorBoundary>

          <div className="flex items-center justify-between p-4 rounded-2xl glass-panel border border-white/10 text-xs text-neutral-400">
            <div className="flex items-center gap-2">
              <RotateCw className="w-4 h-4 text-blue-400 animate-spin" style={{ animationDuration: '10s' }} />
              <span>Arrastra con el mouse para girar 360° en tiempo real</span>
            </div>
            <button
              onClick={() => toggleCompare(product)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${
                isCompared
                  ? 'bg-blue-600 border-blue-400 text-white'
                  : 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{isCompared ? 'Comparando' : 'Comparar'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Buying Box & Specifications */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                {product.brand} • {product.modelYear}
              </span>
              <span className="text-xs text-neutral-400 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                {product.rating} ({product.reviewCount} reseñas)
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {product.name}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-2 leading-relaxed">
              {product.tagline || product.condition}
            </p>
          </div>

          {/* Pricing Box */}
          <div className="p-5 rounded-2xl bg-neutral-900/60 border border-white/10 flex items-center justify-between">
            <div>
              <div className="text-xs text-neutral-400">Precio Oficial de Tienda</div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white">${product.price}</span>
                <span className="text-xs text-neutral-400">USD</span>
                {product.originalPrice && (
                  <span className="text-sm text-neutral-500 line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <CheckCircle className="w-3 h-3" />
                {product.stock} disponibles en stock
              </span>
            </div>
          </div>

          {/* Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 block">
                Acabado Exterior: <span className="text-blue-400">{selectedColor.name}</span>
              </label>
              <div className="flex items-center gap-2">
                {product.colors.map((color, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColor(color)}
                    className={`w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center ${
                      selectedColor.name === color.name
                        ? 'border-blue-400 scale-110 ring-2 ring-white/50 shadow-lg'
                        : 'border-white/20 opacity-80 hover:opacity-100 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Storage Options */}
          {product.storageOptions && product.storageOptions.length > 0 && (
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 block">
                Capacidad de Almacenamiento:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {product.storageOptions.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedStorage(opt)}
                    className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${
                      selectedStorage === opt
                        ? 'bg-blue-600 border-blue-400 text-white shadow-md shadow-blue-600/30'
                        : 'glass-panel text-neutral-300 hover:bg-white/10'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Cross-Sell Bundle Checkbox */}
          <div
            onClick={() => setIncludeBundle(!includeBundle)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
              includeBundle
                ? 'bg-blue-950/40 border-blue-400 ring-1 ring-blue-400'
                : 'glass-panel border-white/10 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                includeBundle ? 'bg-blue-600 border-blue-400 text-white' : 'border-white/20 bg-neutral-900'
              }`}>
                {includeBundle && <CheckCircle className="w-3.5 h-3.5" />}
              </div>
              <div>
                <p className="text-xs font-bold text-white">
                  Añadir Combo Pro de Accesorios
                </p>
                <p className="text-[11px] text-neutral-400">
                  Cargador Rápido GaN 65W + Funda Blindada Aramida
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-emerald-400">+$49 USD</span>
              <span className="text-[10px] text-neutral-500 line-through block">$78 USD</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={handleAddToCart}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-blue-600/30 transition-all hover:scale-[1.02]"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Añadir a la Bolsa • ${includeBundle ? product.price + 49 : product.price} USD</span>
            </button>

            {/* MercadoPago Real Checkout Button */}
            <button
              onClick={handleMercadoPagoDirect}
              disabled={loadingPayment}
              className="w-full py-3.5 px-6 rounded-2xl bg-sky-500 hover:bg-sky-400 text-black font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 transition-all hover:scale-[1.02]"
            >
              <CreditCard className="w-4 h-4 text-black" />
              <span>{loadingPayment ? 'Conectando MercadoPago...' : 'Pagar con MercadoPago / Cuotas'}</span>
            </button>

            {/* WhatsApp Direct Buy */}
            <button
              onClick={handleWhatsApp}
              className="w-full py-3 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Consultar / Pedir por WhatsApp</span>
            </button>
          </div>

          {/* Security & Warranty Tags */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10 text-neutral-400 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Garantía Oficial {storeInfo?.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>Envío Gratis con Seguro</span>
            </div>
          </div>
        </div>
      </div>

      {/* "QUÉ SOLUCIONA PARA TI" SECTION (Apple Philosophy) */}
      {product.solutions && product.solutions.length > 0 && (
        <section className="pt-10 border-t border-white/10 space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center justify-center gap-1.5 mb-2">
              <Sparkles className="w-4 h-4" />
              Propuesta de Valor & Soluciones Reales
            </span>
            <h3 className="text-3xl font-extrabold text-white">
              ¿Por qué este teléfono es para ti?
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {product.solutions.map((sol, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl glass-panel border border-white/10 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 inline-block mb-3">
                    {sol.badge}
                  </span>
                  <h4 className="text-base font-bold text-white mb-2">{sol.title}</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {sol.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SPECIFICATIONS TABLE */}
      {product.specs && (
        <section className="pt-8 border-t border-white/10 space-y-6">
          <h3 className="text-2xl font-bold text-white">Ficha Técnica Completa</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(product.specs).map(([key, val]) => (
              <div
                key={key}
                className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between"
              >
                <span className="text-xs text-neutral-400 uppercase font-semibold">{key}</span>
                <span className="text-xs text-neutral-200 font-medium text-right max-w-[60%]">{val}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
