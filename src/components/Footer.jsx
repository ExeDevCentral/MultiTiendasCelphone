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
      text: 'Packaging hermético con seguro total de carga asegurada ante pérdida.',
    },
    {
      icon: Sparkles,
      code: 'GPU-3D',
      title: 'INSPECCIÓN EN TIEMPO REAL',
      text: 'Inspección técnica de hardware con mapa de profundidad en GPU.',
    },
    {
      icon: Lock,
      code: 'RLS-ATOMIC',
      title: 'MODO PRUEBA & LOCAL-FIRST',
      text: 'Navegación y carrito sin consumir cuotas de Supabase ni llamadas innecesarias.',
    },
  ];

  return (
    <footer className="w-full mt-10 bg-[#0A0A0C] border-t border-[#1A1A1D] font-mono select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">

        {/* Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pb-10 border-b border-[#1A1A1D]">
          {valueProps.map((item) => (
            <div key={item.title} className="p-4 bg-[#0E0E10] border border-[#1A1A1D]">
              <div className="flex items-center justify-between mb-2">
                <item.icon className="w-4 h-4 text-[#0066FF]" />
                <span className="text-[9px] text-[#71717A] font-bold">[{item.code}]</span>
              </div>
              <h4 className="text-xs font-bold text-[#F5F5F7] mb-1 uppercase">
                {item.title}
              </h4>
              <p className="text-[11px] text-[#71717A] leading-relaxed font-sans">
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
              <span className="px-1.5 py-0.5 bg-[#0066FF] text-[#F5F5F7] font-bold text-xs">
                CELSTORE
              </span>
              <span className="text-[10px] text-[#71717A] font-bold">PRECISION // HARDWARE</span>
            </div>
            <p className="text-[11px] text-[#71717A] font-sans leading-relaxed">
              Catálogo técnico de smartphones de alta gama, componentes mecanizados en titanio y archivo histórico con stock local en tiempo real.
            </p>
          </div>

          {/* Col 2 */}
          <div className="space-y-2">
            <h5 className="text-[10px] font-bold text-[#0066FF] uppercase tracking-wider">// GENERACIONES</h5>
            <ul className="space-y-2 text-[#71717A] text-[11px]">
              <li>
                <button
                  onClick={() => handleGenClick('last_2_years')}
                  className="hover:text-[#F5F5F7] transition-colors cursor-pointer"
                >
                  [01] Flagships (2024 - 2026)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleGenClick('recent_gen')}
                  className="hover:text-[#F5F5F7] transition-colors cursor-pointer"
                >
                  [02] Series (2020 - 2023)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleGenClick('vintage_classic')}
                  className="hover:text-[#F5F5F7] transition-colors cursor-pointer"
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
                  className="hover:text-[#F5F5F7] transition-colors cursor-pointer"
                >
                  [04] Accesorios & MagSafe
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-2">
            <h5 className="text-[10px] font-bold text-[#0066FF] uppercase tracking-wider">// BOUTIQUES</h5>
            <ul className="space-y-2 text-[#71717A] text-[11px]">
              {stores.map((store, i) => (
                <li key={store.id}>
                  <button
                    onClick={() => handleStoreClick(store)}
                    className="hover:text-[#F5F5F7] transition-colors text-left cursor-pointer"
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
                  className="text-[#0066FF] hover:underline font-bold text-[10px] cursor-pointer"
                >
                  VER TODAS LAS BOUTIQUES →
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-2">
            <h5 className="text-[10px] font-bold text-[#0066FF] uppercase tracking-wider">// OPERADOR & MODO PRUEBA</h5>
            <ul className="space-y-2 text-[#71717A] text-[11px]">
              <li>
                <button
                  onClick={() => {
                    playSubtleClick();
                    onNavigate('admin_login');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-[#F5F5F7] hover:text-[#0066FF] font-bold transition-colors cursor-pointer flex items-center gap-1"
                >
                  [CONSOLA DE ADMINISTRADOR] →
                </button>
              </li>
              <li>
                <span className="text-[#71717A] text-[10px] block leading-relaxed font-sans">
                  Gestión de inventario local, simulación de órdenes y panel de pedidos sin gastar recursos cloud.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 py-4 border-t border-[#1A1A1D] text-[10px] text-[#71717A]">
          <p>© 2026 CELSTORE PRECISION // TODOS LOS DERECHOS RESERVADOS</p>
          <p className="flex items-center gap-1.5">
            DESARROLLADO POR{' '}
            <a
              href="https://exepaginasweb.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#0066FF] hover:text-[#F5F5F7] transition-colors"
            >
              EXEPAGINASWEB.COM
            </a>
            <span className="text-[#0066FF]" aria-hidden="true">■</span>
          </p>
        </div>
      </div>
    </footer>
  );
};