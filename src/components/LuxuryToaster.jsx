'use client';

import React from 'react';
import { Toaster, toast } from 'sonner';
import { playCartSuccess, playSubtleClick } from '../utils/audioHaptics';

export function LuxuryToaster() {
  return (
    <Toaster
      position="bottom-right"
      theme="dark"
      toastOptions={{
        style: {
          background: 'rgba(12, 12, 15, 0.92)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(197, 168, 128, 0.25)',
          color: '#f5f5f0',
          borderRadius: '16px',
          padding: '14px 18px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
          fontFamily: 'var(--font-sans)',
        },
        className: 'luxury-toast',
      }}
    />
  );
}

/**
 * Disparador de notificación con estilo de alta costura y sonido háptico
 */
export function showLuxuryNotification(title, description, icon = '✦') {
  playCartSuccess();
  toast(title, {
    description,
    icon: <span className="text-[#c5a880] text-sm">{icon}</span>,
  });
}
