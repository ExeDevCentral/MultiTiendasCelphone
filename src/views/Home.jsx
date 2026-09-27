'use client';

import React from 'react';
import { useStore } from '../context/StoreContext';
import { PrecisionHero } from '../components/PrecisionHero';
import { PrecisionProductList } from '../components/PrecisionProductList';
import { Truck, ShieldCheck, Activity, MessageCircle } from 'lucide-react';

export const Home = ({ onNavigate, onOpenDetail, onOpen3DModal }) => {
  const { products } = useStore();

  // Find flagship or default
  const flagshipProduct = products.find((p) => p.id === 'prod-iphone-16-pro-max') ||
    products[0] || {
      id: 'prod-iphone-16-pro-max',
      name: 'iPhone 16 Pro Max',
      brand: 'Apple',
      model: 'A3296',
      price: 1399.0,
      stock: 14,
      description: 'Chasis de titanio Grado 5 forjado a alta presión. Arquitectura A18 Pro a 3nm y botón de control de cámara táctil.',
      specs: {
        ram: '8 GB LPDDR5X',
        almacenamiento: '512 GB NVMe',
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
    <div className="w-full bg-[#0E0E10] text-[#F5F5F7] min-h-screen">
      {/* 1. TOP DATASHEET STATUS BAR */}
      <section className="bg-[#0A0A0C] border-b border-[#1A1A1D] px-4 sm:px-6 lg:px-8 py-2 text-[11px] font-mono text-[#71717A]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF] animate-pulse" />
            <span className="text-[#F5F5F7] font-bold">CELSTORE // PRECISION HARDWARE STORE</span>
            <span className="text-zinc-600">•</span>
            <span className="text-[#71717A] hidden sm:inline">DESPACHO INMEDIATO CON SEGURO DE CARGA</span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-[10px] tabular-nums">
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#0066FF]" />
              ENVÍO BLINDADO PRIORITARIO
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0066FF]" />
              GARANTÍA OFICIAL 24 MESES
            </span>
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#0066FF]" />
              STOCK VERIFICADO EN VIVO
            </span>
          </div>
        </div>
      </section>

      {/* 2. PRECISION HERO (60% Viewport, 3/4 Angle Phone, Floating Specs) */}
      <PrecisionHero
        flagshipProduct={flagshipProduct}
        onOpen3D={onOpen3DModal}
        onOpenDetail={onOpenDetail}
      />

      {/* 3. ASYMMETRIC CATALOG GRID & FILTER SHEET */}
      <PrecisionProductList
        products={products}
        onSelectProduct={onOpenDetail}
      />

      {/* 4. WHATSAPP COORDINATION BAR */}
      <section className="border-t border-[#1A1A1D] bg-[#0A0A0C] py-12 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-3 font-mono">
          <span className="text-[10px] text-[#0066FF] font-bold uppercase tracking-wider block">
            // PEDIDOS PERSONALIZADOS & COORDINACIÓN
          </span>
          <h3
            className="text-xl sm:text-2xl font-bold text-[#F5F5F7] uppercase"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            ¿Querés consultar stock en tiempo real o coordinar envío?
          </h3>
          <p className="text-xs text-[#71717A] max-w-lg mx-auto font-sans leading-relaxed">
            Atención directa vía WhatsApp Business con un asesor técnico. Realizá tu reserva de equipo y coordiná el método de entrega de forma personalizada.
          </p>
          <div className="pt-2">
            <a
              href="https://wa.me/5493416874786?text=Hola%2C%20quisiera%20consultar%20por%20un%20celular%20en%20CelStore"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0066FF] hover:bg-[#0052cc] text-[#F5F5F7] font-mono font-bold text-xs uppercase transition-all shadow-sm cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>CONSULTAR POR WHATSAPP BUSINESS</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
