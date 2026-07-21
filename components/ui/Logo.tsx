'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'text';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
}

const sizeMap = {
  sm: { icon: 28, text: 'text-xs tracking-[0.3em]', gap: 'gap-2' },
  md: { icon: 36, text: 'text-sm tracking-[0.35em]', gap: 'gap-2.5' },
  lg: { icon: 48, text: 'text-base tracking-[0.4em]', gap: 'gap-3' },
};

export function CRLogo({ className, variant = 'full', size = 'md', href = '/' }: LogoProps) {
  const { icon, text, gap } = sizeMap[size];

  const IconOnly = () => (
    <div
      style={{ width: icon, height: icon }}
      className="relative flex items-center justify-center border border-current rounded-sm overflow-hidden"
    >
      <span
        className="font-serif font-bold leading-none tracking-tight"
        style={{ fontSize: icon * 0.38 }}
      >
        CR
      </span>
      {/* Gold accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-400/0 via-amber-400 to-amber-400/0" />
    </div>
  );

  const content = (
    <motion.div
      className={cn('flex items-center', gap, className)}
      whileHover={{ opacity: 0.85 }}
      transition={{ duration: 0.2 }}
    >
      {variant !== 'text' && <IconOnly />}
      {variant !== 'icon' && (
        <div className="flex flex-col leading-none">
          <span className={cn('font-serif font-bold uppercase', text)}>
            CALVIER
          </span>
          <span className={cn('font-serif font-light uppercase', text)}>
            ROSSEL
          </span>
        </div>
      )}
    </motion.div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
