import React from 'react';
import dynamic from 'next/dynamic';
import '@/src/index.css';
import { StoreProvider } from '@/src/context/StoreContext';
import { CartProvider } from '@/src/context/CartContext';
import { AuthProvider } from '@/src/context/AuthContext';
import { ThemeProvider } from '@/src/context/ThemeContext';
import { SmoothScroll } from '@/src/components/SmoothScroll';
import { LuxuryToaster } from '@/src/components/LuxuryToaster';
import { CartDrawer } from '@/src/components/CartDrawer';
import { CheckoutModal } from '@/src/components/CheckoutModal';
import { ComparisonModal } from '@/src/components/ComparisonModal';
import { OrderTrackerModal } from '@/src/components/OrderTrackerModal';
import { Global3DModal } from '@/src/components/Global3DModal';

const GoldParticles = dynamic(
  () => import('@/src/components/GoldParticles').then((m) => ({ default: m.GoldParticles })),
  { ssr: false }
);

export const metadata = {
  title: 'CelStore — Boutique Oficial de Smartphones & Flagships',
  description: 'Colección curada de smartphones de alta gama, chasis en titanio forjado y visor 3D interactivo.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#FFFFFF] text-[#1D1D1F] dark:bg-[#000000] dark:text-[#F5F5F7] antialiased selection:bg-[#0071E3] selection:text-white transition-colors duration-200">
        <ThemeProvider>
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
                    <OrderTrackerModal />
                    <Global3DModal />
                    <LuxuryToaster />
                  </div>
                </SmoothScroll>
              </AuthProvider>
            </CartProvider>
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
