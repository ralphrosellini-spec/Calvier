/* eslint-disable @next/next/no-img-element */
'use client';


import Link from 'next/link';
import { Heart } from 'lucide-react';
import type { Product } from '@/types';
import { useWishlistStore } from '@/store/useWishlistStore';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { toggleItem, isInWishlist } = useWishlistStore();
  const inWishlist = isInWishlist(product.id);
  
  const variant = product.variants?.[0];
  const mainImage = variant?.images?.[0] || '';
  
  // Construct badge logic based on product properties
  let badge = null;
  if (product.isNewArrival) badge = 'New';
  else if (product.isLimitedEdition) badge = 'Limited';
  else if (product.isBestSeller) badge = 'Icon';

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product.id);
  };

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block cr-reveal"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <div className="relative overflow-hidden bg-bone aspect-[4/5]">
        <img
          src={mainImage}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {badge && (
          <span className="absolute left-4 top-4 eyebrow bg-cream/90 text-ink px-2.5 py-1">
            {badge}
          </span>
        )}
        <button
          aria-label="Add to wishlist"
          className="absolute right-4 top-4 h-9 w-9 grid place-items-center rounded-full bg-cream/80 backdrop-blur opacity-0 translate-y-1 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0"
          onClick={handleWishlist}
        >
          <Heart className={`h-4 w-4 ${inWishlist ? 'fill-ink' : ''}`} />
        </button>
        <div className="absolute inset-x-4 bottom-4 translate-y-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <div className="bg-ink text-cream text-center eyebrow py-3">Quick view</div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="eyebrow text-muted-foreground">{product.category}</div>
        <div className="eyebrow tabular-nums">&#8377; {product.price.toLocaleString('en-IN')}</div>
      </div>
    </Link>
  );
}
