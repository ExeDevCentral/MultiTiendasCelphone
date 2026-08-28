import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, Store, KeyRound, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminLogin = ({ onNavigate }) => {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('admin@celstore.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      onNavigate('admin_dashboard');
    } catch (err) {
      setError(err.message || 'Credenciales inválidas');
    }
  };

  const fillCredentials = (storeEmail, storePassword) => {
    setEmail(storeEmail);
    setPassword(storePassword);
    setError(null);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="rounded-3xl glass-panel border border-white/15 p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 mx-auto shadow-lg shadow-emerald-600/30 flex items-center justify-center">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Portal de Tiendas & Admin</h2>
          <p className="text-xs text-neutral-400">
            Inicia sesión para gestionar el catálogo, precios, textos de soluciones y stock de tu sucursal.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-neutral-400 font-semibold block mb-1.5">
              Correo del Administrador
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-900 border border-white/10 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                placeholder="admin@tienda.com"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-neutral-400 font-semibold block mb-1.5">
              Contraseña de Acceso
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-900 border border-white/10 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02]"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Ingresar al Panel de Tienda</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* 1-Click Fast Credentials for Demo Testing */}
        <div className="pt-4 border-t border-white/10 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block text-center">
            🚀 Cuentas de Demostración (1 Clic):
          </span>
          <div className="space-y-1.5 text-[11px]">
            <button
              onClick={() => fillCredentials('admin@celstore.com', 'password123')}
              className="w-full text-left p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 flex items-center justify-between text-neutral-300 transition-colors"
            >
              <span>📱 Tienda 1: <strong>CelStore Flagships</strong></span>
              <span className="text-blue-400 font-mono">Usar</span>
            </button>

            <button
              onClick={() => fillCredentials('admin@retromobile.com', 'password123')}
              className="w-full text-left p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 flex items-center justify-between text-neutral-300 transition-colors"
            >
              <span>📟 Tienda 2: <strong>RetroMobile Vault</strong></span>
              <span className="text-amber-400 font-mono">Usar</span>
            </button>

            <button
              onClick={() => fillCredentials('admin@technova.com', 'password123')}
              className="w-full text-left p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 flex items-center justify-between text-neutral-300 transition-colors"
            >
              <span>⚡ Tienda 3: <strong>TechNova MegaStore</strong></span>
              <span className="text-emerald-400 font-mono">Usar</span>
            </button>

            <button
              onClick={() => fillCredentials('superadmin@platform.com', 'admin123')}
              className="w-full text-left p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 flex items-center justify-between text-neutral-300 transition-colors"
            >
              <span>👑 SuperAdmin Global (Todas las tiendas)</span>
              <span className="text-purple-400 font-mono">Usar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
