'use client';

import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, Store, KeyRound, AlertCircle, Terminal, Zap, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { playSubtleClick } from '../utils/audioHaptics';

export const AdminLogin = ({ onNavigate }) => {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('admin@celstore.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    playSubtleClick();
    setError(null);
    try {
      await login(email, password);
      onNavigate('admin_dashboard');
    } catch (err) {
      setError(err.message || 'Credenciales inválidas');
    }
  };

  const handleInstantDemoLogin = async (demoEmail, demoPass) => {
    playSubtleClick();
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
    try {
      await login(demoEmail, demoPass);
      onNavigate('admin_dashboard');
    } catch (err) {
      setError(err.message || 'Error en inicio demo');
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-16 font-mono">
      {/* Precision Hardware Console Container */}
      <div className="bg-[#0E0E10] border border-[#1A1A1D] p-6 sm:p-8 space-y-6 relative shadow-2xl">
        
        {/* Terminal Header Telemetry */}
        <div className="flex items-center justify-between border-b border-[#1A1A1D] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 bg-[#0066FF] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#F5F5F7]">
              TERMINAL // ACCESO ADMINISTRATIVO
            </span>
          </div>
          <span className="text-[10px] text-[#71717A] bg-[#141416] px-2 py-0.5 border border-[#1A1A1D]">
            MODO PRUEBA (0 QUOTA)
          </span>
        </div>

        {/* Security / Test Mode Notice */}
        <div className="p-3 bg-[#141416] border border-[#1A1A1D] flex items-start gap-3">
          <Terminal className="w-4 h-4 text-[#0066FF] shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed text-[#71717A]">
            <strong className="text-[#F5F5F7]">AMBIENTE DE SIMULACIÓN ACTIVO:</strong> Podés acceder directamente con 1 clic para inspeccionar catálogo, pedidos y stock sin requerir conexión a base de datos de producción.
          </div>
        </div>

        {/* Quick Demo Instant Access Buttons */}
        <div className="space-y-2">
          <div className="text-[10px] uppercase tracking-widest text-[#71717A] font-bold">
            // ACCESO RÁPIDO 1-CLIC (MODO DEMOSTRACIÓN)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleInstantDemoLogin('admin@celstore.com', 'admin123')}
              className="p-3 bg-[#141416] hover:bg-[#1E1E22] border border-[#1A1A1D] hover:border-[#0066FF] text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs font-bold text-[#F5F5F7]">
                <span>[ 01: SUPERADMIN ]</span>
                <Zap className="w-3.5 h-3.5 text-[#0066FF] group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-[10px] text-[#71717A] mt-1">Control maestro de todas las boutiques</div>
            </button>

            <button
              type="button"
              onClick={() => handleInstantDemoLogin('palermo@celstore.com', 'admin123')}
              className="p-3 bg-[#141416] hover:bg-[#1E1E22] border border-[#1A1A1D] hover:border-[#0066FF] text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs font-bold text-[#F5F5F7]">
                <span>[ 02: GERENTE SUCURSAL ]</span>
                <Store className="w-3.5 h-3.5 text-[#0066FF] group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-[10px] text-[#71717A] mt-1">Boutique Palermo Flagship</div>
            </button>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#1A1A1D]" />
          </div>
          <span className="relative bg-[#0E0E10] px-3 text-[10px] uppercase text-[#71717A]">
            O INGRESO MANUAL CON CREDENCIALES
          </span>
        </div>

        {error && (
          <div className="p-3 bg-[#141416] border border-[#FF3B30] text-[#FF3B30] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] text-[#71717A] uppercase font-bold block mb-1">
              [USUARIO / CORREO]
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#141416] border border-[#1A1A1D] focus:border-[#0066FF] px-3 py-2.5 text-xs text-[#F5F5F7] placeholder-[#71717A] outline-none transition-colors"
                placeholder="admin@celstore.com"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-[#71717A] uppercase font-bold block mb-1">
              [CONTRASEÑA DE TERMINAL]
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#141416] border border-[#1A1A1D] focus:border-[#0066FF] px-3 py-2.5 text-xs text-[#F5F5F7] placeholder-[#71717A] outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#0066FF] hover:bg-[#0052cc] text-[#F5F5F7] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all active:translate-y-[1px]"
          >
            {loading ? (
              <span className="animate-pulse">[ AUTENTICANDO CONSOLA... ]</span>
            ) : (
              <>
                <span>[ INICIAR SESIÓN EN TERMINAL ]</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="border-t border-[#1A1A1D] pt-3 text-center">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="text-[10px] text-[#71717A] hover:text-[#F5F5F7] underline transition-colors cursor-pointer"
          >
            ← VOLVER AL CATÁLOGO PÚBLICO
          </button>
        </div>
      </div>
    </div>
  );
};
