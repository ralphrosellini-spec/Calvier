'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, ShoppingBag, DollarSign, TrendingUp, 
  PackageSearch, Bell, Settings, LogOut 
} from 'lucide-react';
import { subscribeToOrders, getProducts } from '@/lib/firebase-db';
import type { Order, Product } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';
import { CRLogo } from '@/components/ui/Logo';
import Link from 'next/link';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Real-time listener for orders
    const unsubscribe = subscribeToOrders((newOrders) => {
      // Sort orders by date descending
      const sorted = [...newOrders].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setOrders(sorted);
      setLoading(false);
    });

    // Fetch products once
    getProducts().then((data) => {
      setProducts(data);
    });

    return () => unsubscribe();
  }, []);

  const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;

  const stats = [
    { label: 'Total Revenue', value: formatPrice(totalRevenue), icon: DollarSign, trend: '+12.5%' },
    { label: 'Total Orders', value: totalOrders.toString(), icon: ShoppingBag, trend: '+8.2%' },
    { label: 'Active Products', value: totalProducts.toString(), icon: PackageSearch, trend: '+2.4%' },
    { label: 'Total Customers', value: '1,248', icon: Users, trend: '+18.1%' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-cr-black flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-cr-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cr-black flex">
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-[#0a0a0a] border-b border-white/10 flex items-center justify-between px-8">
          <h1 className="text-white font-serif text-xl font-light">Overview</h1>
          <div className="flex items-center gap-6">
            <button className="text-white/50 hover:text-white transition-colors relative">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-cr-gold rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-xs font-medium border border-white/20">
              AD
            </div>
          </div>
        </header>

        <div className="flex-1 p-8 overflow-y-auto">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-[#111] border border-white/10 p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <Icon size={20} className="text-cr-gold" />
                    <span className="text-green-400 text-[10px] tracking-wider">{stat.trend}</span>
                  </div>
                  <p className="text-white text-2xl font-light mb-1">{stat.value}</p>
                  <p className="text-white/40 text-[10px] tracking-[0.2em] uppercase">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Recent Orders */}
            <div className="xl:col-span-2 bg-[#111] border border-white/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white font-serif text-xl font-light">Recent Orders</h2>
                <button className="text-cr-gold text-[10px] tracking-[0.2em] uppercase hover:underline">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="py-3 px-4 text-white/40 text-[10px] tracking-[0.2em] uppercase font-normal">Order ID</th>
                      <th className="py-3 px-4 text-white/40 text-[10px] tracking-[0.2em] uppercase font-normal">Customer</th>
                      <th className="py-3 px-4 text-white/40 text-[10px] tracking-[0.2em] uppercase font-normal">Date</th>
                      <th className="py-3 px-4 text-white/40 text-[10px] tracking-[0.2em] uppercase font-normal text-right">Amount</th>
                      <th className="py-3 px-4 text-white/40 text-[10px] tracking-[0.2em] uppercase font-normal text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-4 px-4 text-white/80 text-sm">{order.id}</td>
                        <td className="py-4 px-4 text-white/80 text-sm">{order.shippingAddress.name}</td>
                        <td className="py-4 px-4 text-white/60 text-sm">{formatDate(order.createdAt)}</td>
                        <td className="py-4 px-4 text-white text-sm text-right">{formatPrice(order.total)}</td>
                        <td className="py-4 px-4 text-center">
                          <span className={`inline-block text-[9px] tracking-widest uppercase px-2 py-1 ${
                            order.status === 'delivered' ? 'bg-green-900/40 text-green-400 border border-green-900' :
                            order.status === 'processing' ? 'bg-amber-900/40 text-amber-400 border border-amber-900' :
                            'bg-blue-900/40 text-blue-400 border border-blue-900'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-[#111] border border-white/10 p-6">
              <h2 className="text-white font-serif text-xl font-light mb-6">Top Selling</h2>
              <div className="space-y-4">
                {products.filter(p => p.isBestSeller).slice(0, 4).map((product, i) => (
                  <div key={product.id} className="flex items-center gap-4 p-3 bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                    <div className="w-12 h-16 bg-[#0a0a0a] relative overflow-hidden shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={product.variants[0]?.images[0]} alt={product.name} className="object-cover w-full h-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">{product.name}</p>
                      <p className="text-white/40 text-xs mt-1">{product.category}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-white text-sm">{formatPrice(product.price)}</p>
                      <p className="text-green-400 text-[10px] mt-1">{98 - i * 15} Sales</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
