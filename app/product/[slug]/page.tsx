'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, Heart, Share2, Ruler, 
  Truck, RotateCcw, Shield, Plus, Minus,
  Star, Zap, Play
} from 'lucide-react';
import { getProductBySlug, getProducts } from '@/lib/firebase-db';
import type { Product } from '@/types';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useUIStore } from '@/store/useUIStore';
import { formatPrice, cn } from '@/lib/utils';
import { ProductCard } from '@/components/product/ProductCard';

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const unwrappedParams = use(params);
  const slug = unwrappedParams.slug;

  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');
  const [isZoomed, setIsZoomed] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const { addItem, openCart } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { } = useUIStore();

  useEffect(() => {
    async function fetchData() {
      try {
        const [fetchedProduct, fetchedAll] = await Promise.all([
          getProductBySlug(slug),
          getProducts()
        ]);
        setProduct(fetchedProduct);
        setAllProducts(fetchedAll);
      } catch (error) {
        console.error("Error fetching product", error);
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

  if (!product) {
    return (
      <div className="min-h-screen bg-cr-black flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="font-serif text-3xl text-white font-light mb-4">Product Not Found</h1>
          <Link href="/shop" className="text-cr-gold text-[11px] tracking-[0.2em] uppercase hover:underline">
            Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  const variant = product.variants[selectedVariantIdx];
  const inWishlist = isInWishlist(product.id);
  const mainImage = variant?.images[activeImageIdx] || '';

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    for (let i = 0; i < quantity; i++) {
      addItem(product, variant.id, variant.color, variant.colorHex, selectedSize, mainImage);
    }
    openCart();
  };

  const relatedProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-cr-black pt-16 lg:pt-20">
      {/* Breadcrumbs */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-white/40">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight size={10} />
        <Link href={`/categories/${product.category.toLowerCase()}`} className="hover:text-white transition-colors">{product.category}</Link>
        <ChevronRight size={10} />
        <span className="text-white/80">{product.name}</span>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-12 gap-10 lg:gap-16">
          
          {/* Left: Gallery */}
          <div className="xl:col-span-7 flex flex-col-reverse lg:flex-row gap-4 lg:gap-6 lg:sticky lg:top-28 h-fit">
            {/* Thumbnails */}
            <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto custom-scrollbar pb-2 lg:pb-0 lg:pr-2 lg:max-h-[calc(100vh-140px)]">
              {variant.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={cn(
                    "relative w-20 h-24 sm:w-24 sm:h-32 flex-shrink-0 bg-white/5 overflow-hidden transition-all",
                    activeImageIdx === idx ? "border-2 border-cr-gold opacity-100" : "border border-white/10 opacity-60 hover:opacity-100"
                  )}
                >
                  <Image src={img} alt={`${product.name} view ${idx + 1}`} fill className="object-cover" sizes="96px" />
                </button>
              ))}
              <button className="relative w-20 h-24 sm:w-24 sm:h-32 flex-shrink-0 bg-white/5 border border-white/10 opacity-60 hover:opacity-100 flex flex-col items-center justify-center gap-2 text-white/50 hover:text-white transition-colors">
                <Play size={20} />
                <span className="text-[9px] tracking-widest uppercase">Video</span>
              </button>
            </div>

            {/* Main Image */}
            <div className="relative flex-1 bg-[#111] aspect-[3/4] lg:aspect-auto lg:h-[calc(100vh-140px)] overflow-hidden group">
              <Image 
                src={mainImage} 
                alt={product.name} 
                fill 
                className={cn(
                  "object-cover transition-transform duration-700 ease-out",
                  isZoomed ? "scale-150 cursor-zoom-out" : "scale-100 cursor-zoom-in"
                )} 
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                onClick={() => setIsZoomed(!isZoomed)}
              />
              <div className="absolute top-4 right-4 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => toggleItem(product.id)}
                  className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  <Heart size={18} fill={inWishlist ? 'currentColor' : 'none'} className={inWishlist ? 'text-cr-gold' : ''} />
                </button>
                <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                  <Share2 size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="xl:col-span-5 flex flex-col">
            <div className="mb-8">
              <p className="text-cr-gold text-[11px] tracking-[0.3em] uppercase mb-3">{product.brand}</p>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-white leading-tight mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-6">
                <span className="text-white text-xl sm:text-2xl font-light">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-white/40 line-through text-lg">{formatPrice(product.originalPrice)}</span>
                )}
                {product.isTrending && (
                  <span className="flex items-center gap-1 text-cr-gold text-[10px] tracking-widest uppercase border border-cr-gold/30 px-2 py-1">
                    <Zap size={10} /> Trending
                  </span>
                )}
              </div>

              {/* Reviews summary */}
              <div className="flex items-center gap-3 pb-6 border-b border-white/10">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className={i < Math.floor(product.rating) ? "text-cr-gold fill-cr-gold" : "text-white/20"} />
                  ))}
                </div>
                <span className="text-white/60 text-sm">{product.rating}</span>
                <span className="text-white/30 text-sm">|</span>
                <button className="text-white/60 text-sm underline hover:text-white transition-colors">
                  Read {product.reviewCount} Reviews
                </button>
              </div>
            </div>

            {/* Colors */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white text-[11px] tracking-[0.2em] uppercase">
                  Color: <span className="text-white/60 ml-2">{variant.color}</span>
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((v, idx) => (
                  <button
                    key={v.id}
                    onClick={() => { setSelectedVariantIdx(idx); setSelectedSize(null); setActiveImageIdx(0); }}
                    className={cn(
                      "w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center",
                      selectedVariantIdx === idx ? "border-white scale-110" : "border-transparent hover:border-white/50"
                    )}
                  >
                    <span 
                      className="w-8 h-8 rounded-full border border-white/20" 
                      style={{ backgroundColor: v.colorHex }} 
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white text-[11px] tracking-[0.2em] uppercase">Size</span>
                <button className="text-white/50 text-[10px] tracking-wider uppercase hover:text-white flex items-center gap-1 transition-colors">
                  <Ruler size={12} /> Size Guide
                </button>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {variant.sizes.map((s) => (
                  <button
                    key={s.size}
                    disabled={s.stock === 0}
                    onClick={() => setSelectedSize(s.size)}
                    className={cn(
                      "py-3 text-[11px] tracking-widest uppercase transition-all border",
                      s.stock === 0 
                        ? "border-white/5 text-white/20 cursor-not-allowed bg-white/5 line-through" 
                        : selectedSize === s.size
                          ? "border-cr-gold bg-cr-gold text-cr-black font-semibold"
                          : "border-white/20 text-white/70 hover:border-white/60 hover:text-white"
                    )}
                  >
                    {s.size}
                  </button>
                ))}
              </div>
              {selectedSize && (
                <p className="mt-3 text-white/50 text-xs">
                  {variant.sizes.find(s => s.size === selectedSize)!.stock <= 3 ? (
                    <span className="text-amber-500">Only {variant.sizes.find(s => s.size === selectedSize)?.stock} left in stock</span>
                  ) : 'In stock and ready to ship'}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="mb-10 space-y-4">
              <div className="flex gap-4">
                {/* Quantity */}
                <div className="flex items-center border border-white/20 w-32 shrink-0">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex-1 py-4 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center text-white text-sm">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="flex-1 py-4 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                
                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-white text-cr-black font-semibold text-[11px] tracking-[0.25em] uppercase hover:bg-cr-gold hover:text-cr-black transition-all duration-300"
                >
                  Add To Cart
                </button>
              </div>
              <button className="w-full py-4 border border-cr-gold text-cr-gold text-[11px] tracking-[0.25em] uppercase font-semibold hover:bg-cr-gold hover:text-cr-black transition-all duration-300">
                Buy It Now
              </button>
            </div>

            {/* Tabs */}
            <div className="border-t border-white/10 pt-8">
              <div className="flex gap-8 mb-6 border-b border-white/10">
                {['details', 'material', 'delivery'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "pb-4 text-[11px] tracking-[0.2em] uppercase transition-colors relative",
                      activeTab === tab ? "text-cr-gold" : "text-white/50 hover:text-white"
                    )}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-[1px] bg-cr-gold" />
                    )}
                  </button>
                ))}
              </div>

              <div className="min-h-[200px]">
                <AnimatePresence mode="wait">
                  {activeTab === 'details' && (
                    <motion.div
                      key="details"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
                      className="text-white/60 text-sm leading-relaxed space-y-4"
                    >
                      <p>{product.description}</p>
                      <ul className="list-disc pl-5 space-y-1.5 mt-4 text-white/70">
                        {product.features.map((f, i) => <li key={i}>{f}</li>)}
                      </ul>
                    </motion.div>
                  )}
                  {activeTab === 'material' && (
                    <motion.div
                      key="material"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
                      className="text-white/60 text-sm leading-relaxed space-y-4"
                    >
                      <p><strong className="text-white font-medium">Composition:</strong> {product.material}</p>
                      <div className="mt-4">
                        <strong className="text-white font-medium block mb-2">Care Instructions:</strong>
                        <ul className="list-disc pl-5 space-y-1.5 text-white/70">
                          {product.careInstructions.map((c, i) => <li key={i}>{c}</li>)}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                  {activeTab === 'delivery' && (
                    <motion.div
                      key="delivery"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      <div className="flex gap-4">
                        <Truck size={20} className="text-cr-gold shrink-0 mt-0.5" />
                        <div>
                          <p className="text-white text-sm font-medium mb-1">Delivery</p>
                          <p className="text-white/60 text-sm leading-relaxed">{product.deliveryInfo}</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <RotateCcw size={20} className="text-cr-gold shrink-0 mt-0.5" />
                        <div>
                          <p className="text-white text-sm font-medium mb-1">Returns</p>
                          <p className="text-white/60 text-sm leading-relaxed">{product.returnsPolicy}</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <Shield size={20} className="text-cr-gold shrink-0 mt-0.5" />
                        <div>
                          <p className="text-white text-sm font-medium mb-1">Authenticity Guaranteed</p>
                          <p className="text-white/60 text-sm leading-relaxed">All CALVIER ROSSEL items come with a certificate of authenticity.</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-white/10 mt-12 bg-[#080808]">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center mb-12">
              <p className="text-cr-gold text-[10px] tracking-[0.4em] uppercase mb-3">Complete The Look</p>
              <h2 className="font-serif text-3xl sm:text-4xl font-light text-white">Related Products</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map(rp => (
                <ProductCard key={rp.id} product={rp} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
