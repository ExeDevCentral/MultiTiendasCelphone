import React, { useState, Suspense, lazy } from 'react';
import {
  ArrowLeft,
  RotateCw,
  Scale
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { SEOHead } from '../components/SEOHead';
import { WebGLErrorBoundary } from '../components/WebGLErrorBoundary';
import { StickyBuyBar } from '../components/StickyBuyBar';
import { mercadopagoService } from '../services/mercadopago';
import { playSubtleClick, playCartSuccess, playSpatialOpen } from '../utils/audioHaptics';
import { showLuxuryNotification } from '../components/LuxuryToaster';

const PhoneViewer3D = lazy(() =>
  import('../components/PhoneViewer3D').then((m) => ({ default: m.PhoneViewer3D }))
);

export const ProductDetail = ({ product, onBack, onNavigate, onOpen3DModal }) => {
  const { addToCart, setIsCheckoutOpen } = useCart();
  const { stores, toggleCompare, comparedProducts } = useStore();

  const storeInfo = stores.find((s) => s.id === product.storeId) || stores[0];
  const [selectedColor, setSelectedColor] = useState(
    product.colors?.[0] || { name: 'Titanio Natural', hex: '#8a8378', threeHex: '#8e867b' }
  );
  const [selectedStorage, setSelectedStorage] = useState(
    product.storageOptions?.[1] || product.storageOptions?.[0] || '256 GB'
  );
  const [viewMode, setViewMode] = useState('image'); // 'image' | '3d'
  const [includeBundle, setIncludeBundle] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);

  const isCompared = comparedProducts.some((p) => p.id === product.id);

  const handleAddToCart = () => {
    playCartSuccess();
    addToCart(product, {
      color: selectedColor.name,
      storage: selectedStorage,
      quantity: 1,
    });

    if (includeBundle) {
      addToCart({
        id: 'bundle-acc-charger-case',
        name: 'Combo Pro: Cargador GaN + Funda Blindada',
        price: 49,
        originalPrice: 78,
        type: 'accessory',
        storeId: product.storeId,
        images: ['https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400'],
      });
    }

    showLuxuryNotification(
      'Pieza Añadida a la Bolsa',
      `${product.name} (${selectedColor.name}, ${selectedStorage})`
    );
  };

  const handleMercadoPagoDirect = async () => {
    playSubtleClick();
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
            quantity: 1,
          },
        ],
        customer: {
          name: 'Comprador CelStore Atelier',
          email: 'comprador@atelier.com',
        },
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
    playSubtleClick();
    const phone = storeInfo?.phoneWhatsApp || '+5491145239900';
    const text = encodeURIComponent(
      `¡Hola *${storeInfo?.name}*! Deseo comprar el *${product.name}*:\n` +
        `• Acabado: ${selectedColor.name}\n` +
        `• Almacenamiento: ${selectedStorage}\n` +
        `• Importe: $${product.price} USD\n` +
        (includeBundle ? `• Combo Accesorio: Sí (+$49 USD)\n` : '') +
        `• Enlace: ${window.location.href}\n\n` +
        `¿Cuentan con disponibilidad de stock para despacho inmediato?`
    );
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${text}`, '_blank');
  };

  const installmentsAmount = Math.round(product.price / 12);

  return (
    <div className="w-full pb-20">
      <SEOHead
        title={`${product.name} en ${storeInfo?.name || 'CelStore'} - $${product.price} USD`}
        description={product.tagline || product.solutions?.[0]?.description || `Compra ${product.name} con garantía oficial en CelStore Atelier.`}
        image={product.images?.[0] || 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1200'}
      />

      {/* 1. STICKY BUY BAR (Elemento Firma en PC al hacer Scroll) */}
      <StickyBuyBar
        product={product}
        selectedColor={selectedColor}
        selectedStorage={selectedStorage}
        onBuy={handleAddToCart}
        onOpen3D={() => setViewMode(viewMode === '3d' ? 'image' : '3d')}
      />

      {/* Top Breadcrumb */}
      <div className="max-w-[1180px] mx-auto px-6 sm:px-12 pt-8 flex items-center justify-between text-xs text-[#8b8680]">
        <button
          type="button"
          onClick={() => {
            playSubtleClick();
            onBack();
          }}
          className="flex items-center gap-2 hover:text-[#f3efe6] transition-colors group cursor-pointer tracking-wider uppercase text-[11px]"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>Volver al Catálogo</span>
        </button>

        <div className="flex items-center gap-2 text-[11px] tracking-wider uppercase">
          <span className="text-[#8b8680]">Boutique:</span>
          <span className="text-[#e4c972] font-medium">{storeInfo?.name}</span>
        </div>
      </div>

      {/* 2. HERO / PRODUCT SHOWCASE GRID (Proporciones exactas para PC) */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-10 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        
        {/* Left Stage: Visor de Producto con Gradiente Radial de Oro (7 cols) */}
        <div className="lg:col-span-7 relative">
          <div className="product-stage w-full min-h-[460px] h-[520px] relative rounded-[28px] overflow-hidden flex items-center justify-center p-6 shadow-2xl">
            <span className="absolute top-5 left-5 text-[12px] tracking-[0.06em] text-[#8b8680] border border-[rgba(243,239,230,0.16)] px-3 py-1.5 rounded-full backdrop-blur-md z-10 bg-[#0a0a0c]/60">
              {viewMode === '3d' ? 'Estudio 3D Activo' : 'Vista 3D disponible'}
            </span>

            {viewMode === 'image' ? (
              <img
                src={product.images?.[0]}
                alt={product.name}
                className="max-h-[78%] max-w-[78%] object-contain filter drop-shadow-[0_30px_50px_rgba(0,0,0,0.55)] transition-transform duration-500 hover:scale-105"
              />
            ) : (
              <div className="w-full h-full">
                <WebGLErrorBoundary fallbackImages={product.images} height="500px">
                  <Suspense
                    fallback={
                      <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                        <div className="w-6 h-6 border-2 border-[#c9a227] border-t-transparent rounded-full animate-spin" />
                        <p className="text-xs text-[#8b8680]">Iniciando visor 3D...</p>
                      </div>
                    }
                  >
                    <PhoneViewer3D
                      modelType={product.model3dType || 'modern_flagship'}
                      selectedColor={selectedColor}
                      availableColors={product.colors || []}
                      onColorChange={(c) => {
                        playSubtleClick();
                        setSelectedColor(c);
                      }}
                      phoneName={product.name}
                      height="500px"
                    />
                  </Suspense>
                </WebGLErrorBoundary>
              </div>
            )}
          </div>

          {/* Toggle entre 2D y 3D debajo del Stage */}
          <div className="flex items-center justify-between mt-3 px-2 text-xs text-[#8b8680]">
            <button
              type="button"
              onClick={() => {
                playSubtleClick();
                setViewMode(viewMode === '3d' ? 'image' : '3d');
              }}
              className="flex items-center gap-1.5 text-[#e4c972] hover:underline cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>{viewMode === '3d' ? 'Ver Fotografía de Estudio' : 'Rotar en Visor 3D Interactivo'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playSubtleClick();
                toggleCompare(product);
                showLuxuryNotification(
                  isCompared ? 'Removido de Comparación' : 'Añadido a Comparación',
                  product.name
                );
              }}
              className="flex items-center gap-1.5 text-[#8b8680] hover:text-[#f3efe6] cursor-pointer"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{isCompared ? 'En Comparador' : 'Comparar'}</span>
            </button>
          </div>
        </div>

        {/* Right Info: Copy Editorial y Selectores */}
        <div className="space-y-6">
          <div>
            <p className="eyebrow">
              {product.generationCategory === 'vintage_classic'
                ? `Vintage Archive · Edición ${product.modelYear}`
                : `Flagship ${product.modelYear || '2026'} · Titanio Grado 5`}
            </p>

            <h1 className="text-3xl sm:text-[40px] font-bold text-[#f3efe6] leading-[1.1] tracking-tight">
              {product.headline || 'Filmá como en el cine. Editá en el bolsillo.'}
            </h1>

            <p className="text-[16px] sm:text-[17px] text-[#8b8680] leading-[1.6] mt-4 max-w-[42ch]">
              {product.solutions?.[0]?.description ||
                'Grabá en calidad de estudio y armá el corte final antes de llegar a casa. Una batería que aguanta el día completo sin que pienses en el cargador.'}
            </p>
          </div>

          {/* Selector de Color (Swatches circulares de 34px) */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2.5">
              <p className="text-[12px] text-[#8b8680] tracking-[0.06em] uppercase font-medium">
                COLOR: <span className="text-[#f3efe6] font-normal">{selectedColor.name}</span>
              </p>
              <div className="flex items-center gap-2.5">
                {product.colors.map((color, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => {
                      playSubtleClick();
                      setSelectedColor(color);
                    }}
                    className={`w-[34px] h-[34px] rounded-full border-2 transition-all cursor-pointer ${
                      selectedColor.name === color.name
                        ? 'border-[#c9a227] scale-110 shadow-lg'
                        : 'border-transparent opacity-80 hover:opacity-100 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Selector de Almacenamiento (Pills de 100px redondeadas) */}
          {product.storageOptions && product.storageOptions.length > 0 && (
            <div className="space-y-2.5">
              <p className="text-[12px] text-[#8b8680] tracking-[0.06em] uppercase font-medium">
                ALMACENAMIENTO
              </p>
              <div className="flex flex-wrap gap-2.5">
                {product.storageOptions.map((opt, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => {
                      playSubtleClick();
                      setSelectedStorage(opt);
                    }}
                    className={`px-[18px] py-[10px] rounded-full text-[13px] transition-all cursor-pointer ${
                      selectedStorage === opt
                        ? 'border border-[#c9a227] text-[#f3efe6] bg-[rgba(201,162,39,0.08)]'
                        : 'border border-[rgba(243,239,230,0.16)] text-[#8b8680] hover:text-[#f3efe6]'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Fila de Precios y Cuotas */}
          <div className="flex items-baseline gap-3 pt-2">
            <span className="text-[28px] sm:text-[32px] font-bold text-[#f3efe6] font-mono tracking-tight">
              ${product.price} <span className="text-sm text-[#8b8680] font-sans">USD</span>
            </span>
            <span className="text-[13px] text-[#8b8680]">
              o 12 cuotas sin interés de ${installmentsAmount} USD
            </span>
          </div>

          {/* Botones de Acción Primaria */}
          <div className="flex flex-col sm:flex-row gap-3.5 pt-2">
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 py-4 px-7 bg-[#c9a227] hover:bg-[#e4c972] text-[#0a0a0c] font-bold text-[15px] rounded-[12px] transition-all cursor-pointer text-center shadow-lg hover:-translate-y-0.5"
            >
              Comprar
            </button>

            <button
              type="button"
              onClick={() => {
                playSpatialOpen();
                if (onOpen3DModal) {
                  onOpen3DModal(product, selectedColor);
                } else {
                  setViewMode('3d');
                }
              }}
              className="py-4 px-6 rounded-[12px] border border-[rgba(243,239,230,0.16)] hover:border-[#c9a227] text-[#f3efe6] hover:text-[#e4c972] text-[14px] transition-all cursor-pointer whitespace-nowrap"
            >
              Ver en 3D →
            </button>
          </div>

          {/* Fila de Confianza y Garantía */}
          <div className="flex flex-wrap gap-6 pt-4 text-[12.5px] text-[#8b8680]">
            <span className="flex items-center gap-1.5">
              🚚 Envío gratis
            </span>
            <span className="flex items-center gap-1.5">
              🛡️ Garantía oficial 12 meses
            </span>
            <span className="flex items-center gap-1.5">
              ↩️ Cambio en 30 días
            </span>
          </div>
        </div>
      </section>

      {/* 3. BENEFICIOS REALES EN 3 COLUMNAS (Filosofía de Soluciones para PC) */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pt-12 mt-8 border-t border-[rgba(243,239,230,0.08)]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-2.5">
            <span className="text-[#c9a227] text-[20px] block">◆</span>
            <h3 className="text-[18px] font-semibold text-[#f3efe6]">
              Autonomía real de todo el día
            </h3>
            <p className="text-[14.5px] text-[#8b8680] leading-[1.6]">
              Salís a la mañana y llegás a la noche sin buscar un cargador. Pensado para tu rutina, no para un laboratorio de pruebas.
            </p>
          </div>

          <div className="space-y-2.5">
            <span className="text-[#c9a227] text-[20px] block">◆</span>
            <h3 className="text-[18px] font-semibold text-[#f3efe6]">
              Titanio que aguanta lo que le tirás
            </h3>
            <p className="text-[14.5px] text-[#8b8680] leading-[1.6]">
              Se banca la mochila, el bolsillo y las caídas de todos los días — sin perder el brillo del primer día.
            </p>
          </div>

          <div className="space-y-2.5">
            <span className="text-[#c9a227] text-[20px] block">◆</span>
            <h3 className="text-[18px] font-semibold text-[#f3efe6]">
              Fotos que no necesitan filtro
            </h3>
            <p className="text-[14.5px] text-[#8b8680] leading-[1.6]">
              Sacá la foto y compartila. El procesamiento hace el resto para que tu recuerdo se vea como lo viviste.
            </p>
          </div>
        </div>
      </section>

      {/* 4. ESPECIFICACIONES TÉCNICAS (COLAPSIBLE / TABLA) */}
      {product.specs && (
        <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pt-14 mt-10 border-t border-[rgba(243,239,230,0.08)]">
          <h3 className="text-xl font-semibold text-[#f3efe6] mb-6">
            Ficha Técnica de Precisión
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(product.specs).map(([key, val]) => (
              <div
                key={key}
                className="p-4 rounded-xl bg-[#131316] border border-[rgba(243,239,230,0.08)] flex items-center justify-between text-xs"
              >
                <span className="text-[#8b8680] uppercase tracking-wider text-[11px] font-medium">{key}</span>
                <span className="text-[#f3efe6] text-right max-w-[60%] font-mono">{val}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
