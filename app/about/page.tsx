'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <div className="bg-cr-black min-h-screen">
      {/* Hero "” fashion atelier / model */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center">
        <Image
          src="https://images.unsplash.com/photo-1558769132-cb1fac08c04b?w=1920&q=90"
          alt="CALVIER ROSSEL Atelier"
          fill className="object-cover object-center" priority
        />
        <div className="absolute inset-0 bg-black/60" />
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}
          className="relative z-10 text-center max-w-3xl px-4 mt-20"
        >
          <p className="text-cr-gold text-[10px] tracking-[0.4em] uppercase mb-6">Maison Fondée en 1984</p>
          <h1 className="font-serif text-5xl md:text-7xl font-light text-white mb-6">The Legacy of CALVIER ROSSEL</h1>
        </motion.div>
      </section>

      {/* Content */}
      <section className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="prose prose-invert prose-lg mx-auto">
          <p className="lead text-xl text-white/80 font-light text-center mb-16">
            For four decades, CALVIER ROSSEL has stood at the vanguard of luxury fashion, creating pieces that transcend the ephemeral nature of trends to become enduring symbols of elegance and power.
          </p>

          <h2 className="font-serif text-3xl font-light text-white mt-16 mb-8 text-center">Our Heritage</h2>
          <p className="text-white/60 leading-relaxed mb-6 text-justify">
            Born in the heart of Paris, the Maison was founded by visionary designer Calvier Rossel, whose uncompromising dedication to craftsmanship and structural innovation quickly garnered the attention of the global elite. From the very first collection, the brand established its signature aesthetic: a meticulous balance between architectural rigidity and poetic fluidity.
          </p>

          {/* Fashion-specific editorial images: bags and shoes */}
          <div className="my-16 grid grid-cols-2 gap-8">
            <div className="relative aspect-[4/5]">
              <Image
                src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=90"
                alt="CALVIER ROSSEL Craftsmanship" fill className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/5] mt-12">
              <Image
                src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=90"
                alt="CALVIER ROSSEL Design" fill className="object-cover"
              />
            </div>
          </div>

          <h2 className="font-serif text-3xl font-light text-white mt-16 mb-8 text-center">The Atelier</h2>
          <p className="text-white/60 leading-relaxed mb-6 text-justify">
            Every garment and accessory bearing the CALVIER ROSSEL name passes through the hands of master artisans. Our ateliers in Paris and Milan are sanctuaries of slow fashion, where centuries-old techniques are preserved and elevated. We believe that true luxury lies in the unseen details — the perfect tension of a hand-stitched seam, the precise cut of a lining, the unparalleled quality of bespoke leather sourced from the world&apos;s finest tanneries.
          </p>

          <blockquote className="my-16 border-l-2 border-cr-gold pl-8 py-4">
            <p className="font-serif text-2xl font-light text-white italic leading-relaxed">
              &ldquo;We do not make clothes for the moment. We sculpt armor for the modern era — garments that empower the wearer to command any room they enter.&rdquo;
            </p>
            <footer className="text-cr-gold text-[10px] tracking-widest uppercase mt-4">— Calvier Rossel</footer>
          </blockquote>

          {/* More fashion images */}
          <div className="my-16 grid grid-cols-3 gap-4">
            <div className="relative aspect-square">
              <Image src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=90" alt="Luxury bag" fill className="object-cover" />
            </div>
            <div className="relative aspect-square">
              <Image src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=90" alt="Luxury shoe" fill className="object-cover" />
            </div>
            <div className="relative aspect-square">
              <Image src="https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?w=400&q=90" alt="Evening gown" fill className="object-cover" />
            </div>
          </div>

          <h2 className="font-serif text-3xl font-light text-white mt-16 mb-8 text-center">A Sustainable Future</h2>
          <p className="text-white/60 leading-relaxed mb-6 text-justify">
            As we look to the future, CALVIER ROSSEL remains committed to reshaping the landscape of luxury with environmental consciousness at its core. Our closed-loop production processes, ethical leather sourcing, and dedication to creating lifetime-guaranteed pieces reflect our belief that true luxury must be responsible. We are not just creating fashion; we are preserving the world that inspires it.
          </p>
        </div>
      </section>
    </div>
  );
}

