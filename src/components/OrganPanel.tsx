import React, { useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, CircleDot, X } from 'lucide-react';
import { Organ, ORGANS } from './organData';
import { Particles } from './Particles';

type Props = {
  organ: Organ | null;
  onClose: () => void;
  onNavigate?: (organ: Organ) => void;
};

const COLOR_MAP = {
  blue: {
    stroke: '#3FB8FF',
    glow: 'rgba(63,184,255,0.5)',
    soft: 'rgba(63,184,255,0.12)',
  },
  gold: {
    stroke: '#F0D27A',
    glow: 'rgba(229,194,90,0.5)',
    soft: 'rgba(229,194,90,0.12)',
  },
  green: {
    stroke: '#5EE6B5',
    glow: 'rgba(94,230,181,0.5)',
    soft: 'rgba(94,230,181,0.12)',
  },
} as const;

export function OrganPanel({ organ, onClose, onNavigate }: Props) {
  const index = organ ? ORGANS.findIndex((o) => o.id === organ.id) : -1;

  const goPrev = useCallback(() => {
    if (index < 0 || !onNavigate) return;
    onNavigate(ORGANS[(index - 1 + ORGANS.length) % ORGANS.length]);
  }, [index, onNavigate]);

  const goNext = useCallback(() => {
    if (index < 0 || !onNavigate) return;
    onNavigate(ORGANS[(index + 1) % ORGANS.length]);
  }, [index, onNavigate]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, goPrev, goNext]);

  const color = organ ? COLOR_MAP[organ.color] : COLOR_MAP.blue;

  return (
    <AnimatePresence>
      {organ && (
        <motion.aside
          key="side-panel"
          role="dialog"
          aria-modal="false"
          aria-labelledby="organ-title"
          className="fixed top-24 right-3 bottom-3 w-[78vw] max-w-[330px] lg:right-8 lg:bottom-8 z-40 sm:max-w-[380px] lg:w-[440px] lg:max-w-none xl:w-[500px] hpe-glass-strong overflow-y-auto border border-white/10 rounded-2xl shadow-2xl"
          initial={{ x: '120%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '120%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 28 }}
          style={{ boxShadow: `-20px 20px 80px -20px ${color.glow}` }}
        >
          <Particles count={15} color={color.stroke} />

          <div className="relative z-10 p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <IconButton label="Previous system" onClick={goPrev}>
                  <ChevronLeft size={16} />
                </IconButton>
                <IconButton label="Next system" onClick={goNext}>
                  <ChevronRight size={16} />
                </IconButton>
                <span className="ml-2 font-mono text-[10px] uppercase tracking-widest text-white/40">
                  {String(index + 1).padStart(2, '0')} / {String(ORGANS.length).padStart(2, '0')}
                </span>
              </div>
              <IconButton label="Close" onClick={onClose}>
                <X size={16} />
              </IconButton>
            </div>

            <div className="mb-6">
              <h2 id="organ-title" className="text-3xl sm:text-4xl font-medium text-white leading-tight tracking-tight">
                {organ.name}
              </h2>
              <p className="mt-2 text-white/60 text-sm">{organ.tagline}</p>
            </div>

            {organ.image && <OrganImage color={color} image={organ.image} />}

            <div className="mt-8 space-y-5">
              <div className="space-y-3">
                {organ.sidePanelCopy.map((paragraph) => (
                  <p key={paragraph} className="text-white/75 text-sm leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              {organ.supportIntro && organ.supportBullets && (
                <PanelBlock title={organ.supportIntro} color={color.stroke}>
                  <BulletList items={organ.supportBullets} color={color.stroke} />
                </PanelBlock>
              )}

              {organ.riskIntro && organ.riskBullets && (
                <PanelBlock title={organ.riskIntro} color={color.stroke}>
                  <BulletList items={organ.riskBullets} color={color.stroke} />
                </PanelBlock>
              )}

              {organ.closingCopy?.map((paragraph) => (
                <p key={paragraph} className="text-white/75 text-sm leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {organ.microCta && (
              <div className="mt-8">
                <a
                  href="/products"
                  onClick={onClose}
                  className="w-full hpe-btn-primary rounded-xl px-5 py-3.5 text-sm font-medium tracking-wide flex items-center justify-center shadow-lg"
                >
                  {organ.microCta} →
                </a>
              </div>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

function IconButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition"
    >
      {children}
    </button>
  );
}

function PanelBlock({
  title,
  color,
  children,
}: {
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <CircleDot size={13} style={{ color }} />
        <div className="hpe-hud-label" style={{ color }}>
          {title}
        </div>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function BulletList({ items, color }: { items: string[]; color: string }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-2 text-white/75 text-sm leading-relaxed">
          <span className="mt-2 h-1.5 w-1.5 rounded-full shrink-0" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function OrganImage({
  color,
  image,
}: {
  color: { stroke: string; glow: string; soft: string };
  image: NonNullable<Organ['image']>;
}) {
  return (
    <figure className="mt-6 relative aspect-[16/9] w-full rounded-2xl bg-white/[0.04] border border-white/10 overflow-hidden">
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 40%, transparent 58%, ${color.soft} 100%)`,
          boxShadow: `inset 0 0 0 1px ${color.soft}`,
        }}
      />
      <img
        src={image.src}
        alt={image.alt}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
        style={{
          objectPosition: image.position ?? 'center',
          filter: 'saturate(1.02) contrast(1.03)',
        }}
      />
    </figure>
  );
}
