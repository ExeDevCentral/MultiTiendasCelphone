import React from 'react';
import '@/src/index.css';
import { StoreProvider } from '@/src/context/StoreContext';
import { CartProvider } from '@/src/context/CartContext';
import { AuthProvider } from '@/src/context/AuthContext';
import { SmoothScroll } from '@/src/components/SmoothScroll';
import { LuxuryToaster } from '@/src/components/LuxuryToaster';
import { CartDrawer } from '@/src/components/CartDrawer';
import { CheckoutModal } from '@/src/components/CheckoutModal';
import { ComparisonModal } from '@/src/components/ComparisonModal';

export const metadata = {
  title: 'CelStore — Atelier Generacional & 3D Studio',
  description: 'Plataforma multi-tienda de smartphones de alta gama y leyendas vintage en 3D interactivo.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400;1,600&family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0a0a0c] text-[#f3efe6] antialiased selection:bg-[#c9a227] selection:text-black">
        <StoreProvider>
          <CartProvider>
            <AuthProvider>
              <SmoothScroll>
                <div className="min-h-screen flex flex-col overflow-x-hidden">
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
