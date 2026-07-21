import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency: string = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const num = Math.floor(Math.random() * 90000) + 10000;
  return `CR-${year}-${num}`;
}

export function getDiscountPercentage(original: number, sale: number): number {
  return Math.round(((original - sale) / original) * 100);
}

export function calculateTax(subtotal: number, taxRate = 0.2): number {
  return subtotal * taxRate;
}

export function calculateTotal(subtotal: number, shipping: number, discount: number, taxRate = 0.2): number {
  const taxable = subtotal - discount;
  const tax = taxable * taxRate;
  return taxable + tax + shipping;
}

export function getStockStatus(stock: number): string {
  if (stock === 0) return 'Out of Stock';
  if (stock <= 3) return `Only ${stock} left`;
  if (stock <= 10) return 'Low Stock';
  return 'In Stock';
}

export function getStarArray(rating: number): ('full' | 'half' | 'empty')[] {
  const stars: ('full' | 'half' | 'empty')[] = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) stars.push('full');
    else if (i - rating < 1 && i - rating > 0) stars.push('half');
    else stars.push('empty');
  }
  return stars;
}

export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce(
    (groups, item) => {
      const groupKey = String(item[key]);
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(item);
      return groups;
    },
    {} as Record<string, T[]>
  );
}

export function sortProducts<T extends { price: number; rating: number; reviewCount: number; createdAt: string; isBestSeller: boolean; isFeatured: boolean }>(
  products: T[],
  sortBy: string
): T[] {
  const sorted = [...products];
  switch (sortBy) {
    case 'price_asc': return sorted.sort((a, b) => a.price - b.price);
    case 'price_desc': return sorted.sort((a, b) => b.price - a.price);
    case 'rating': return sorted.sort((a, b) => b.rating - a.rating);
    case 'newest': return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case 'popular': return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
    case 'best_selling': return sorted.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
    case 'featured': return sorted.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    default: return sorted;
  }
}
