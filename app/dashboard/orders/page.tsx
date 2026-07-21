'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getOrders } from '@/lib/firebase-db';
import type { Order } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';
import { Package } from 'lucide-react';

export default function OrdersPage() {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-cr-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl sm:text-4xl font-light text-white mb-4">Order History</h1>
        <p className="text-white/50 text-sm">View and track your previous orders.</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-24 bg-[#111] border border-white/10">
          <Package size={48} className="text-white/20 mx-auto mb-6" />
          <h2 className="text-white font-serif text-2xl font-light mb-2">No orders yet</h2>
          <p className="text-white/50 text-sm mb-6">When you place an order, it will appear here.</p>
          <Link href="/shop" className="text-[11px] tracking-[0.2em] uppercase bg-cr-gold text-cr-black px-8 py-3 font-semibold hover:bg-amber-400 transition-colors">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#111] border border-white/10 overflow-hidden"
            >
              {/* Order Header */}
              <div className="bg-[#1a1a1a] p-6 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12">
                  <div>
                    <p className="text-white/40 text-[10px] tracking-[0.2em] uppercase mb-1">Order Placed</p>
                    <p className="text-white text-sm">{formatDate(order.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-[10px] tracking-[0.2em] uppercase mb-1">Total</p>
                    <p className="text-white text-sm">{formatPrice(order.total)}</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-[10px] tracking-[0.2em] uppercase mb-1">Ship To</p>
                    <p className="text-white text-sm">{order.shippingAddress.name}</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-[10px] tracking-[0.2em] uppercase mb-1">Order #</p>
                    <p className="text-white text-sm">{order.id}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Link href={`/dashboard/orders/${order.id}`} className="text-cr-gold text-[10px] tracking-[0.2em] uppercase hover:underline">
                    View Invoice
                  </Link>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6">
                <div className="mb-6 flex items-center gap-4">
                  <h3 className="text-white text-lg font-medium">Status:</h3>
                  <span className="inline-block bg-white/5 text-cr-gold text-[10px] tracking-widest uppercase px-3 py-1 border border-cr-gold/30">
                    {order.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="space-y-6">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-6">
                      <div className="relative w-20 h-24 bg-white/5 shrink-0 border border-white/10 overflow-hidden">
                        {item.productImage && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.productImage} alt={item.productName || 'Product'} className="w-full h-full object-cover" />
                        )}
                        {!item.productImage && (
                          <div className="absolute inset-0 flex items-center justify-center text-white/20 text-xs">IMG</div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white text-sm font-medium mb-1">{item.productName || item.productId}</h4>
                        <p className="text-white/50 text-xs mb-1">Color: {item.color} | Size: {item.size}</p>
                        <p className="text-white/50 text-xs">Qty: {item.quantity}</p>
                        <p className="text-white text-sm mt-2">{formatPrice(item.price)}</p>
                      </div>
                      <div className="hidden sm:block">
                        <button className="text-white border border-white/20 px-4 py-2 text-[10px] tracking-[0.2em] uppercase hover:bg-white/10 transition-colors">
                          Write Review
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
