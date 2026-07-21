import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { ThemeProvider } from '@/components/providers/ThemeProvider';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CALVIER ROSSEL — Luxury Shoes & Bags',
  description: 'CALVIER ROSSEL is an internationally recognized luxury fashion house crafting timeless leather shoes and bags in limited editions.',
  authors: [{ name: 'CALVIER ROSSEL' }],
  openGraph: {
    title: 'CALVIER ROSSEL — Luxury Shoes & Bags',
    description: 'CALVIER ROSSEL is an internationally recognized luxury fashion house crafting timeless leather shoes and bags in limited editions.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@calvierrossel',
    title: 'CALVIER ROSSEL — Luxury Shoes & Bags',
    description: 'CALVIER ROSSEL is an internationally recognized luxury fashion house crafting timeless leather shoes and bags in limited editions.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${cormorant.variable} bg-cream text-ink antialiased min-h-screen flex flex-col`}>
        <ThemeProvider>
          <AnnouncementBar />
          <Navbar />
          <CartDrawer />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

