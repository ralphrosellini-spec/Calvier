'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useWishlistStore } from '@/store/useWishlistStore';
import { getProducts } from '@/lib/firebase-db';
import type { Product } from '@/types';
import { ProductCard } from '@/components/product/ProductCard';

export default function WishlistPage() {
  const { items } = useWishlistStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then(data => {
      setProducts(data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const wishlistProducts = products.filter(p => items.includes(p.id));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-cr-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl sm:text-4xl font-light text-white mb-4">Your Wishlist</h1>
        <p className="text-white/50 text-sm">Save your favorite pieces for later.</p>
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="text-center py-24 bg-[#111] border border-white/10">
          <Heart size={48} className="text-white/20 mx-auto mb-6" />
          <h2 className="text-white font-serif text-2xl font-light mb-2">Your wishlist is empty</h2>
          <p className="text-white/50 text-sm mb-6">Explore our collections and add pieces you love.</p>
          <Link href="/shop" className="text-[11px] tracking-[0.2em] uppercase bg-white text-cr-black px-8 py-3 font-semibold hover:bg-cr-gold transition-colors">
            Discover Collections
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          <AnimatePresence>
            {wishlistProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
