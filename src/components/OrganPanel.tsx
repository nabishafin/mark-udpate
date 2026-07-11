import { ReactNode, useCallback, useEffect } from 'react';
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
          className="fixed bottom-3 right-2 top-24 z-40 w-[43vw] overflow-y-auto rounded-xl border border-white/10 hpe-glass-strong shadow-2xl sm:right-3 sm:w-[78vw] sm:max-w-[380px] sm:rounded-2xl lg:right-8 lg:bottom-8 lg:w-[440px] lg:max-w-none xl:w-[500px]"
          initial={{ x: '120%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '120%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 28 }}
          style={{ boxShadow: `-20px 20px 80px -20px ${color.glow}` }}
        >
          <Particles count={15} color={color.stroke} />

          <div className="relative z-10 p-3 sm:p-8">
            <div className="mb-4 flex items-center justify-between gap-2 sm:mb-6">
              <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
                <IconButton label="Previous system" onClick={goPrev}>
                  <ChevronLeft size={16} />
                </IconButton>
                <IconButton label="Next system" onClick={goNext}>
                  <ChevronRight size={16} />
                </IconButton>
                <span className="ml-1 hidden font-mono text-[10px] uppercase tracking-widest text-white/40 min-[430px]:inline sm:ml-2 sm:inline">
                  {String(index + 1).padStart(2, '0')} / {String(ORGANS.length).padStart(2, '0')}
                </span>
              </div>
              <IconButton label="Close" onClick={onClose}>
                <X size={16} />
              </IconButton>
            </div>

            <div className="mb-4 sm:mb-6">
              <h2 id="organ-title" className="text-base font-medium leading-tight tracking-tight text-white min-[430px]:text-lg sm:text-4xl">
                {organ.name}
              </h2>
              <p className="mt-1.5 text-[11px] leading-snug text-white/60 sm:mt-2 sm:text-sm">{organ.tagline}</p>
            </div>

            {organ.image && <OrganImage color={color} image={organ.image} />}

            <div className="mt-5 space-y-4 sm:mt-8 sm:space-y-5">
              <div className="space-y-3">
                {organ.sidePanelCopy.map((paragraph) => (
                  <p key={paragraph} className="text-[11px] leading-relaxed text-white/75 sm:text-sm">
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
              <div className="mt-5 sm:mt-8">
                <a
                  href="/products"
                  onClick={onClose}
                  className="flex w-full items-center justify-center rounded-xl px-3 py-3 text-center text-[11px] font-medium tracking-wide shadow-lg hpe-btn-primary sm:px-5 sm:py-3.5 sm:text-sm"
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

function IconButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white sm:h-9 sm:w-9"
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
  children: ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <CircleDot size={13} style={{ color }} />
        <div className="hpe-hud-label" style={{ color }}>
          {title}
        </div>
      </div>
      <div className="space-y-2 sm:space-y-3">{children}</div>
    </div>
  );
}

function BulletList({ items, color }: { items: string[]; color: string }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-2 text-[11px] leading-relaxed text-white/75 sm:text-sm">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full sm:mt-2" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
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
    <figure className="relative mt-4 aspect-[4/3] w-full overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] sm:mt-6 sm:aspect-[16/9] sm:rounded-2xl">
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
