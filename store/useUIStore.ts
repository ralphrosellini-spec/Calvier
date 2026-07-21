import { create } from 'zustand';

interface UIState {
  // Modals
  isSearchOpen: boolean;
  isMobileMenuOpen: boolean;
  isQuickViewOpen: boolean;
  quickViewProductId: string | null;

  // Theme
  theme: 'light' | 'dark';

  // Currency & Language
  currency: string;
  language: string;

  // Loading
  isPageLoading: boolean;

  // Actions
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleMobileMenu: () => void;
  openQuickView: (productId: string) => void;
  closeQuickView: () => void;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setCurrency: (currency: string) => void;
  setLanguage: (language: string) => void;
  setPageLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSearchOpen: false,
  isMobileMenuOpen: false,
  isQuickViewOpen: false,
  quickViewProductId: null,
  theme: 'dark',
  currency: 'USD',
  language: 'en',
  isPageLoading: false,

  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),

  openMobileMenu: () => set({ isMobileMenuOpen: true }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),

  openQuickView: (productId) => set({ isQuickViewOpen: true, quickViewProductId: productId }),
  closeQuickView: () => set({ isQuickViewOpen: false, quickViewProductId: null }),

  toggleTheme: () =>
    set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
  setTheme: (theme) => set({ theme }),

  setCurrency: (currency) => set({ currency }),
  setLanguage: (language) => set({ language }),
  setPageLoading: (isPageLoading) => set({ isPageLoading }),
}));
