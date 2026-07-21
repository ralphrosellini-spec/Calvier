import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '@/types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, variantId: string, color: string, colorHex: string, size: string, image: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, variantId, color, colorHex, size, image) => {
        const { items } = get();
        const existingItem = items.find(
          (item) => item.productId === product.id && item.variantId === variantId && item.size === size
        );

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === existingItem.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
            isOpen: true,
          });
        } else {
          const newItem: CartItem = {
            id: `${product.id}-${variantId}-${size}-${Date.now()}`,
            productId: product.id,
            product,
            variantId,
            color,
            colorHex,
            size,
            quantity: 1,
            price: product.price,
            image,
          };
          set({ items: [...items, newItem], isOpen: true });
        }
      },

      removeItem: (itemId) =>
        set((state) => ({ items: state.items.filter((item) => item.id !== itemId) })),

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),

      getSubtotal: () =>
        get().items.reduce((total, item) => total + item.price * item.quantity, 0),
    }),
    { name: 'cr-cart' }
  )
);
