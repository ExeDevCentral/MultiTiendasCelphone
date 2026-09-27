'use client';

import React from 'react';
import { ShieldCheck, Truck, Sparkles, Lock, Terminal, Activity } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { playSubtleClick } from '../utils/audioHaptics';

export const Footer = ({ onNavigate }) => {
  const { stores, setActiveStore, setGenerationFilter } = useStore();

  const handleStoreClick = (store) => {
    playSubtleClick();
    setActiveStore(store);
    onNavigate('store_catalog', { storeId: store.id });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGenClick = (category) => {
    playSubtleClick();
    setGenerationFilter(category);
    onNavigate('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const valueProps = [
    {
      icon: ShieldCheck,
      code: 'CERT-24M',
      title: 'GARANTÍA CERTIFICADA 24M',
      text: 'Garantía oficial completa en chasis de titanio con protocolo de reemplazo exprés.',
    },
    {
      icon: Truck,
      code: 'LOG-EXPR',
      title: 'DESPACHO BLINDADO EXPRÉS',
      text: 'Packaging hermético de polímero de alta densidad con seguro total ante pérdida.',
    },
    {
      icon: Sparkles,
      code: 'GPU-3D',
      title: 'RENDER 3D VOLUMÉTRICO',
      text: 'Inspección de hardware con mapa de profundidad acelerado por GPU local.',
    },
    {
      icon: Lock,
      code: 'RLS-ATOMIC',
      title: 'STOCK ATÓMICO FOR UPDATE',
      text: 'Transacciones con bloqueo transaccional a prueba de concurrencia y fraude.',
    },
  ];

  return (
    <footer className="w-full mt-10 bg-[#07080a] border-t-2 border-[#242733] font-mono select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">

        {/* Industrial Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pb-10 border-b border-[#222530]">
          {valueProps.map((item) => (
            <div key={item.title} className="p-4 bg-[#0e1015] border border-[#232633] has-crosshairs">
              <div className="flex items-center justify-between mb-2">
                <item.icon className="w-4 h-4 text-[#ff4800]" />
                <span className="text-[9px] text-zinc-500 font-bold">[{item.code}]</span>
              </div>
              <h4 className="text-xs font-bold text-[#f0f0eb] mb-1 uppercase">
                {item.title}
              </h4>
              <p className="text-[11px] text-zinc-500 leading-relaxed font-sans">
                {item.text}
              </p>
            </div>
          ))}
        </div>

        {/* Directory Matrix */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 py-10 text-xs">
          {/* Col 1 */}
          <div className="col-span-2 lg:col-span-1 space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 bg-[#ff4800] text-black font-black text-xs">
                CELSTORE
              </span>
              <span className="text-[10px] text-zinc-500 font-bold">TE-2026 // HARDWARE</span>
            </div>
            <p className="text-[11px] text-zinc-500 font-sans leading-relaxed">
              Terminal y repositorio multi-tenant de hardware móvil avanzado, componentes de titanio y archivo histórico con bloqueo transaccional en tiempo real.
            </p>
          </div>

          {/* Col 2 */}
          <div className="space-y-2">
            <h5 className="text-[10px] font-bold text-[#ff4800] uppercase tracking-wider">// HARDWARE ERA</h5>
            <ul className="space-y-2 text-zinc-400 text-[11px]">
              <li>
                <button
                  onClick={() => handleGenClick('last_2_years')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  [01] Flagships (2024 - 2026)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleGenClick('recent_gen')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  [02] Series (2020 - 2023)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleGenClick('vintage_classic')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  [03] Vintage Archive Legends
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    playSubtleClick();
                    onNavigate('accessories');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  [04] Machined Accessories
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-2">
            <h5 className="text-[10px] font-bold text-[#ff4800] uppercase tracking-wider">// AFFILIATED NODES</h5>
            <ul className="space-y-2 text-zinc-400 text-[11px]">
              {stores.map((store, i) => (
                <li key={store.id}>
                  <button
                    onClick={() => handleStoreClick(store)}
                    className="hover:text-white transition-colors text-left cursor-pointer"
                  >
                    [{String(i + 1).padStart(2, '0')}] {store.name}
                  </button>
                </li>
              ))}
              <li className="pt-1">
                <button
                  onClick={() => {
                    playSubtleClick();
                    onNavigate('store_selector');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-[#ff4800] hover:underline font-bold text-[10px] cursor-pointer"
                >
                  VIEW NODE REGISTRY →
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-2">
            <h5 className="text-[10px] font-bold text-[#ff4800] uppercase tracking-wider">// OPERATOR ACCESS</h5>
            <ul className="space-y-2 text-zinc-400 text-[11px]">
              <li>
                <button
                  onClick={() => {
                    playSubtleClick();
                    onNavigate('admin_login');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-white hover:text-[#ff4800] font-bold transition-colors cursor-pointer flex items-center gap-1"
                >
                  [ROOT CONSOLE LOGIN] →
                </button>
              </li>
              <li>
                <span className="text-zinc-600 text-[10px] block leading-relaxed font-sans">
                  Gestión de inventario con RLS, auditoría de precios y activación de relieve GPU.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Barcode Strip */}
        <div className="w-full h-2 barcode-strip opacity-25 my-4" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 py-4 border-t border-[#1e2029] text-[10px] text-zinc-500">
          <p>© 2026 CELSTORE INDUSTRIAL // ALL HARDWARE RIGHTS RESERVED</p>
          <p className="flex items-center gap-1.5">
            ENGINEERED BY{' '}
            <a
              href="https://exepaginasweb.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#ff4800] hover:text-white transition-colors"
            >
              EXEPAGINASWEB.COM
            </a>
            <span className="text-[#ff4800]" aria-hidden="true">■</span>
          </p>
        </div>
      </div>
    </footer>
  );
};