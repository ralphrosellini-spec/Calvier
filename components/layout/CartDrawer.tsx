'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X, ShoppingBag, ArrowRight, Trash2, Plus, Minus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-[#0a0a0a] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <div>
                <h2 className="text-[11px] tracking-[0.3em] uppercase text-cr-gold">Your Cart</h2>
                <p className="text-white/40 text-xs mt-0.5">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
              </div>
              <button onClick={closeCart} className="text-white/50 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-full text-center px-8"
                >
                  <ShoppingBag size={48} className="text-white/10 mb-6" />
                  <h3 className="text-white/60 text-sm font-light mb-2">Your cart is empty</h3>
                  <p className="text-white/25 text-xs mb-8">Discover our latest collections</p>
                  <Link
                    href="/shop"
                    onClick={closeCart}
                    className="text-[10px] tracking-[0.25em] uppercase text-cr-gold border border-cr-gold/50 px-6 py-3 hover:bg-cr-gold hover:text-cr-black transition-all duration-200"
                  >
                    Explore Collections
                  </Link>
                </motion.div>
              ) : (
                <div className="divide-y divide-white/5">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex gap-4 p-5"
                      >
                        {/* Image */}
                        <Link href={`/product/${item.product.slug}`} onClick={closeCart}>
                          <div className="relative w-20 h-24 bg-white/5 overflow-hidden flex-shrink-0">
                            <Image
                              src={item.image}
                              alt={item.product.name}
                              fill
                              className="object-cover hover:scale-105 transition-transform duration-300"
                              sizes="80px"
                            />
                          </div>
                        </Link>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <Link href={`/product/${item.product.slug}`} onClick={closeCart}>
                            <h3 className="text-white text-[12px] font-medium leading-snug hover:text-cr-gold transition-colors line-clamp-2">
                              {item.product.name}
                            </h3>
                          </Link>
                          <div className="mt-1 flex gap-2 text-white/35 text-[10px] tracking-wide">
                            <span>{item.color}</span>
                            <span>•</span>
                            <span>Size {item.size}</span>
                          </div>

                          <div className="mt-3 flex items-center justify-between">
                            {/* Quantity */}
                            <div className="flex items-center gap-0 border border-white/15">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-7 h-7 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-colors"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="w-8 text-center text-white/70 text-xs">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-7 h-7 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-colors"
                              >
                                <Plus size={12} />
                              </button>
                            </div>

                            {/* Price */}
                            <p className="text-white text-sm font-light">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-white/20 hover:text-red-400 transition-colors self-start mt-0.5"
                        >
                          <Trash2 size={14} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-white/10 p-6 space-y-4">
                {/* Subtotal */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-white/50 text-xs">
                    <span className="tracking-wide">Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-white/50 text-xs">
                    <span className="tracking-wide">Shipping</span>
                    <span className="text-cr-gold">Complimentary</span>
                  </div>
                  <div className="flex items-center justify-between text-white text-sm pt-2 border-t border-white/10">
                    <span className="tracking-[0.1em] uppercase text-[11px]">Total</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                </div>

                {/* CTAs */}
                <div className="space-y-2">
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="flex items-center justify-center gap-2 w-full bg-cr-gold text-cr-black py-3.5 text-[11px] tracking-[0.25em] uppercase font-semibold hover:bg-amber-400 transition-colors"
                  >
                    Proceed to Checkout <ArrowRight size={13} />
                  </Link>
                  <Link
                    href="/cart"
                    onClick={closeCart}
                    className="flex items-center justify-center w-full border border-white/20 text-white/60 hover:text-white hover:border-white/40 py-3 text-[11px] tracking-[0.2em] uppercase transition-colors"
                  >
                    View Cart
                  </Link>
                </div>

                <p className="text-center text-white/25 text-[10px] tracking-wide">
                  Complimentary express delivery on all orders
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

