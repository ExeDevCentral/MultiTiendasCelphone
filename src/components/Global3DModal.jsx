'use client';

import React from 'react';
import { useStore } from '../context/StoreContext';
import { Photo3DModal } from './Photo3DModal';

export const Global3DModal = () => {
  const { selected3DProduct, is3DModalOpen, close3DModal } = useStore();

  if (!is3DModalOpen || !selected3DProduct) return null;

  return (
    <Photo3DModal
      product={selected3DProduct}
      isOpen={is3DModalOpen}
      onClose={close3DModal}
    />
  );
};
