/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { getProducts } from '@/lib/firebase-db';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { Product } from '@/types';

interface HomepageContent {
  heroImage: string;
  campaignBagsImage: string;
  campaignShoesImage: string;
  featuredSplitImage: string;
}

const defaultContent: HomepageContent = {
  heroImage: '/hero-1.jpg',
  campaignBagsImage: '/campaign-bags.jpg',
  campaignShoesImage: '/campaign-shoes.jpg',
  featuredSplitImage: '/bag-1.jpg',
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [content, setContent] = useState<HomepageContent>(defaultContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [fetchedProducts, docSnap] = await Promise.all([
          getProducts(),
          getDoc(doc(db, 'site_content', 'homepage'))
        ]);
        
        setProducts(fetchedProducts);
        
        if (docSnap.exists()) {
          setContent(docSnap.data() as HomepageContent);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <>
      <Hero image={content.heroImage} />
      <NewCollection products={products} loading={loading} />
      <MarqueeWords />
      <FeaturedSplit image={content.featuredSplitImage} />
      <BestSellers products={products} loading={loading} />
      <Categories />
      <EditorialStory />
      <Timeline />
      <Campaign bagsImage={content.campaignBagsImage} shoesImage={content.campaignShoesImage} />
      <Testimonials />
      <Instagram />
      <Newsletter />
    </>
  );
}

/* ---------- HERO ---------- */
function Hero({ image }: { image: string }) {
  return (
    <section className="relative h-[100svh] w-full overflow-hidden bg-ink text-cream -mt-16 md:-mt-20">
      <img
        src={image}
        alt="Calvier Rossel â₹” Autumn 2026 campaign"
        className="absolute inset-0 h-full w-full object-cover opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-transparent to-ink/60" />

      <div className="absolute inset-0 mx-auto flex max-w-[1600px] flex-col justify-end px-6 md:px-12 pb-24 md:pb-28">
        <div className="max-w-3xl">
          <div className="eyebrow text-cream/70 cr-reveal">Autumn â₹” Winter Â· MMXXVI</div>
          <h1 className="mt-6 font-display text-[56px] sm:text-[84px] md:text-[128px] leading-[0.9]">
            <span className="block overflow-hidden">
              <span className="block cr-rise" style={{ animationDelay: "120ms" }}>
                A study in
              </span>
            </span>
            <span className="block overflow-hidden">
              <span className="block italic text-cream/95 cr-rise" style={{ animationDelay: "260ms" }}>
                quiet luxury.
              </span>
            </span>
          </h1>
          <p
            className="mt-8 max-w-md text-sm md:text-base text-cream/75 cr-reveal"
            style={{ animationDelay: "520ms" }}
          >
            Twelve shoes. Nine bags. Every piece numbered and stitched by a single hand in our
            Firenze atelier.
          </p>
          <div
            className="mt-10 flex flex-wrap items-center gap-4 cr-reveal"
            style={{ animationDelay: "700ms" }}
          >
            <Link
              href="/shop"
              className="group inline-flex items-center gap-3 bg-cream text-ink px-8 py-4 eyebrow"
            >
              Discover the collection
              <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
            </Link>
            <Link href="/shop" className="eyebrow link-underline text-cream/90">
              Book an appointment
            </Link>
          </div>
        </div>
      </div>

      {/* Floating meta */}
      <div className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-end gap-3">
        <div className="eyebrow text-cream/70">Look 01 / 24</div>
        <div className="h-24 w-px bg-cream/30" />
        <div className="eyebrow text-cream/70 [writing-mode:vertical-rl] rotate-180">
          Firenze â₹” Paris â₹” Tokyo
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute left-1/2 bottom-8 -translate-x-1/2 flex flex-col items-center gap-3 text-cream/70">
        <span className="eyebrow">Scroll</span>
        <div className="relative h-10 w-px bg-cream/20 overflow-hidden">
          <span
            className="absolute inset-x-0 top-0 h-4 bg-cream"
            style={{ animation: "cr-scroll-hint 2.4s ease-in-out infinite" }}
          />
        </div>
      </div>
    </section>
  );
}

/* ---------- NEW COLLECTION ---------- */
function NewCollection({ products, loading }: { products: Product[], loading: boolean }) {
  const items = products.slice(0, 4);
  return (
    <section className="mx-auto max-w-[1600px] px-6 md:px-12 py-24 md:py-36">
      <div className="flex items-end justify-between gap-6 mb-14">
        <div>
          <div className="eyebrow text-muted-foreground">Chapter I</div>
          <h2 className="mt-4 font-display text-5xl md:text-7xl">The New Collection</h2>
        </div>
        <Link href="/shop" className="eyebrow link-underline hidden md:inline-flex items-center gap-2">
          View all <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <div className="col-span-full py-12 text-center text-muted-foreground">Loading collection...</div>
        ) : (
          items.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))
        )}
      </div>
    </section>
  );
}

/* ---------- MARQUEE ---------- */
function MarqueeWords() {
  const words = ["Firenze", "â₹¢", "Handcrafted", "â₹¢", "Numbered", "â₹¢", "Since 1926", "â₹¢"];
  const loop = [...words, ...words, ...words, ...words];
  return (
    <section className="border-y border-border/60 py-8 overflow-hidden bg-bone">
      <div className="marquee-mask">
        <div className="cr-marquee flex gap-12 whitespace-nowrap">
          {loop.map((w, i) => (
            <span key={i} className="font-display italic text-4xl md:text-6xl text-ink/70">
              {w}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- FEATURED SPLIT ---------- */
function FeaturedSplit({ image }: { image: string }) {
  return (
    <section className="mx-auto max-w-[1600px] px-6 md:px-12 py-24 md:py-36 grid gap-14 lg:grid-cols-2 items-center">
      <div className="relative aspect-[4/5] hover-zoom">
        <img src={image} alt="Atelier Top Handle" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
      </div>
      <div className="max-w-lg">
        <div className="eyebrow text-muted-foreground">Featured â₹” Icons</div>
        <h3 className="mt-5 font-display text-5xl md:text-6xl">The Atelier Top Handle</h3>
        <p className="mt-6 text-muted-foreground leading-relaxed">
          Numbered and signed. Eighteen hours of hand assembly, three grades of leather selection,
          one signature silhouette that closes with the whisper of a gold clasp.
        </p>
        <ul className="mt-8 space-y-3 text-sm">
          {["Chevre grained leather", "Solid brass fittings, gold-plated", "Hand-tied signature packaging"].map((f) => (
            <li key={f} className="flex items-center gap-3">
              <span className="h-px w-6 bg-ink/50" /> {f}
            </li>
          ))}
        </ul>
        <div className="mt-10 flex items-center gap-6">
          <Link
            href="/product/atelier-top-handle"
            className="bg-ink text-cream px-8 py-4 eyebrow inline-flex items-center gap-3 group"
          >
            Discover
            <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
          </Link>
          <span className="font-serif text-2xl">&#8377; 2,450</span>
        </div>
      </div>
    </section>
  );
}

/* ---------- BEST SELLERS ---------- */
function BestSellers({ products, loading }: { products: Product[], loading: boolean }) {
  // Use a different slice for best sellers just for variation
  const items = products.filter(p => p.isBestSeller).slice(0, 4);
  const displayItems = items.length > 0 ? items : products.slice(2, 6);

  return (
    <section className="bg-ink text-cream">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12 py-24 md:py-36">
        <div className="flex items-end justify-between mb-14">
          <div>
            <div className="eyebrow text-cream/60">Most desired</div>
            <h2 className="mt-4 font-display text-5xl md:text-7xl">Best sellers</h2>
          </div>
          <Link href="/shop" className="eyebrow link-underline hidden md:inline">
            The full house â†’
          </Link>
        </div>
        <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            <div className="col-span-full py-12 text-center text-cream/60">Loading best sellers...</div>
          ) : (
            displayItems.map((p, i) => (
              <div key={p.id} className="cr-reveal" style={{ animationDelay: `${i * 90}ms` }}>
                <Link
                  href={`/product/${p.slug}`}
                  className="group block"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-charcoal">
                    <img 
                      src={p.variants?.[0]?.images?.[0] || '/shoe-1.jpg'} 
                      alt={p.name} 
                      loading="lazy" 
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-105" 
                    />
                    <div className="absolute left-4 top-4 eyebrow text-cream/80">NÂ° 0{i + 1}</div>
                  </div>
                  <div className="mt-5 flex justify-between">
                    <div>
                      <div className="eyebrow text-cream/50">{p.category}</div>
                      <div className="font-serif text-xl mt-1">{p.name}</div>
                    </div>
                    <div className="font-serif text-lg tabular-nums">&#8377; {p.price.toLocaleString('en-IN')}</div>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------- CATEGORIES ---------- */
function Categories() {
  const cats = [
    { name: "Shoes", copy: "Twelve silhouettes. One heel language.", img: "/shoe-1.jpg", to: "/shop" },
    { name: "Bags", copy: "Nine editions. Hand-numbered.", img: "/bag-1.jpg", to: "/shop" },
    { name: "Voyage", copy: "For miles that deserve better.", img: "/shoe-3.jpg", to: "/shop" },
  ];
  return (
    <section className="mx-auto max-w-[1600px] px-6 md:px-12 py-24 md:py-36">
      <div className="text-center mb-16">
        <div className="eyebrow text-muted-foreground">The House</div>
        <h2 className="mt-4 font-display text-5xl md:text-7xl">Explore by category</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {cats.map((c, i) => (
          <Link
            key={c.name}
            href={c.to}
            className="group relative aspect-[4/5] overflow-hidden bg-bone cr-reveal"
            style={{ animationDelay: `${i * 120}ms` }}
          >
            <img
              src={c.img}
              alt={c.name}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-[1.06]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8 text-cream">
              <div className="eyebrow text-cream/70">Category</div>
              <div className="mt-3 font-display text-4xl md:text-5xl">{c.name}</div>
              <div className="mt-2 text-sm text-cream/80">{c.copy}</div>
              <div className="mt-6 inline-flex items-center gap-2 eyebrow">
                Discover <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ---------- EDITORIAL STORY ---------- */
function EditorialStory() {
  return (
    <section className="bg-bone">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12 py-24 md:py-36 grid gap-16 lg:grid-cols-[1fr_1.2fr] items-center">
        <div>
          <div className="eyebrow text-muted-foreground">The Story</div>
          <h2 className="mt-5 font-display text-5xl md:text-7xl leading-[0.95]">
            One hide.<br />
            <span className="italic">One artisan.</span><br />
            One signature.
          </h2>
          <p className="mt-8 max-w-md text-muted-foreground leading-relaxed">
            Every Calvier Rossel piece begins as a single full-grain hide, chosen by the artisan
            who will finish it. From first cut to final polish, only one pair of hands touches
            the leather. It is signed inside, and numbered outside.
          </p>
          <Link href="/" className="mt-10 inline-flex eyebrow link-underline items-center gap-2">
            Read the Journal <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="relative aspect-[4/5] hover-zoom">
          <img src="/craft.png" alt="Hand stitching detail" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        </div>
      </div>
    </section>
  );
}

/* ---------- TIMELINE ---------- */
function Timeline() {
  const events = [
    { y: "1926", t: "Firenze", d: "Calvier Rossel opens a single-room atelier off Piazza della Signoria." },
    { y: "1954", t: "The Pump", d: "The Rossel Pump is introduced. It has been in production, uninterrupted, ever since." },
    { y: "1982", t: "Paris", d: "The Rue Saint-HonorÃ© flagship opens with the debut of the Atelier Top Handle." },
    { y: "2011", t: "Tokyo", d: "Ginza opens. A dedicated made-to-order salon on the fourth floor." },
    { y: "2026", t: "One hundred", d: "A centennial collection of twelve shoes and nine bags, each numbered 001â₹“100." },
  ];
  return (
    <section className="mx-auto max-w-[1600px] px-6 md:px-12 py-24 md:py-36">
      <div className="text-center mb-20">
        <div className="eyebrow text-muted-foreground">Since 1926</div>
        <h2 className="mt-4 font-display text-5xl md:text-7xl">One hundred years, quietly.</h2>
      </div>
      <ol className="relative border-l border-border pl-10 space-y-14 max-w-3xl mx-auto">
        {events.map((e) => (
          <li key={e.y} className="relative cr-reveal">
            <span className="absolute -left-[46px] top-2 h-2.5 w-2.5 rounded-full bg-ink" />
            <div className="font-serif text-4xl">{e.y}</div>
            <div className="eyebrow mt-2 text-muted-foreground">{e.t}</div>
            <p className="mt-3 text-muted-foreground leading-relaxed max-w-xl">{e.d}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ---------- CAMPAIGN ---------- */
function Campaign({ bagsImage, shoesImage }: { bagsImage: string, shoesImage: string }) {
  return (
    <section className="grid md:grid-cols-2">
      {[
        { img: bagsImage, tag: "Bags Â· The New Guard", cta: "Enter the campaign" },
        { img: shoesImage, tag: "Shoes Â· The Silhouette Study", cta: "Step inside" },
      ].map((c) => (
        <Link key={c.tag} href="/shop" className="group relative block aspect-[4/5] md:aspect-auto md:h-[85vh] overflow-hidden">
          <img
            src={c.img}
            alt={c.tag}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1600ms] group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-ink/30 group-hover:bg-ink/20 transition-colors duration-700" />
          <div className="absolute inset-x-0 bottom-0 p-10 md:p-14 text-cream">
            <div className="eyebrow text-cream/80">{c.tag}</div>
            <div className="mt-4 font-display italic text-4xl md:text-6xl">Campaign 26</div>
            <div className="mt-6 eyebrow link-underline inline-flex items-center gap-2">
              {c.cta} <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </Link>
      ))}
    </section>
  );
}

/* ---------- TESTIMONIALS ---------- */
function Testimonials() {
  const quotes = [
    { q: "The most quietly powerful shoe I own.", a: "Vogue Paris" },
    { q: "A house that measures time in decades, not seasons.", a: "The Business of Fashion" },
    { q: "Every stitch is a whisper. Nothing shouts.", a: "T Magazine" },
  ];
  return (
    <section className="bg-ink text-cream">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 py-24 md:py-36 grid gap-14 md:grid-cols-3">
        {quotes.map((q, i) => (
          <figure key={i} className="cr-reveal" style={{ animationDelay: `${i * 120}ms` }}>
            <div className="font-serif text-2xl md:text-3xl italic leading-snug">â₹œ{q.q}â₹</div>
            <figcaption className="mt-8 eyebrow text-cream/60">â₹” {q.a}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

/* ---------- INSTAGRAM ---------- */
function Instagram() {
  const imgs = ["/bag-1.jpg", "/shoe-1.jpg", "/shoe-3.jpg", "/hero-1.jpg", "/hero-1.jpg", "/campaign-bags.jpg"];
  return (
    <section className="mx-auto max-w-[1600px] px-6 md:px-12 py-24 md:py-36">
      <div className="flex items-end justify-between mb-10">
        <div>
          <div className="eyebrow text-muted-foreground">Follow</div>
          <h2 className="mt-3 font-display text-4xl md:text-6xl">@calvierrossel</h2>
        </div>
        <a href="#" className="eyebrow link-underline hidden md:inline">Open Instagram â†’</a>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
        {imgs.map((src, i) => (
          <a key={i} href="#" className="group relative aspect-square overflow-hidden bg-bone">
            <img src={src} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110" />
            <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/30 transition-colors" />
          </a>
        ))}
      </div>
    </section>
  );
}

/* ---------- NEWSLETTER ---------- */
function Newsletter() {
  return (
    <section className="bg-bone">
      <div className="mx-auto max-w-3xl px-6 py-24 md:py-32 text-center">
        <div className="eyebrow text-muted-foreground">The Correspondence</div>
        <h2 className="mt-4 font-display text-5xl md:text-6xl leading-tight">
          Private letters from the atelier.
        </h2>
        <p className="mt-6 text-muted-foreground">
          Four times a year. Never more. New editions, private events, and the occasional
          essay on craft.
        </p>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="mt-10 flex items-center gap-4 border-b border-ink/30 pb-3 max-w-lg mx-auto"
        >
          <input
            className="flex-1 bg-transparent outline-none placeholder:text-ink/40"
            placeholder="Your private email address"
          />
          <button className="eyebrow">Subscribe â†’</button>
        </form>
      </div>
    </section>
  );
}

