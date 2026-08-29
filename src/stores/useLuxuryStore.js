import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Store atómico con Zustand para preferencias de experiencia de lujo,
 * configuración háptica, vista de showroom y favoritos.
 */
export const useLuxuryStore = create()(
  persist(
    (set, get) => ({
      soundEnabled: true,
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      
      depthIntensity: 0.38,
      setDepthIntensity: (val) => set({ depthIntensity: val }),

      activeShowroomMode: '3d_spatial', // '3d_spatial' | 'studio_pbr'
      setShowroomMode: (mode) => set({ activeShowroomMode: mode }),

      savedProducts: [],
      toggleSaveProduct: (productId) =>
        set((state) => {
          const exists = state.savedProducts.includes(productId);
          return {
            savedProducts: exists
              ? state.savedProducts.filter((id) => id !== productId)
              : [...state.savedProducts, productId],
          };
        }),
    }),
    {
      name: 'celstore-luxury-preferences',
    }
  )
);
