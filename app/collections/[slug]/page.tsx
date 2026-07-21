'use client';

import { useEffect, useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowDown, Play } from 'lucide-react';
import { getCollectionBySlug, getProductsByCollection } from '@/lib/firebase-db';
import { ProductCard } from '@/components/product/ProductCard';
import type { Collection, Product } from '@/types';

export default function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const unwrappedParams = use(params);
  const slug = unwrappedParams.slug;

  const [collection, setCollection] = useState<Collection | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const fetchedCollection = await getCollectionBySlug(slug);
        setCollection(fetchedCollection);
        if (fetchedCollection) {
          const fetchedProducts = await getProductsByCollection(fetchedCollection.id);
          setProducts(fetchedProducts);
        }
      } catch (error) {
        console.error("Error fetching collection", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cr-black flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-cr-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen bg-cr-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-3xl text-white font-light mb-4">Collection Not Found</h1>
          <Link href="/shop" className="text-cr-gold text-[11px] tracking-[0.2em] uppercase hover:underline">
            Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cr-black">
      {/* Hero */}
      <section className="relative h-[90vh] min-h-[600px] flex flex-col items-center justify-center overflow-hidden">
        <Image
          src={collection.coverImage}
          alt={collection.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-cr-gold text-[11px] tracking-[0.4em] uppercase mb-4">{collection.season} Collection</p>
            <h1 className="font-serif text-6xl md:text-8xl font-light text-white mb-6 tracking-tight leading-none">
              {collection.name}
            </h1>
            <p className="text-white/70 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              {collection.description}
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/50"
        >
          <span className="text-[9px] tracking-[0.3em] uppercase mb-2">Discover</span>
          <ArrowDown size={16} className="animate-bounce" />
        </motion.div>
      </section>

      {/* Editorial Grid */}
      <section className="py-20 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8 mb-20">
          <div className="relative aspect-[3/4] overflow-hidden group">
            {/* Fashion editorial image */}
            <Image src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=90" alt="Editorial 1" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-colors">
                <Play size={24} fill="currentColor" />
              </button>
            </div>
          </div>
          <div className="grid grid-rows-2 gap-4 lg:gap-8">
            <div className="relative overflow-hidden group">
              {/* Detail shot: bag or shoes */}
              <Image src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=90" alt="Editorial 2" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="bg-[#111] p-10 flex flex-col justify-center border border-white/10">
              <h3 className="font-serif text-3xl text-white font-light mb-4">The Inspiration</h3>
              <p className="text-white/60 text-sm leading-relaxed mb-8">
                Drawing from the celestial phenomena that paint the northern skies, the Aurora collection masterfully blends architectural tailoring with fluid, ethereal fabrics. Each piece is a study in contrasts—structured yet soft, bold yet whisper-quiet.
              </p>
              <Link href="/about" className="text-cr-gold text-[10px] tracking-[0.2em] uppercase hover:underline w-fit">
                Read the Director&apos;s Note
              </Link>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl text-white font-light">The Pieces</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
