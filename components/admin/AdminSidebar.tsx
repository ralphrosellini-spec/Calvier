'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Users, ShoppingBag, TrendingUp, 
  PackageSearch, Settings, LogOut, Image as ImageIcon
} from 'lucide-react';


export function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', icon: TrendingUp, href: '/admin' },
    { label: 'Orders', icon: ShoppingBag, href: '/admin/orders' },
    { label: 'Products', icon: PackageSearch, href: '/admin/products' },
    { label: 'Site Content', icon: ImageIcon, href: '/admin/content' },
    { label: 'Customers', icon: Users, href: '/admin/customers' },
    { label: 'Settings', icon: Settings, href: '/admin/settings' },
  ];

  return (
    <aside className="w-64 bg-[#0a0a0a] border-r border-white/10 flex flex-col hidden lg:flex shrink-0 min-h-[calc(100vh-80px)]">
      <div className="p-6 border-b border-white/10">
        <Link href="/" className="font-display text-xl tracking-[0.3em] text-white">
          CALVIER ROSSEL
        </Link>
        <p className="text-gold text-[9px] tracking-widest uppercase mt-4">Admin Portal</p>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item, i) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={i}
              href={item.href}
              className={`w-full flex items-center gap-3 px-4 py-3 text-[11px] tracking-[0.2em] uppercase transition-colors rounded-sm ${
                active ? 'bg-gold text-ink font-semibold' : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-white/10">
        <Link href="/" className="flex items-center gap-3 px-4 py-3 text-[11px] tracking-[0.2em] uppercase text-white/40 hover:text-white hover:bg-white/5 transition-colors">
          <LogOut size={16} /> Exit Admin
        </Link>
      </div>
    </aside>
  );
}
