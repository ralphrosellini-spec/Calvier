import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistState {
  items: string[]; // product IDs
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  toggleItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (productId) => {
        const { items } = get();
        if (!items.includes(productId)) {
          set({ items: [...items, productId] });
        }
      },

      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((id) => id !== productId) })),

      toggleItem: (productId) => {
        const { items, addItem, removeItem } = get();
        if (items.includes(productId)) {
          removeItem(productId);
        } else {
          addItem(productId);
        }
      },

      isInWishlist: (productId) => get().items.includes(productId),

      clearWishlist: () => set({ items: [] }),
    }),
    { name: 'cr-wishlist' }
  )
);
