import { create } from 'zustand';

export const useTrackingStore = create((set) => ({
  isOpen: false,
  orderData: null,
  activeStep: 1, // 1 to 5
  activeTab: 'tracking', // 'tracking' | 'email' | 'invoice' | 'warranty'
  
  openTracking: (order = null) => {
    let orderToSet = order;
    if (!orderToSet && typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('celstore_last_order');
        if (saved) orderToSet = JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved order', e);
      }
    }
    
    // Default demo order if none exists
    if (!orderToSet) {
      orderToSet = {
        orderId: 'CEL-9842',
        date: new Date().toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        time: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
        customerName: 'Exequiel Echevarría',
        email: 'echevarria270@gmail.com',
        phone: '+54 9 341 687-4786',
        address: 'Bv. Oroño 1420, Piso 8',
        city: 'Rosario, Santa Fe',
        items: [
          {
            name: 'iPhone 16 Pro Max 256GB - Titanio Natural',
            price: 1399,
            qty: 1,
            color: 'Titanio Natural',
            storage: '256 GB',
          },
        ],
        subtotal: 1399,
        discount: 0,
        shipping: 0,
        total: 1399,
        paymentMethod: 'MercadoPago / Transferencia Inmediata',
        securityHash: '8f4a9b2c7e1d5a3f019482b6e8d2c4a91b8f3e7a6d5c2e1f4a9b0c2d3e4f5a6b',
      };
    }

    set({
      isOpen: true,
      orderData: orderToSet,
      activeStep: 2, // starts at packaging in demo
      activeTab: 'tracking',
    });
  },

  closeTracking: () => set({ isOpen: false }),
  setStep: (step) => set({ activeStep: step }),
  setTab: (tab) => set({ activeTab: tab }),
  nextStep: () => set((state) => ({ activeStep: Math.min(5, state.activeStep + 1) })),
  prevStep: () => set((state) => ({ activeStep: Math.max(1, state.activeStep - 1) })),
}));
