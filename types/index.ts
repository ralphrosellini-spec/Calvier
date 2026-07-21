// ============================================================
// CALVIER ROSSEL "” Core Types
// ============================================================

export type Gender = 'men' | 'women' | 'unisex' | 'kids';
export type ProductStatus = 'in_stock' | 'low_stock' | 'out_of_stock' | 'coming_soon';
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned' | 'refunded';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'card' | 'upi' | 'netbanking' | 'wallet' | 'cod' | 'emi';
export type ReturnStatus = 'requested' | 'approved' | 'picked_up' | 'received' | 'refunded' | 'rejected';
export type NotificationType = 'order' | 'offer' | 'message' | 'return' | 'system';
export type AddressType = 'home' | 'work' | 'other';

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string;
  description: string;
  country: string;
  founded: number;
  featured: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  gender: Gender | 'all';
  parentId?: string;
  children?: Category[];
  productCount: number;
  featured: boolean;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  coverImage: string;
  season: string;
  year: number;
  featured: boolean;
  isCurrent: boolean;
  tags: string[];
}

export interface ProductVariant {
  id: string;
  color: string;
  colorHex: string;
  images: string[];
  sizes: ProductSize[];
}

export interface ProductSize {
  size: string;
  stock: number;
  sku: string;
}

export interface ProductReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  title: string;
  body: string;
  verified: boolean;
  helpful: number;
  images?: string[];
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  brandId: string;
  category: string;
  categoryId: string;
  collectionId?: string;
  gender: Gender;
  description: string;
  shortDescription: string;
  material: string;
  careInstructions: string[];
  features: string[];
  variants: ProductVariant[];
  price: number;
  originalPrice?: number;
  discount?: number;
  currency: string;
  status: ProductStatus;
  tags: string[];
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  isLimitedEdition: boolean;
  isTrending: boolean;
  rating: number;
  reviewCount: number;
  reviews?: ProductReview[];
  sizeGuide?: string;
  deliveryInfo: string;
  returnsPolicy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  variantId: string;
  color: string;
  colorHex: string;
  size: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  couponCode?: string;
  giftCard?: string;
}

export interface Address {
  id: string;
  userId: string;
  type: AddressType;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  isDefault: boolean;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  brand: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
  originalPrice?: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  couponCode?: string;
  trackingNumber?: string;
  estimatedDelivery: string;
  notes?: string;
  timeline: OrderTimeline[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderTimeline {
  status: string;
  description: string;
  timestamp: string;
  completed: boolean;
}

export interface User {
  id: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  gender?: Gender;
  dateOfBirth?: string;
  addresses: Address[];
  wishlist: string[];
  orders: string[];
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  newsletter: boolean;
  notifications: boolean;
  language: string;
  currency: string;
  theme: 'light' | 'dark' | 'system';
}

export interface Coupon {
  id: string;
  code: string;
  title: string;
  description: string;
  type: 'percentage' | 'fixed' | 'free_shipping';
  value: number;
  minOrderAmount: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  expiresAt: string;
  isActive: boolean;
  applicableCategories?: string[];
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  image?: string;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  avatar: string;
  rating: number;
  text: string;
  product?: string;
  productImage?: string;
  date: string;
  verified: boolean;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  mobileImage?: string;
  link: string;
  buttonText: string;
  position: 'home_hero' | 'home_mid' | 'shop_top' | 'category_top';
  isActive: boolean;
  startDate: string;
  endDate: string;
  order: number;
}

// Admin Types
export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  revenueGrowth: number;
  ordersGrowth: number;
  productsGrowth: number;
  customersGrowth: number;
}

export interface SalesData {
  date: string;
  revenue: number;
  orders: number;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
  isNew?: boolean;
  isFeatured?: boolean;
  image?: string;
}

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

export interface SortOption {
  label: string;
  value: string;
}

