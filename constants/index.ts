import type { NavItem, SortOption } from '@/types';

export const BRAND_NAME = 'CALVIER ROSSEL';
export const BRAND_TAGLINE = 'Luxury Redefined';
export const BRAND_DESCRIPTION =
  'CALVIER ROSSEL is a premier global fashion and lifestyle house founded on the principles of timeless elegance, impeccable craftsmanship, and avant-garde design. Born from a vision to redefine modern luxury, our collections transcend seasons and trends.';

export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: 'â‚¬', name: 'Euro' },
  { code: 'GBP', symbol: 'Â£', name: 'British Pound' },
  { code: 'INR', symbol: 'â‚¹', name: 'Indian Rupee' },
  { code: 'JPY', symbol: 'Â¥', name: 'Japanese Yen' },
  { code: 'AED', symbol: 'Ø¯.Ø¥', name: 'UAE Dirham' },
];

export const LANGUAGES = [
  { code: 'en', name: 'English', flag: 'ðŸ‡ºðŸ‡¸' },
  { code: 'fr', name: 'FranÃ§ais', flag: 'ðŸ‡«ðŸ‡·' },
  { code: 'de', name: 'Deutsch', flag: 'ðŸ‡©ðŸ‡ª' },
  { code: 'it', name: 'Italiano', flag: 'ðŸ‡®ðŸ‡¹' },
  { code: 'ja', name: 'æ—¥æœ¬èªž', flag: 'ðŸ‡¯ðŸ‡µ' },
  { code: 'ar', name: 'Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©', flag: 'ðŸ‡¦ðŸ‡ª' },
];

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'New Arrivals',
    href: '/shop?filter=new',
    isNew: true,
    children: [
      { label: 'This Week', href: '/shop?filter=new&period=week' },
      { label: 'This Month', href: '/shop?filter=new&period=month' },
      { label: 'New in Women', href: '/shop?gender=women&filter=new' },
      { label: 'New in Men', href: '/shop?gender=men&filter=new' },
    ],
  },
  {
    label: 'Women',
    href: '/categories/women',
    children: [
      { label: 'Clothing', href: '/categories/women-clothing' },
      { label: 'Dresses', href: '/categories/dresses' },
      { label: 'Tops & Blouses', href: '/categories/tops' },
      { label: 'Trousers & Skirts', href: '/categories/bottoms-women' },
      { label: 'Coats & Jackets', href: '/categories/outerwear-women' },
      { label: 'Accessories', href: '/categories/accessories-women' },
      { label: 'Bags', href: '/categories/bags' },
      { label: 'Shoes', href: '/categories/shoes-women' },
      { label: 'Jewellery', href: '/categories/jewellery' },
    ],
  },
  {
    label: 'Men',
    href: '/categories/men',
    children: [
      { label: 'Clothing', href: '/categories/men-clothing' },
      { label: 'Suits & Blazers', href: '/categories/suits' },
      { label: 'Shirts', href: '/categories/shirts' },
      { label: 'Trousers', href: '/categories/bottoms-men' },
      { label: 'Outerwear', href: '/categories/outerwear-men' },
      { label: 'Accessories', href: '/categories/accessories-men' },
      { label: 'Shoes', href: '/categories/shoes-men' },
      { label: 'Bags', href: '/categories/bags-men' },
    ],
  },
  {
    label: 'Collections',
    href: '/collections',
    children: [
      { label: 'SS 2026 â₹” Aurora', href: '/collections/aurora-ss26', isFeatured: true },
      { label: 'FW 2025 â₹” Noir', href: '/collections/noir-fw25' },
      { label: 'Resort 2025', href: '/collections/resort-2025' },
      { label: 'Limited Edition', href: '/shop?filter=limited' },
    ],
  },
  {
    label: 'Sale',
    href: '/shop?filter=sale',
  },
  {
    label: 'About',
    href: '/about',
  },
];

export const SORT_OPTIONS: SortOption[] = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Most Popular', value: 'popular' },
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Best Selling', value: 'best_selling' },
  { label: 'Top Rated', value: 'rating' },
  { label: 'Luxury Picks', value: 'luxury' },
];

export const PRODUCT_SIZES = {
  clothing: ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
  shoes: ['UK 3', 'UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11', 'UK 12'],
  bags: ['One Size'],
  accessories: ['One Size', 'S/M', 'L/XL'],
};

export const COLORS: { name: string; hex: string }[] = [
  { name: 'Obsidian Black', hex: '#0a0a0a' },
  { name: 'Ivory White', hex: '#fafafa' },
  { name: 'Charcoal', hex: '#36454f' },
  { name: 'Champagne Gold', hex: '#c8a96e' },
  { name: 'Midnight Navy', hex: '#1a1a2e' },
  { name: 'Blush Rose', hex: '#e8bab0' },
  { name: 'Forest Green', hex: '#2d5016' },
  { name: 'Bordeaux', hex: '#6a0f1a' },
  { name: 'Sand Beige', hex: '#d4b896' },
  { name: 'Slate Grey', hex: '#708090' },
];

export const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit / Debit Card', icon: 'CreditCard' },
  { id: 'upi', label: 'UPI', icon: 'Smartphone' },
  { id: 'netbanking', label: 'Net Banking', icon: 'Building2' },
  { id: 'wallet', label: 'Digital Wallet', icon: 'Wallet' },
  { id: 'cod', label: 'Cash on Delivery', icon: 'Banknote' },
  { id: 'emi', label: 'EMI Options', icon: 'LayoutGrid' },
];

export const SHIPPING_METHODS = [
  {
    id: 'standard',
    name: 'Standard Delivery',
    description: '5â₹“7 business days',
    price: 0,
    free: true,
  },
  {
    id: 'express',
    name: 'Express Delivery',
    description: '2â₹“3 business days',
    price: 15,
    free: false,
  },
  {
    id: 'overnight',
    name: 'Overnight Delivery',
    description: 'Next business day',
    price: 35,
    free: false,
  },
];

export const SOCIAL_LINKS = [
  { platform: 'Instagram', href: 'https://instagram.com', handle: '@calvierrossel' },
  { platform: 'Twitter', href: 'https://twitter.com', handle: '@calvierrossel' },
  { platform: 'Facebook', href: 'https://facebook.com', handle: 'calvierrossel' },
  { platform: 'Pinterest', href: 'https://pinterest.com', handle: 'calvierrossel' },
  { platform: 'YouTube', href: 'https://youtube.com', handle: 'CalvierRossel' },
  { platform: 'TikTok', href: 'https://tiktok.com', handle: '@calvierrossel' },
];

export const FOOTER_LINKS = {
  company: [
    { label: 'About CALVIER ROSSEL', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press & Media', href: '/press' },
    { label: 'Sustainability', href: '/sustainability' },
    { label: 'Flagship Stores', href: '/stores' },
  ],
  collections: [
    { label: 'Women', href: '/categories/women' },
    { label: 'Men', href: '/categories/men' },
    { label: 'New Arrivals', href: '/shop?filter=new' },
    { label: 'Sale', href: '/shop?filter=sale' },
    { label: 'Limited Edition', href: '/shop?filter=limited' },
  ],
  customerCare: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'Shipping Information', href: '/help/shipping' },
    { label: 'Returns & Exchanges', href: '/help/returns' },
    { label: 'Size Guide', href: '/size-guide' },
    { label: 'FAQ', href: '/help/faq' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Accessibility', href: '/accessibility' },
  ],
};

export const ADMIN_NAV = [
  { label: 'Dashboard', href: '/admin', icon: 'LayoutDashboard' },
  { label: 'Products', href: '/admin/products', icon: 'Package' },
  { label: 'Categories', href: '/admin/categories', icon: 'Tag' },
  { label: 'Collections', href: '/admin/collections', icon: 'Layers' },
  { label: 'Orders', href: '/admin/orders', icon: 'ShoppingBag' },
  { label: 'Customers', href: '/admin/customers', icon: 'Users' },
  { label: 'Inventory', href: '/admin/inventory', icon: 'Warehouse' },
  { label: 'Coupons', href: '/admin/coupons', icon: 'Ticket' },
  { label: 'Reviews', href: '/admin/reviews', icon: 'Star' },
  { label: 'Returns', href: '/admin/returns', icon: 'RefreshCcw' },
  { label: 'Analytics', href: '/admin/analytics', icon: 'BarChart3' },
  { label: 'Banners', href: '/admin/banners', icon: 'Image' },
  { label: 'Support', href: '/admin/support', icon: 'HeadphonesIcon' },
  { label: 'Settings', href: '/admin/settings', icon: 'Settings' },
];

export const DASHBOARD_NAV = [
  { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'My Orders', href: '/dashboard/orders', icon: 'ShoppingBag' },
  { label: 'Wishlist', href: '/dashboard/wishlist', icon: 'Heart' },
  { label: 'Addresses', href: '/dashboard/addresses', icon: 'MapPin' },
  { label: 'Notifications', href: '/dashboard/notifications', icon: 'Bell' },
  { label: 'My Coupons', href: '/dashboard/coupons', icon: 'Ticket' },
  { label: 'Returns', href: '/dashboard/returns', icon: 'RefreshCcw' },
  { label: 'Support', href: '/dashboard/support', icon: 'HeadphonesIcon' },
  { label: 'Security', href: '/dashboard/security', icon: 'Shield' },
  { label: 'Settings', href: '/dashboard/settings', icon: 'Settings' },
];

