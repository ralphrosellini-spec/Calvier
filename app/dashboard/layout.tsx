'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Heart, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Orders', href: '/dashboard/orders', icon: ShoppingBag },
    { label: 'Wishlist', href: '/dashboard/wishlist', icon: Heart },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-cr-black pt-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-12">
          
          {/* Sidebar */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="bg-[#111] border border-white/10 p-8 sticky top-28">
              <h2 className="font-serif text-2xl text-white font-light mb-8">My Account</h2>
              <nav className="space-y-2">
                {navItems.map(item => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-4 px-4 py-3 text-[11px] tracking-[0.2em] uppercase transition-colors",
                        isActive ? "bg-cr-gold text-cr-black font-semibold" : "text-white/60 hover:text-white hover:bg-white/5"
                      )}
                    >
                      <Icon size={16} />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
              
              <div className="mt-8 pt-8 border-t border-white/10">
                <button className="flex items-center gap-4 px-4 py-3 text-[11px] tracking-[0.2em] uppercase text-white/40 hover:text-white hover:bg-white/5 transition-colors w-full text-left">
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
