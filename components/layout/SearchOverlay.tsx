'use client';

import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, X, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import { useUIStore } from '@/store/useUIStore';
import { useSearchStore } from '@/store/useSearchStore';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';

const TRENDING_SEARCHES = [
  'Evening Gowns', 'Cashmere', 'Leather Tote', 'Silk Dress', 'Oxford Shoes', 'Linen Blazer',
];

export function SearchOverlay() {
  const { isSearchOpen, closeSearch } = useUIStore();
  const { query, results, recentSearches, isLoading, setQuery, clearQuery, addRecentSearch, removeRecentSearch } = useSearchStore();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      clearQuery();
    }
  }, [isSearchOpen, clearQuery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSearch();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeSearch]);

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      addRecentSearch(searchQuery);
      closeSearch();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-lg"
            onClick={closeSearch}
          />

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed top-0 left-0 right-0 z-50 bg-[#0c0c0c] border-b border-white/10 shadow-2xl"
          >
            {/* Search Input */}
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-4 py-6">
              <div className="flex items-center gap-4">
                <Search size={20} className="text-white/30 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for collections, styles, items..."
                  className="flex-1 bg-transparent text-white text-lg placeholder:text-white/25 focus:outline-none tracking-wide"
                />
                {query && (
                  <button type="button" onClick={clearQuery} className="text-white/30 hover:text-white transition-colors">
                    <X size={18} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={closeSearch}
                  className="text-white/50 hover:text-white transition-colors ml-2 text-[10px] tracking-[0.2em] uppercase border border-white/20 px-3 py-1.5"
                >
                  Close
                </button>
              </div>
            </form>

            {/* Results */}
            <div className="max-w-3xl mx-auto px-4 pb-8">
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex gap-3 animate-pulse">
                      <div className="w-16 h-16 bg-white/5 rounded" />
                      <div className="flex-1 space-y-2 py-1">
                        <div className="h-3 bg-white/5 rounded w-3/4" />
                        <div className="h-2 bg-white/5 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : query && results.length > 0 ? (
                <div>
                  <p className="text-[10px] tracking-[0.25em] text-white/30 uppercase mb-4">
                    {results.length} Results
                  </p>
                  <div className="space-y-1">
                    {results.map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.slug}`}
                        onClick={() => { addRecentSearch(query); closeSearch(); }}
                        className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-sm transition-colors group"
                      >
                        <div className="relative w-14 h-14 bg-white/5 rounded overflow-hidden flex-shrink-0">
                          <Image
                            src={product.variants[0]?.images[0] || ''}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate group-hover:text-cr-gold transition-colors">
                            {product.name}
                          </p>
                          <p className="text-white/40 text-xs mt-0.5">{product.category}</p>
                        </div>
                        <p className="text-white/60 text-sm font-light">{formatPrice(product.price)}</p>
                        <ArrowRight size={14} className="text-white/20 group-hover:text-cr-gold transition-colors" />
                      </Link>
                    ))}
                  </div>
                  <Link
                    href={`/search?q=${encodeURIComponent(query)}`}
                    onClick={() => { addRecentSearch(query); closeSearch(); }}
                    className="mt-4 flex items-center gap-2 text-cr-gold text-[11px] tracking-[0.2em] uppercase hover:underline"
                  >
                    View all results for &quot;{query}&quot; <ArrowRight size={12} />
                  </Link>
                </div>
              ) : query && results.length === 0 && !isLoading ? (
                <div className="text-center py-8">
                  <p className="text-white/40 text-sm">No results for &quot;<span className="text-white">{query}</span>&quot;</p>
                  <p className="text-white/25 text-xs mt-2">Try searching for dresses, suits, bags, or shoes</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {/* Recent Searches */}
                  {recentSearches.length > 0 && (
                    <div>
                      <p className="text-[10px] tracking-[0.25em] text-white/30 uppercase mb-4 flex items-center gap-2">
                        <Clock size={12} /> Recent Searches
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((s) => (
                          <button
                            key={s}
                            onClick={() => { setQuery(s); }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/25 text-[11px] tracking-wide transition-colors rounded-sm group"
                          >
                            {s}
                            <X
                              size={10}
                              className="opacity-0 group-hover:opacity-100"
                              onClick={(e) => { e.stopPropagation(); removeRecentSearch(s); }}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Trending */}
                  <div>
                    <p className="text-[10px] tracking-[0.25em] text-white/30 uppercase mb-4 flex items-center gap-2">
                      <TrendingUp size={12} /> Trending Now
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {TRENDING_SEARCHES.map((s) => (
                        <button
                          key={s}
                          onClick={() => setQuery(s)}
                          className="px-3 py-1.5 bg-white/5 border border-white/10 text-white/60 hover:text-cr-gold hover:border-cr-gold/30 text-[11px] tracking-wide transition-colors rounded-sm"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
