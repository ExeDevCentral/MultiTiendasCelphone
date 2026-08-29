'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/src/components/Navbar';
import { Footer } from '@/src/components/Footer';
import { StoreCatalog } from '@/src/views/StoreCatalog';
import { Photo3DModal } from '@/src/components/Photo3DModal';

export default function BoutiqueCatalogPage() {
  const { storeId } = useParams();
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

  return (
    <>
      <Navbar currentView="store_catalog" onNavigate={handleNavigate} />
      <main className="flex-1">
        <StoreCatalog
          storeId={storeId}
          onNavigate={handleNavigate}
          onOpenDetail={handleOpenDetail}
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
