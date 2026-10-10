'use client';

import React from 'react';
import { MessageCircle, ShieldCheck, Truck, Headphones } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PrecisionHero } from '../components/PrecisionHero';
import { PrecisionProductList } from '../components/PrecisionProductList';

export const Home = ({ onOpenDetail, onOpen3DModal }) => {
  const { filteredProducts, products: allProducts, open3DModal } = useStore();

  const products = filteredProducts.length > 0 ? filteredProducts : allProducts;

  // Flagship Hero Product
  const flagshipProduct =
    products.find((p) => p.name.includes('iPhone 16 Pro') || p.featured) ||
    products[0] || {
      id: 'flagship-default',
      name: 'iPhone 16 Pro Max',
      brand: 'Apple',
      price: 1399,
      description: 'Chasis de titanio de Grado 5 forjado a alta presión, chip A18 Pro a 3nm y cámara Fusion de 48MP.',
      specs: {
        ram: '8 GB LPDDR5X',
        almacenamiento: '512 GB',
        camara: '48 MP Fusion (f/1.78) + 48 MP Ultra Wide + 12 MP 5x Telephoto',
        bateria: '4685 mAh (33h video)',
        procesador: 'Apple A18 Pro (3nm)',
        pantalla: '6.9" Super Retina XDR OLED 120Hz',
        material: 'Titanio Grado 5',
      },
      images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1000&auto=format&fit=crop&q=90'],
      featured: true,
    };

  return (
    <div className="w-full bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 min-h-screen transition-colors">
      
      {/* 1. HERO SECTION WITH DIRECT 3D PHONE */}
      <PrecisionHero
        flagshipProduct={flagshipProduct}
        onOpen3D={onOpen3DModal || open3DModal}
        onOpenDetail={onOpenDetail}
      />

      {/* 2. VALUE PROPOSITIONS STRIP */}
      <section className="border-b border-zinc-200/80 dark:border-white/10 py-8 bg-[#F8F9FB] dark:bg-[#0A0A0D] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-[#131418] border border-zinc-200/90 dark:border-white/10 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-zinc-900 dark:text-white">Envío Asegurado</h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5 font-medium">Despacho con seguro de carga a todo el país.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-[#131418] border border-zinc-200/90 dark:border-white/10 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-zinc-900 dark:text-white">Garantía Oficial 24M</h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5 font-medium">Cobertura de fábrica y soporte de software.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-[#131418] border border-zinc-200/90 dark:border-white/10 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-zinc-900 dark:text-white">Asesoría Personalizada</h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5 font-medium">Atención uno a uno con especialistas en telefonía.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATALOG GRID & FILTER */}
      <PrecisionProductList
        products={products}
        onSelectProduct={onOpenDetail}
      />

      {/* 4. APPLE-STYLE WHATSAPP CONCIERGE BANNER */}
      <section className="border-t border-zinc-200/80 dark:border-white/10 py-16 px-4 sm:px-6 bg-[#F8F9FB] dark:bg-[#0A0A0D] transition-colors">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
            ATENCIÓN PERSONALIZADA
          </span>
          <h3
            className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white"
            style={{ fontFamily: "'Space Grotesk', -apple-system, sans-serif" }}
          >
            ¿Querés consultar stock o coordinar tu entrega?
          </h3>
          <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 max-w-lg mx-auto leading-relaxed">
            Nuestro equipo de asesores boutique está disponible para ayudarte a elegir tu equipo ideal y coordinar despacho inmediato.
          </p>
          <div className="pt-2">
            <a
              href="https://wa.me/5493416874786?text=Hola%2C%20quisiera%20consultar%20por%20un%20celular%20en%20CelStore"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-semibold text-sm transition-all shadow-md cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>Consultar por WhatsApp Business</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
