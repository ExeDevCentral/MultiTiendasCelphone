import { useState, useEffect, useCallback, useRef } from 'react';
import * as THREE from 'three';

// Cache global en memoria para evitar descargas duplicadas de texturas
const texturePrefetchCache = new Set();

/**
 * Hook para controlar el ciclo de vida, precarga selectiva y cierre del Visor 3D.
 * Garantiza que solo exista un Canvas activo y libera memoria al cerrar.
 */
export function use3DPhotoModal() {
  const [activeProduct, setActiveProduct] = useState(null);
  const textureLoaderRef = useRef(null);

  if (!textureLoaderRef.current) {
    textureLoaderRef.current = new THREE.TextureLoader();
    textureLoaderRef.current.crossOrigin = 'anonymous';
  }

  // Prefetch de texturas solo en hover o foco
  const prefetchTextures = useCallback((product) => {
    if (!product) return;
    
    // Si tiene depth_map o photo_url listo
    const photoUrl = product.photo_url || product.image || (product.images && product.images[0]);
    const depthUrl = product.depth_map_url || product.depthMapUrl;

    [photoUrl, depthUrl].forEach((url) => {
      if (url && !texturePrefetchCache.has(url)) {
        texturePrefetchCache.add(url);
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = url;
      }
    });
  }, []);

  const openModal = useCallback((product) => {
    if (product) {
      prefetchTextures(product);
      setActiveProduct(product);
    }
  }, [prefetchTextures]);

  const closeModal = useCallback(() => {
    setActiveProduct(null);
  }, []);

  // Bloqueo de scroll y listener de Escape
  useEffect(() => {
    if (!activeProduct) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeProduct, closeModal]);

  return {
    isOpen: !!activeProduct,
    activeProduct,
    openModal,
    closeModal,
    prefetchTextures,
  };
}
