import React, { useState, Suspense, lazy } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  BadgeCheck,
  Phone,
  Star,
  ShoppingBag,
  Truck
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { GenerationFilter } from '../components/GenerationFilter';
import { SolutionsBento } from '../components/SolutionsBento';
import { ProductCard } from '../components/ProductCard';
import { WebGLErrorBoundary } from '../components/WebGLErrorBoundary';
import { playSubtleClick } from '../utils/audioHaptics';

const PhoneViewer3D = lazy(() =>
  import('../components/PhoneViewer3D').then((m) => ({ default: m.PhoneViewer3D }))
);

export const Home = ({ onNavigate, onOpenDetail, onOpen3DModal }) => {
  const { stores, setActiveStore, filteredProducts, generationFilter, setGenerationFilter } = useStore();

  const [heroColor, setHeroColor] = useState({
    name: 'Titanio Natural',
    hex: '#8a8378',
    threeHex: '#8e867b',
  });
  const [heroModelType, setHeroModelType] = useState('modern_flagship');

  const heroColors = [
    { name: 'Titanio Natural', hex: '#8a8378', threeHex: '#8e867b' },
    { name: 'Negro Espacial', hex: '#2a2a2c', threeHex: '#1c1c1e' },
    { name: 'Titanio Azul', hex: '#4b5b63', threeHex: '#3a4a52' },
  ];

  const vintageColors = [
    { name: 'Azul Nokia', hex: '#1b2838', threeHex: '#141e2b' },
    { name: 'Plata Metálico', hex: '#c0c0c0', threeHex: '#a8a8a8' },
    { name: 'Hot Pink Glam', hex: '#e91e63', threeHex: '#c2185b' },
  ];

  return (
    <div className="space-y-0 pb-0 overflow-hidden">
      
       {/* ═══════════════════════════════════════════════════════════════════
           1. TRUST BAR — ENVÍOS, GARANTÍA, DEVOLUCIONES (europeo)
           ═══════════════════════════════════════════════════════════════════ */}
       <section className="bg-[#0f0f12] border-b border-[rgba(243,239,230,0.06)]">
         <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-3">
           <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-[11px] sm:text-xs text-[#8b8680]">
             <div className="flex items-center gap-2">
               <Truck className="w-3.5 h-3.5 text-[#c9a227]" />
               <span>Envío gratuito +€99</span>
             </div>
             <div className="flex items-center gap-2">
               <ShieldCheck className="w-3.5 h-3.5 text-[#c9a227]" />
               <span>Garantía 24 meses</span>
             </div>
             <div className="flex items-center gap-2">
               <RotateCcw className="w-3.5 h-3.5 text-[#c9a227]" />
               <span>Devolución 30 días</span>
             </div>
             <div className="flex items-center gap-2">
               <BadgeCheck className="w-3.5 h-3.5 text-[#c9a227]" />
               <span>Equipo certificado</span>
             </div>
           </div>
         </div>
       </section>

       {/* ═══════════════════════════════════════════════════════════════════
           2. HERO — LIMPIO, PROFESIONAL, EUROPEO
           ═══════════════════════════════════════════════════════════════════ */}
       <section className="relative pt-12 sm:pt-20 pb-16 sm:pb-24 px-6 sm:px-10 lg:px-12 max-w-7xl mx-auto">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
           
           {/* Texto */}
           <div className="space-y-8 text-center lg:text-left">
             <div className="space-y-4">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(201,162,39,0.08)] border border-[rgba(201,162,39,0.2)]">
                 <span className="w-1.5 h-1.5 rounded-full bg-[#c9a227] animate-pulse" />
                 <span className="text-[11px] font-medium text-[#c9a227] tracking-wider uppercase">Nuevo 2026</span>
               </div>

               <h1 className="text-4xl sm:text-5xl lg:text-[48px] font-bold text-[#f3efe6] tracking-tight leading-[1.1]">
                 Smartphones premium.{' '}
                 <span className="text-[#c9a227]">Precios reales.</span>
               </h1>

               <p className="text-[15px] text-[#8b8680] max-w-lg mx-auto lg:mx-0 leading-[1.7]">
                 Apple, Samsung, Xiaomi y más. Últimos modelos con garantía oficial, envío en 24h y atención personalizada.
               </p>
             </div>

             {/* CTA principal */}
             <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
               <button
                 type="button"
                 onClick={() => {
                   playSubtleClick();
                   const cat = document.getElementById('catalog-section');
                   if (cat) cat.scrollIntoView({ behavior: 'smooth' });
                 }}
                 className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-[#c9a227] hover:bg-[#d4b03a] text-[#0a0a0c] text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2"
               >
                 <ShoppingBag className="w-4 h-4" />
                 Ver catálogo completo
               </button>
               <button
                 type="button"
                 onClick={() => {
                   playSubtleClick();
                   onNavigate('accessories');
                 }}
                 className="w-full sm:w-auto px-8 py-3.5 rounded-lg border border-[rgba(243,239,230,0.15)] hover:border-[#c9a227] text-[#f3efe6] hover:text-[#c9a227] text-sm font-medium transition-all cursor-pointer"
               >
                 Accesorios
               </button>
             </div>

             {/* Social proof */}
             <div className="flex items-center gap-4 justify-center lg:justify-start pt-2">
               <div className="flex -space-x-2">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="w-8 h-8 rounded-full bg-[#1b1b1f] border-2 border-[#0a0a0c] flex items-center justify-center text-[10px] text-[#8b8680]">
                     {['A','M','L','S'][i-1]}
                   </div>
                 ))}
               </div>
               <div className="text-left">
                 <div className="flex items-center gap-1">
                   {[1,2,3,4,5].map(i => (
                     <Star key={i} className="w-3 h-3 fill-[#c9a227] text-[#c9a227]" />
                   ))}
                 </div>
                 <span className="text-[11px] text-[#8b8680]">+2.400 clientes satisfechos</span>
               </div>
             </div>
           </div>

           {/* Visor 3D */}
           <div className="w-full flex justify-center">
             <div className="w-full max-w-[460px]">
               <div className="relative rounded-2xl overflow-hidden bg-[#131316] border border-[rgba(243,239,230,0.08)] shadow-2xl">
                 <WebGLErrorBoundary height="480px">
                   <Suspense
                     fallback={
                       <div className="h-[480px] flex flex-col items-center justify-center gap-3">
                         <div className="w-6 h-6 border-2 border-[#c9a227] border-t-transparent rounded-full animate-spin" />
                         <p className="text-xs text-[#8b8680]">Cargando visor 3D...</p>
                       </div>
                     }
                   >
                     <PhoneViewer3D
                       modelType={heroModelType}
                       selectedColor={heroColor}
                       availableColors={heroModelType === 'modern_flagship' ? heroColors : vintageColors}
                       onColorChange={(c) => { playSubtleClick(); setHeroColor(c); }}
                       phoneName={heroModelType === 'modern_flagship' ? 'iPhone 16 Pro Max' : heroModelType === 'vintage_bar' ? 'Nokia 3310' : 'RAZR V3'}
                       height="480px"
                     />
                   </Suspense>
                 </WebGLErrorBoundary>
               </div>

               {/* Selector de modelo debajo del visor */}
               <div className="flex items-center justify-center gap-2 mt-4">
                 {[
                   { key: 'modern_flagship', label: 'Flagship', color: '#c9a227' },
                   { key: 'vintage_bar', label: 'Nokia', color: '#8b8680' },
                   { key: 'vintage_flip', label: 'RAZR', color: '#38bdf8' },
                 ].map((m) => (
                   <button
                     key={m.key}
                     type="button"
                     onClick={() => {
                       playSubtleClick();
                       setHeroModelType(m.key);
                       setHeroColor(m.key === 'modern_flagship' ? heroColors[0] : m.key === 'vintage_bar' ? vintageColors[0] : vintageColors[1]);
                     }}
                     className={`px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                       heroModelType === m.key
                         ? 'bg-[#1b1b1f] text-[#f3efe6] border border-[rgba(243,239,230,0.16)]'
                         : 'text-[#8b8680] hover:text-[#f3efe6]'
                     }`}
                   >
                     {m.label}
                   </button>
                 ))}
               </div>
             </div>
           </div>

         </div>
       </section>

      {/* ═══════════════════════════════════════════════════════════════════
          2. BOUTIQUES
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-16 sm:py-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#c9a227] font-medium mb-2">
              Nuestras tiendas
            </p>
            <h3 className="text-2xl font-bold text-[#f3efe6]">
              Boutiques CelStore
            </h3>
          </div>
          <button
            type="button"
            onClick={() => { playSubtleClick(); onNavigate('store_selector'); }}
            className="text-xs text-[#c9a227] hover:text-[#e4c972] flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            Ver todas
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stores.map((store) => (
            <div
              key={store.id}
              onClick={() => {
                playSubtleClick();
                setActiveStore(store);
                onNavigate('store_catalog', { storeId: store.id });
              }}
              className="p-5 rounded-xl bg-[#0f0f12] border border-[rgba(243,239,230,0.06)] hover:border-[#c9a227]/40 transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-[#f3efe6] group-hover:text-[#c9a227] transition-colors">
                  {store.name}
                </span>
                <span className="text-[11px] text-[#c9a227] font-mono">★ {store.rating}</span>
              </div>
              <p className="text-[12px] text-[#8b8680] leading-relaxed mb-3">
                {store.tagLine}
              </p>
              <div className="flex items-center justify-between text-[11px] text-[#8b8680] pt-3 border-t border-[rgba(243,239,230,0.06)]">
                <span>{store.specialty}</span>
                <span className="text-[#c9a227] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          3. SOLUCIONES
          ═══════════════════════════════════════════════════════════════════ */}
      <SolutionsBento />

      {/* ═══════════════════════════════════════════════════════════════════
          4. CATÁLOGO
          ═══════════════════════════════════════════════════════════════════ */}
      <section id="catalog-section" className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-16 sm:py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-[rgba(243,239,230,0.08)] pb-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#c9a227] font-medium mb-2">
              Catálogo
            </p>
            <h3 className="text-2xl font-bold text-[#f3efe6]">
              {generationFilter === 'last_2_years'
                ? 'Últimos lanzamientos'
                : generationFilter === 'vintage_classic'
                ? 'Clásicos de colección'
                : 'Todos los productos'}
            </h3>
          </div>
          <div className="w-full md:w-auto">
            <GenerationFilter showTitle={false} />
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 rounded-xl bg-[#0f0f12] border border-[rgba(243,239,230,0.06)]">
            <Phone className="w-10 h-10 text-[#8b8680] mx-auto mb-4" />
            <h4 className="text-sm font-semibold text-[#f3efe6] mb-1">Sin resultados</h4>
            <p className="text-[12px] text-[#8b8680] mb-4">No hay productos en esta categoría.</p>
            <button
              type="button"
              onClick={() => { playSubtleClick(); setGenerationFilter('all'); }}
              className="px-5 py-2 rounded-lg bg-[#c9a227] hover:bg-[#d4b03a] text-[#0a0a0c] text-xs font-semibold cursor-pointer transition-colors"
            >
              Ver todo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenDetail={(p) => onOpenDetail(p)}
                onOpen3DModal={(p) => onOpen3DModal(p)}
              />
            ))}
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          5. CTA ACCESORIOS
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pb-16 sm:pb-20">
        <div
          onClick={() => { playSubtleClick(); onNavigate('accessories'); }}
          className="p-8 sm:p-10 rounded-xl bg-[#0f0f12] border border-[rgba(243,239,230,0.06)] hover:border-[#c9a227]/40 transition-all cursor-pointer group"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#c9a227] font-medium mb-2">
                Complementos
              </p>
              <h3 className="text-xl sm:text-2xl font-bold text-[#f3efe6] mb-2 group-hover:text-[#c9a227] transition-colors">
                Fundas, cargadores y accesorios premium
              </h3>
              <p className="text-[13px] text-[#8b8680]">
                MagSafe, GaN 120W, aramida y aluminio mecanizado.
              </p>
            </div>
            <div className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[#c9a227] text-[#0a0a0c] text-sm font-semibold group-hover:bg-[#d4b03a] transition-colors shrink-0">
              <span>Explorar</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          6. NEWSLETTER / CONFIANZA FINAL
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="border-t border-[rgba(243,239,230,0.06)]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-16 sm:py-20 text-center">
          <h3 className="text-xl sm:text-2xl font-bold text-[#f3efe6] mb-3">
            ¿No encontrás lo que buscás?
          </h3>
          <p className="text-[13px] text-[#8b8680] mb-6 max-w-md mx-auto">
            Escribinos y te asesoramos personalmente. Atención directa por WhatsApp.
          </p>
          <a
            href="https://wa.me/5491100000000?text=Hola%20CelStore%2C%20necesito%20asesoramiento"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-[#25D366] hover:bg-[#20ba5a] text-white text-sm font-semibold transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Chatear por WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
};
