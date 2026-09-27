import React from 'react';
import dynamic from 'next/dynamic';
import '@/src/index.css';
import { StoreProvider } from '@/src/context/StoreContext';
import { CartProvider } from '@/src/context/CartContext';
import { AuthProvider } from '@/src/context/AuthContext';
import { SmoothScroll } from '@/src/components/SmoothScroll';
import { LuxuryToaster } from '@/src/components/LuxuryToaster';
import { CartDrawer } from '@/src/components/CartDrawer';
import { CheckoutModal } from '@/src/components/CheckoutModal';
import { ComparisonModal } from '@/src/components/ComparisonModal';

const GoldParticles = dynamic(
  () => import('@/src/components/GoldParticles').then((m) => ({ default: m.GoldParticles })),
  { ssr: false }
);

export const metadata = {
  title: 'CELSTORE // INDUSTRIAL HARDWARE TERMINAL',
  description: 'Catálogo de hardware móvil, ingeniería en titanio forjado y archivo vintage en terminal interactiva.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0c0d10] text-[#f0f0eb] antialiased selection:bg-[#ff4800] selection:text-black">
        <StoreProvider>
          <CartProvider>
            <AuthProvider>
              <SmoothScroll>
                <div className="min-h-screen flex flex-col overflow-x-hidden relative">
                  <GoldParticles />
                  {children}
                  <CartDrawer />
                  <CheckoutModal />
                  <ComparisonModal />
                  <LuxuryToaster />
                </div>
              </SmoothScroll>
            </AuthProvider>
          </CartProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
