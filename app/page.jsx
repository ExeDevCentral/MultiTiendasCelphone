'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/src/components/Navbar';
import { Footer } from '@/src/components/Footer';
import { Home } from '@/src/views/Home';
import { Photo3DModal } from '@/src/components/Photo3DModal';

export default function HomePage() {
  const router = useRouter();
  const [preview3DProduct, setPreview3DProduct] = useState(null);

  const handleNavigate = (view, params = {}) => {
    if (view === 'accessories') router.push('/accessories');
    else if (view === 'store_selector') router.push('/boutiques');
    else if (view === 'store_catalog' && params.storeId) router.push(`/boutiques/${params.storeId}`);
    else if (view === 'admin_login') router.push('/admin/login');
    else if (view === 'admin_dashboard') router.push('/admin/dashboard');
    else router.push('/');
  };

  const handleOpenDetail = (product) => {
    router.push(`/product/${product.id}`);
  };

  const handleOpen3DModal = (product) => {
    setPreview3DProduct(product);
  };

  return (
    <>
      <Navbar currentView="home" onNavigate={handleNavigate} />
      <main className="flex-1">
        <Home
          onNavigate={handleNavigate}
          onOpenDetail={handleOpenDetail}
          onOpen3DModal={handleOpen3DModal}
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
