'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Heart, MapPin, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { getOrders } from '@/lib/firebase-db';
import type { Order } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';

export default function DashboardOverview() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders().then(data => {
      // Sort orders by date descending
      const sorted = [...data].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setOrders(sorted);
      setLoading(false);
    }).catch(error => {
      console.error("Failed to fetch orders", error);
      setLoading(false);
    });
  }, []);

  const recentOrders = orders.slice(0, 2);

  const stats = [
    { label: 'Total Orders', value: orders.length.toString(), icon: Package, href: '/dashboard/orders' },
    { label: 'Wishlist Items', value: '12', icon: Heart, href: '/dashboard/wishlist' },
    { label: 'Saved Addresses', value: '2', icon: MapPin, href: '/dashboard/settings' },
    { label: 'Payment Methods', value: '1', icon: CreditCard, href: '/dashboard/settings' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-cr-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div>
        <h1 className="font-serif text-3xl sm:text-4xl font-light text-white mb-4">Welcome back, Sophia</h1>
        <p className="text-white/50 text-sm">Manage your orders, update your profile, and curate your wishlist.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={stat.href} className="block bg-[#111] border border-white/10 p-6 hover:border-cr-gold/50 transition-colors group">
                <Icon size={24} className="text-cr-gold mb-4 group-hover:scale-110 transition-transform" />
                <p className="text-white text-2xl font-light mb-1">{stat.value}</p>
                <p className="text-white/50 text-[10px] tracking-[0.2em] uppercase">{stat.label}</p>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Orders Overview */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl font-light text-white">Recent Orders</h2>
          <Link href="/dashboard/orders" className="text-cr-gold text-[10px] tracking-[0.2em] uppercase hover:underline">
            View All
          </Link>
        </div>

        <div className="space-y-4">
          {recentOrders.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.2 }}
              className="bg-[#111] border border-white/10 p-6 flex flex-col sm:flex-row gap-6 justify-between sm:items-center"
            >
              <div>
                <p className="text-white text-sm font-medium mb-1">Order {order.id}</p>
                <p className="text-white/50 text-xs mb-3">Placed on {formatDate(order.createdAt)}</p>
                <span className="inline-block bg-white/5 text-cr-gold text-[10px] tracking-widest uppercase px-3 py-1 border border-cr-gold/30">
                  {order.status}
                </span>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-white/50 text-xs mb-1">Total Amount</p>
                <p className="text-white text-lg font-light mb-4">{formatPrice(order.total)}</p>
                <Link href={`/dashboard/orders/${order.id}`} className="text-white text-[10px] tracking-[0.2em] uppercase border-b border-white/30 pb-1 hover:border-cr-gold hover:text-cr-gold transition-colors">
                  View Details
                </Link>
              </div>
            </motion.div>
          ))}
          {recentOrders.length === 0 && (
             <div className="text-white/50 text-sm py-4">No recent orders found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
