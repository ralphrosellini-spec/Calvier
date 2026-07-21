'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { X, ChevronRight, Camera, Hash } from 'lucide-react';
import { useUIStore } from '@/store/useUIStore';
import { CRLogo } from '@/components/ui/Logo';
import { NAV_ITEMS } from '@/constants';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function MobileMenu() {
  const { isMobileMenuOpen, closeMobileMenu } = useUIStore();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={closeMobileMenu}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed top-0 left-0 bottom-0 z-50 w-80 bg-[#0a0a0a] flex flex-col lg:hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <CRLogo variant="full" size="sm" className="text-white" />
              <button
                onClick={closeMobileMenu}
                className="text-white/50 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-4">
              {NAV_ITEMS.map((item) => (
                <div key={item.label} className="border-b border-white/5">
                  {item.children ? (
                    <>
                      <button
                        onClick={() => setExpanded(expanded === item.label ? null : item.label)}
                        className="flex items-center justify-between w-full px-6 py-4 text-[11px] tracking-[0.2em] uppercase text-white/70 hover:text-white transition-colors"
                      >
                        {item.label}
                        <ChevronRight
                          size={14}
                          className={cn('transition-transform', expanded === item.label && 'rotate-90')}
                        />
                      </button>
                      <AnimatePresence>
                        {expanded === item.label && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            {item.children.map((child) => (
                              <Link
                                key={child.label}
                                href={child.href}
                                onClick={closeMobileMenu}
                                className="block px-8 py-3 text-[11px] tracking-[0.15em] uppercase text-white/40 hover:text-cr-gold transition-colors"
                              >
                                {child.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={closeMobileMenu}
                      className={cn(
                        'block px-6 py-4 text-[11px] tracking-[0.2em] uppercase transition-colors',
                        item.label === 'Sale' ? 'text-red-400' : 'text-white/70 hover:text-white'
                      )}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}

              {/* Additional Links */}
              <div className="px-6 pt-6 space-y-3">
                <Link href="/dashboard" onClick={closeMobileMenu} className="block text-[11px] tracking-[0.2em] uppercase text-white/40 hover:text-white transition-colors">My Account</Link>
                <Link href="/dashboard/wishlist" onClick={closeMobileMenu} className="block text-[11px] tracking-[0.2em] uppercase text-white/40 hover:text-white transition-colors">Wishlist</Link>
                <Link href="/dashboard/orders" onClick={closeMobileMenu} className="block text-[11px] tracking-[0.2em] uppercase text-white/40 hover:text-white transition-colors">Orders</Link>
                <Link href="/help" onClick={closeMobileMenu} className="block text-[11px] tracking-[0.2em] uppercase text-white/40 hover:text-white transition-colors">Help Centre</Link>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10">
              <div className="flex items-center gap-4 mb-4">
                <a href="#" className="text-white/30 hover:text-cr-gold transition-colors"><Camera size={18} /></a>
                <a href="#" className="text-white/30 hover:text-cr-gold transition-colors"><Hash size={18} /></a>
              </div>
              <p className="text-white/20 text-[10px] tracking-wide">© 2026 CALVIER ROSSEL</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
