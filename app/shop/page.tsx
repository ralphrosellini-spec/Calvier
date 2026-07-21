'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, ChevronDown, Check } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { getProducts } from '@/lib/firebase-db';
import type { Product, Gender } from '@/types';
import { SORT_OPTIONS, COLORS, PRODUCT_SIZES } from '@/constants';
import { sortProducts, cn } from '@/lib/utils';

import { useSearchParams } from 'next/navigation';

export default function ShopPage() {
  const searchParams = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<Gender[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then(data => {
      setAllProducts(data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  // Extract unique categories from products
  const categories = useMemo(() => {
    const cats = new Set<string>();
    allProducts.forEach(p => cats.add(p.category));
    return Array.from(cats);
  }, [allProducts]);

  // Filter products
  const filteredProducts = useMemo(() => {
    let result = allProducts;

    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }

    if (selectedGenders.length > 0) {
      result = result.filter(p => selectedGenders.includes(p.gender));
    }

    if (selectedColors.length > 0) {
      result = result.filter(p => p.variants.some(v => selectedColors.includes(v.color)));
    }

    if (selectedSizes.length > 0) {
      result = result.filter(p => p.variants.some(v => v.sizes.some(s => selectedSizes.includes(s.size) && s.stock > 0)));
    }

    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    const filterParam = searchParams.get('filter');
    if (filterParam === 'new') result = result.filter(p => p.isNewArrival);
    if (filterParam === 'sale') result = result.filter(p => p.discount && p.discount > 0);
    if (filterParam === 'limited') result = result.filter(p => p.isLimitedEdition);
    if (filterParam === 'featured') result = result.filter(p => p.isFeatured);

    return sortProducts(result, sortBy);
  }, [allProducts, selectedCategories, selectedGenders, selectedColors, selectedSizes, priceRange, sortBy, searchParams]);

  const toggleFilter = <T,>(set: React.Dispatch<React.SetStateAction<T[]>>, value: T) => {
    set(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedGenders([]);
    setSelectedColors([]);
    setSelectedSizes([]);
    setPriceRange([0, 10000]);
  };

  return (
    <div className="min-h-screen bg-cr-cream pt-20">
      {/* Header */}
      <div className="border-b border-black/5 bg-white">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="font-serif text-5xl sm:text-6xl font-light text-cr-black mb-6">The Collection</h1>
          <p className="text-cr-charcoal/60 text-[15px] max-w-xl mx-auto leading-relaxed">
            Discover the complete CALVIER ROSSEL range. From timeless essentials to limited edition statement pieces.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="sticky top-16 lg:top-20 z-40 bg-cr-cream/95 backdrop-blur-xl border-b border-black/5 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 text-cr-charcoal/70 hover:text-cr-black transition-colors text-[11px] tracking-[0.2em] uppercase font-semibold"
          >
            <SlidersHorizontal size={16} />
            Filters {selectedCategories.length + selectedGenders.length + selectedColors.length + selectedSizes.length > 0 && `(${selectedCategories.length + selectedGenders.length + selectedColors.length + selectedSizes.length})`}
          </button>
          
          <div className="flex items-center gap-6">
            <span className="text-cr-charcoal/50 text-[10px] tracking-widest hidden sm:inline-block font-medium">
              {loading ? '...' : `${filteredProducts.length} PRODUCTS`}
            </span>
            <div className="relative group">
              <button className="flex items-center gap-2 text-cr-charcoal/70 hover:text-cr-black transition-colors text-[11px] tracking-[0.2em] uppercase font-semibold">
                Sort: {SORT_OPTIONS.find(o => o.value === sortBy)?.label}
                <ChevronDown size={14} />
              </button>
              <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-black/5 shadow-xl rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all overflow-hidden">
                {SORT_OPTIONS.map(option => (
                  <button
                    key={option.value}
                    onClick={() => setSortBy(option.value)}
                    className={cn(
                      "block w-full text-left px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase hover:bg-black/5 transition-colors font-medium",
                      sortBy === option.value ? "text-cr-gold bg-black/5" : "text-cr-charcoal/70"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8 lg:gap-12 relative items-start">
        {/* Filters Sidebar */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 300, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="lg:sticky lg:top-40 overflow-hidden flex-shrink-0"
            >
              <div className="w-[300px] pr-8 space-y-8 pb-20 max-h-[calc(100vh-160px)] overflow-y-auto custom-scrollbar">
                <div className="flex items-center justify-between">
                  <h3 className="text-cr-black text-[11px] tracking-[0.25em] uppercase font-semibold">Filters</h3>
                  <button onClick={clearFilters} className="text-cr-charcoal/50 hover:text-cr-black text-[10px] tracking-wide transition-colors font-medium">Clear All</button>
                </div>

                {/* Categories */}
                <div className="space-y-4">
                  <h4 className="text-cr-charcoal/60 text-[10px] tracking-[0.2em] uppercase font-semibold">Category</h4>
                  <div className="space-y-3">
                    {categories.map(cat => (
                      <label key={cat} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleFilter(setSelectedCategories, cat)}>
                        <div className={cn(
                          "w-4 h-4 border rounded-sm flex items-center justify-center transition-colors shadow-sm",
                          selectedCategories.includes(cat) ? "border-cr-gold bg-cr-gold" : "border-black/20 group-hover:border-black/40 bg-white"
                        )}>
                          {selectedCategories.includes(cat) && <Check size={10} className="text-white" />}
                        </div>
                        <span className="text-cr-charcoal text-[13px] group-hover:text-cr-black transition-colors">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Gender */}
                <div className="space-y-4 border-t border-black/10 pt-8">
                  <h4 className="text-cr-charcoal/60 text-[10px] tracking-[0.2em] uppercase font-semibold">Gender</h4>
                  <div className="space-y-3">
                    {['women', 'men', 'unisex'].map(gender => (
                      <label key={gender} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleFilter(setSelectedGenders, gender as Gender)}>
                        <div className={cn(
                          "w-4 h-4 border rounded-sm flex items-center justify-center transition-colors shadow-sm",
                          selectedGenders.includes(gender as Gender) ? "border-cr-gold bg-cr-gold" : "border-black/20 group-hover:border-black/40 bg-white"
                        )}>
                          {selectedGenders.includes(gender as Gender) && <Check size={10} className="text-white" />}
                        </div>
                        <span className="text-cr-charcoal text-[13px] group-hover:text-cr-black transition-colors capitalize">{gender}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Colors */}
                <div className="space-y-4 border-t border-black/10 pt-8">
                  <h4 className="text-cr-charcoal/60 text-[10px] tracking-[0.2em] uppercase font-semibold">Color</h4>
                  <div className="flex flex-wrap gap-2.5">
                    {COLORS.slice(0, 8).map(color => (
                      <button
                        key={color.name}
                        onClick={() => toggleFilter(setSelectedColors, color.name)}
                        className={cn(
                          "w-6 h-6 rounded-full border-2 transition-all shadow-sm",
                          selectedColors.includes(color.name) ? "border-cr-black scale-110" : "border-black/10 hover:scale-110 hover:border-black/30"
                        )}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Sizes */}
                <div className="space-y-4 border-t border-black/10 pt-8">
                  <h4 className="text-cr-charcoal/60 text-[10px] tracking-[0.2em] uppercase font-semibold">Size</h4>
                  <div className="flex flex-wrap gap-2">
                    {PRODUCT_SIZES.clothing.slice(0, 6).map(size => (
                      <button
                        key={size}
                        onClick={() => toggleFilter(setSelectedSizes, size)}
                        className={cn(
                          "px-4 py-2 text-xs transition-colors border rounded-md font-medium",
                          selectedSizes.includes(size) ? "bg-cr-black border-cr-black text-white" : "border-black/10 text-cr-charcoal/70 bg-white hover:border-black/30 hover:text-cr-black shadow-sm"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Product Grid */}
        <div className={cn("flex-1", isFilterOpen ? "lg:w-[calc(100%-300px)]" : "w-full")}>
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="w-10 h-10 border-2 border-cr-gold border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-32 border border-black/10 bg-white rounded-2xl shadow-sm">
              <h3 className="text-cr-black font-serif text-3xl font-light mb-3">No products found</h3>
              <p className="text-cr-charcoal/60 text-[15px] mb-8">Try adjusting your filters to find what you&apos;re looking for.</p>
              <button onClick={clearFilters} className="text-[11px] tracking-[0.25em] uppercase text-white bg-cr-black rounded-full px-8 py-3.5 font-semibold hover:bg-cr-charcoal transition-colors">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className={cn(
              "grid gap-6 sm:gap-8",
              isFilterOpen ? "grid-cols-2 lg:grid-cols-3" : "grid-cols-2 lg:grid-cols-4"
            )}>
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
