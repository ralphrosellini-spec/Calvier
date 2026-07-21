'use client';

export function AnnouncementBar() {
  const items = [
    "Complimentary worldwide shipping",
    "Signature packaging, hand-tied",
    "Numbered editions — every piece",
    "Book a private appointment • Paris • Milan • Tokyo",
  ];
  const loop = [...items, ...items, ...items];
  return (
    <div className="border-b border-border/60 bg-ink text-cream overflow-hidden">
      <div className="marquee-mask">
        <div className="cr-marquee flex gap-16 py-2.5 whitespace-nowrap">
          {loop.map((t, i) => (
            <span key={i} className="eyebrow opacity-80">
              {t} <span className="mx-8 opacity-40">✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

