'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/src/components/Navbar';
import { Footer } from '@/src/components/Footer';
import { StoreSelector } from '@/src/views/StoreSelector';

export default function BoutiquesPage() {
  const router = useRouter();

  const handleNavigate = (view, params = {}) => {
    if (view === 'accessories') router.push('/accessories');
    else if (view === 'store_selector') router.push('/boutiques');
    else if (view === 'store_catalog' && params.storeId) router.push(`/boutiques/${params.storeId}`);
    else if (view === 'admin_login') router.push('/admin/login');
    else if (view === 'admin_dashboard') router.push('/admin/dashboard');
    else router.push('/');
  };

  return (
    <>
      <Navbar currentView="store_selector" onNavigate={handleNavigate} />
      <main className="flex-1">
        <StoreSelector onNavigate={handleNavigate} />
      </main>
      <Footer onNavigate={handleNavigate} />
    </>
  );
}
