'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/src/context/StoreContext';
import { Navbar } from '@/src/components/Navbar';
import { Footer } from '@/src/components/Footer';
import { ProductDetail } from '@/src/views/ProductDetail';
import { Photo3DModal } from '@/src/components/Photo3DModal';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { products, loading } = useStore();
  const [preview3DProduct, setPreview3DProduct] = useState(null);

  const product = products.find((p) => p.id === id);

  const handleNavigate = (view, params = {}) => {
    if (view === 'accessories') router.push('/accessories');
    else if (view === 'store_selector') router.push('/boutiques');
    else if (view === 'store_catalog' && params.storeId) router.push(`/boutiques/${params.storeId}`);
    else if (view === 'admin_login') router.push('/admin/login');
    else if (view === 'admin_dashboard') router.push('/admin/dashboard');
    else router.push('/');
  };

  if (loading) {
    return (
      <>
        <Navbar currentView="home" onNavigate={handleNavigate} />
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
          <div className="w-8 h-8 border-2 border-[#c9a227] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-[#8b8680] uppercase tracking-widest">Cargando pieza de alta gama...</p>
        </div>
        <Footer onNavigate={handleNavigate} />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar currentView="home" onNavigate={handleNavigate} />
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-6">
          <h2 className="text-2xl font-bold text-[#f3efe6]">Pieza no encontrada en el Atelier</h2>
          <p className="text-xs text-[#8b8680] max-w-md">El modelo solicitado no está disponible o ha sido retirado del catálogo activo.</p>
          <button
            type="button"
            onClick={() => router.push('/')}
            className="px-6 py-2.5 rounded-xl bg-[#c9a227] text-[#0a0a0c] font-bold text-xs uppercase tracking-wider"
          >
            Volver a la Colección
          </button>
        </div>
        <Footer onNavigate={handleNavigate} />
      </>
    );
  }

  return (
    <>
      <Navbar currentView="home" onNavigate={handleNavigate} />
      <main className="flex-1">
        <ProductDetail
          product={product}
          onBack={() => router.push('/')}
          onNavigate={handleNavigate}
          onOpen3DModal={(p) => setPreview3DProduct(p)}
        />
      </main>
      <Footer onNavigate={handleNavigate} />

      {preview3DProduct && (
        <Photo3DModal
          product={preview3DProduct}
          onClose={() => setPreview3DProduct(null)}
        />
      )}
    </>
  );
}
