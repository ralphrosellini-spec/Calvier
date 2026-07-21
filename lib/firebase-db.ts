import { db } from './firebase';
import { collection, getDocs, doc, getDoc, query, where, limit, onSnapshot } from 'firebase/firestore';
import type { Product, Collection, Category, Order, Testimonial } from '@/types';

// ==========================================
// PRODUCTS
// ==========================================

export async function getProducts(): Promise<Product[]> {
  const snapshot = await getDocs(collection(db, 'products'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
}

export async function getProductById(id: string): Promise<Product | null> {
  const docRef = doc(db, 'products', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Product;
  }
  return null;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const q = query(collection(db, 'products'), where('slug', '==', slug), limit(1));
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    const docSnap = snapshot.docs[0];
    return { id: docSnap.id, ...docSnap.data() } as Product;
  }
  return null;
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  const q = query(collection(db, 'products'), where('categoryId', '==', categoryId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
}

export async function getProductsByCollection(collectionId: string): Promise<Product[]> {
  const q = query(collection(db, 'products'), where('collectionId', '==', collectionId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const q = query(collection(db, 'products'), where('isFeatured', '==', true));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
}

// ==========================================
// COLLECTIONS
// ==========================================

export async function getCollections(): Promise<Collection[]> {
  const snapshot = await getDocs(collection(db, 'collections'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Collection));
}

export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
  const q = query(collection(db, 'collections'), where('slug', '==', slug), limit(1));
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    const docSnap = snapshot.docs[0];
    return { id: docSnap.id, ...docSnap.data() } as Collection;
  }
  return null;
}

// ==========================================
// CATEGORIES
// ==========================================

export async function getCategories(): Promise<Category[]> {
  const snapshot = await getDocs(collection(db, 'categories'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
}

// ==========================================
// TESTIMONIALS
// ==========================================

export async function getTestimonials(): Promise<Testimonial[]> {
  const snapshot = await getDocs(collection(db, 'testimonials'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial));
}

// ==========================================
// ORDERS
// ==========================================

export async function getOrders(): Promise<Order[]> {
  const snapshot = await getDocs(collection(db, 'orders'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
}

export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  const q = query(collection(db, 'orders'), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
}

// Real-time listener for orders (Admin)
export function subscribeToOrders(callback: (orders: Order[]) => void) {
  return onSnapshot(collection(db, 'orders'), (snapshot) => {
    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
    callback(orders);
  });
}
