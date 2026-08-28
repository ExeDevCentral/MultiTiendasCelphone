import React from 'react';
import { Smartphone, ShieldCheck, Truck, RefreshCw, MessageSquare, Heart, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Footer = ({ onNavigate }) => {
  const { stores, setActiveStore, setGenerationFilter } = useStore();

  const handleStoreClick = (store) => {
    setActiveStore(store);
    onNavigate('store_catalog', { storeId: store.id });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGenClick = (category) => {
    setGenerationFilter(category);
    onNavigate('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-neutral-950 border-t border-white/10 text-neutral-400 text-xs pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Value Proposition Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 border-b border-white/10 text-neutral-300">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Garantía Certificada</h4>
              <p className="text-xs text-neutral-400">
                1 año oficial en flagships nuevos y 6 meses en modelos vintage restaurados.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Envío Express Seguro</h4>
              <p className="text-xs text-neutral-400">
                Despacho prioritario en 24h con seguro contra siniestros y tracking GPS.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Visor 3D Interactivo</h4>
              <p className="text-xs text-neutral-400">
                Inspecciona cada detalle en 360° antes de comprar tu próximo teléfono.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Atención WhatsApp 1-a-1</h4>
              <p className="text-xs text-neutral-400">
                Asesoramiento personalizado directamente con los dueños de cada sucursal.
              </p>
            </div>
          </div>
        </div>

        {/* Directory Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & MultiTiendas Info */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                <Smartphone className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-white text-base">CelStore™</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              La primera plataforma de comercio móvil multi-tienda que conecta generaciones: desde los últimos lanzamientos de titanio hasta las leyendas de colección de los 2000s.
            </p>
          </div>

          {/* Col 2: Generational Directory */}
          <div className="space-y-2.5">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">Generaciones</h5>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleGenClick('last_2_years')}
                  className="hover:text-white transition-colors"
                >
                  🚀 Últimos 2 Años (2024 - 2026)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleGenClick('recent_gen')}
                  className="hover:text-white transition-colors"
                >
                  ⏳ Generaciones Recientes (2020 - 2023)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleGenClick('vintage_classic')}
                  className="hover:text-white transition-colors"
                >
                  📟 Clásicos & Vintage Legends
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onNavigate('accessories'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors"
                >
                  ⚡ Mini-Tienda de Accesorios
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Sucursales Afiliadas */}
          <div className="space-y-2.5">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">Nuestras Sucursales</h5>
            <ul className="space-y-2">
              {stores.map((store) => (
                <li key={store.id}>
                  <button
                    onClick={() => handleStoreClick(store)}
                    className="hover:text-blue-400 transition-colors text-left"
                  >
                    🏬 {store.name}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => { onNavigate('store_selector'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="text-blue-400 hover:underline"
                >
                  Ver todas las tiendas →
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Dueños de Tienda & Admin */}
          <div className="space-y-2.5">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">Comerciantes & Tiendas</h5>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => { onNavigate('admin_login'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
                >
                  🔒 Portal de Acceso para Tiendas
                </button>
              </li>
              <li>
                <span className="text-neutral-500 text-[11px]">
                  Administra tu base de datos, carga productos nuevos o vintage y sincroniza tus ventas por WhatsApp.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <p>© {new Date().getFullYear()} CelStore MultiTiendas Inc. Todos los derechos reservados.</p>
          <div className="flex items-center gap-1 text-neutral-400">
            <span>Diseñado con estética Apple SF Pro</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
