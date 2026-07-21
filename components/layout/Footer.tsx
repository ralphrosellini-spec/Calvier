'use client';

import Link from 'next/link';

export function Footer() {
  const cols = [
    {
      title: "Maison",
      links: ["Our story", "Ateliers", "Craftsmanship", "Sustainability", "Careers"],
    },
    {
      title: "Client Services",
      links: ["Contact", "Orders & shipping", "Returns", "Product care", "Size guide"],
    },
    {
      title: "Boutiques",
      links: ["Paris â₹” Rue Saint-HonorÃ©", "Milan â₹” Via Montenapoleone", "Tokyo â₹” Ginza", "Private appointments"],
    },
  ];

  return (
    <footer className="bg-ink text-cream">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12 pt-24 pb-10">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="font-display text-3xl tracking-[0.3em]">CALVIER ROSSEL</div>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-cream/70">
              An internationally recognized luxury fashion house crafting timeless leather shoes
              and bags in numbered editions since 1926.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-8 flex items-center gap-3 border-b border-cream/25 pb-3 max-w-md"
            >
              <input
                className="w-full bg-transparent outline-none placeholder:text-cream/40 text-sm"
                placeholder="Your private email"
              />
              <button className="eyebrow text-gold">Subscribe</button>
            </form>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <div className="eyebrow text-gold/80">{c.title}</div>
              <ul className="mt-6 space-y-3 text-sm text-cream/80">
                {c.links.map((l) => (
                  <li key={l}>
                    <Link href="/" className="link-underline">
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-t border-cream/15 pt-8">
          <div className="eyebrow opacity-60">Â© 2026 CALVIER ROSSEL. All Rights Reserved.</div>
          <div className="flex gap-8 eyebrow opacity-60">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Cookies</span>
            <span>EN Â· EUR</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

