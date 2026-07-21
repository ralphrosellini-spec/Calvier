import { create } from 'zustand';
import type { Product } from '@/types';
import { getProducts } from '@/lib/firebase-db';

interface SearchState {
  query: string;
  results: Product[];
  recentSearches: string[];
  isLoading: boolean;
  setQuery: (query: string) => void;
  search: (query: string) => void;
  clearQuery: () => void;
  addRecentSearch: (query: string) => void;
  removeRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  query: '',
  results: [],
  recentSearches: ['Evening Gowns', 'Cashmere Overcoat', 'Leather Tote', 'Silk Dress'],
  isLoading: false,

  setQuery: (query) => {
    set({ query });
    if (query.trim().length > 1) {
      get().search(query);
    } else {
      set({ results: [] });
    }
  },

  search: async (query) => {
    set({ isLoading: true });
    try {
      const lowerQuery = query.toLowerCase();
      const allProducts = await getProducts();
      const results = allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.category.toLowerCase().includes(lowerQuery) ||
          p.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
          p.shortDescription.toLowerCase().includes(lowerQuery)
      ).slice(0, 8);
      set({ results, isLoading: false });
    } catch (error) {
      console.error('Search error:', error);
      set({ results: [], isLoading: false });
    }
  },

  clearQuery: () => set({ query: '', results: [] }),

  addRecentSearch: (query) => {
    const { recentSearches } = get();
    const filtered = recentSearches.filter((s) => s !== query);
    set({ recentSearches: [query, ...filtered].slice(0, 8) });
  },

  removeRecentSearch: (query) =>
    set((state) => ({
      recentSearches: state.recentSearches.filter((s) => s !== query),
    })),

  clearRecentSearches: () => set({ recentSearches: [] }),
}));
