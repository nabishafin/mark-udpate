import { useState } from 'react';
import { motion } from 'framer-motion';
import { ORGANS, Organ } from './organData';
type Props = {
  onSelect: (organ: Organ) => void;
  active?: string | null;
};
const COLOR_MAP = {
  blue: {
    stroke: '#3FB8FF',
    fill: 'rgba(63,184,255,0.95)',
    glow: 'rgba(63,184,255,0.7)'
  },
  gold: {
    stroke: '#F0D27A',
    fill: 'rgba(240,210,122,0.95)',
    glow: 'rgba(229,194,90,0.7)'
  },
  green: {
    stroke: '#5EE6B5',
    fill: 'rgba(94,230,181,0.95)',
    glow: 'rgba(94,230,181,0.7)'
  }
} as const;
// Calibrated against the rendered 16:9 anatomy video frame.
const HOTSPOT_POSITIONS: Record<
  string,
  {
    x: number;
    y: number;
  }> =
{
  brain: {
    x: 50,
    y: 6.5
  },
  eyes: {
    x: 49.15,
    y: 10.6
  },
  mouth: {
    x: 50.2,
    y: 13.5
  },
  heart: {
    x: 50.2,
    y: 27.6
  },
  lungs: {
    x: 48.4,
    y: 25.4
  },
  liver: {
    x: 48.2,
    y: 37.2
  },
  gut: {
    x: 50,
    y: 44.2
  },
  kidneys: {
    x: 52.5,
    y: 40.8
  },
  joints: {
    x: 52.4,
    y: 72.2
  },
  muscles: {
    x: 42.4,
    y: 31.4
  },
  skin: {
    x: 57.8,
    y: 34.8
  },
  mitochondria: {
    x: 50.4,
    y: 57.8
  }
};
const PREVIEW_SIDE: Record<string, 'left' | 'right'> = {
  brain: 'right',
  eyes: 'left',
  mouth: 'right',
  heart: 'right',
  lungs: 'left',
  liver: 'left',
  gut: 'right',
  kidneys: 'right',
  joints: 'right',
  muscles: 'left',
  skin: 'right',
  mitochondria: 'right'
};
const BODY_VID = "/Human.webm";

export function InteractiveBody({ onSelect, active }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  const hotspotIndex = (id: string) => ORGANS.findIndex((organ) => organ.id === id);
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* HOLOGRAPHIC BODY VIDEO + HOTSPOTS */}
      <div
        className="relative hpe-body-stage hpe-body-clean-stage max-w-none lg:max-w-6xl mx-auto hpe-breathe"
        style={{
          aspectRatio: '16 / 9',
          filter: 'drop-shadow(0 26px 50px rgba(0,0,0,0.42))'
        }}>
        
        {/* Seamless looping video */}
        <video
          src={BODY_VID}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-contain select-none pointer-events-none"
          style={{
            mixBlendMode: 'screen',
            filter: 'saturate(1.15) brightness(1.08) contrast(1.05)'
          }} />

        {/* Connecting Line to Active Card */}
        {active && HOTSPOT_POSITIONS[active] &&
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-0">
            <motion.line
            initial={{
              pathLength: 0,
              opacity: 0
            }}
            animate={{
              pathLength: 1,
              opacity: 0.6
            }}
            transition={{
              duration: 0.8,
              ease: 'easeInOut'
            }}
            x1={`${HOTSPOT_POSITIONS[active].x}%`}
            y1={`${HOTSPOT_POSITIONS[active].y}%`}
            x2="100%"
            y2="50%"
            stroke={
            COLOR_MAP[ORGANS.find((o) => o.id === active)?.color || 'blue'].
            stroke
            }
            strokeWidth="1.5"
            strokeDasharray="4 4" />
          
            <motion.circle
            initial={{
              scale: 0,
              opacity: 0
            }}
            animate={{
              scale: 1,
              opacity: 1
            }}
            transition={{
              delay: 0.6,
              duration: 0.3
            }}
            cx="100%"
            cy="50%"
            r="4"
            fill={
            COLOR_MAP[ORGANS.find((o) => o.id === active)?.color || 'blue'].
            stroke
            } />
          
          </svg>
        }

        {/* HOTSPOTS */}
        {ORGANS.map((organ) => {
          const pos = HOTSPOT_POSITIONS[organ.id];
          if (!pos) return null;
          const color = COLOR_MAP[organ.color];
          const isActive = active === organ.id;
          const isHover = hovered === organ.id || isActive;
          const previewSide = PREVIEW_SIDE[organ.id] ?? (pos.x < 50 ? 'left' : 'right');
          return (
            <button
              key={organ.id}
              type="button"
              aria-label={`Inspect ${organ.name}`}
              aria-pressed={isActive}
              onMouseEnter={() => setHovered(organ.id)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(organ.id)}
              onBlur={() => setHovered(null)}
              onClick={() => onSelect(organ)}
              className="absolute -translate-x-1/2 -translate-y-1/2 group rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050608] z-10"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                width: 22,
                height: 22,
                touchAction: 'manipulation'
              }}>
              
              <span className="absolute inset-0 rounded-full" />
              <span
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-300"
                style={{
                  width: isHover ? 18 : 14,
                  height: isHover ? 18 : 14,
                  borderColor: color.stroke,
                  opacity: isHover ? 0.85 : 0.45
                }} />
              
              <span
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full hpe-ripple"
                style={{
                  width: 11,
                  height: 11,
                  border: `1.5px solid ${color.stroke}`,
                  animationDelay: `${hotspotIndex(organ.id) * 0.25 % 2.4}s`
                }} />
              
              <span
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300"
                style={{
                  width: isHover ? 7 : 5,
                  height: isHover ? 7 : 5,
                  background: color.fill,
                  boxShadow: `0 0 ${isHover ? 12 : 7}px ${color.glow}`
                }} />
              
              <span
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
                style={{
                  width: isHover ? 2.5 : 1.8,
                  height: isHover ? 2.5 : 1.8,
                  opacity: 0.95
                }} />

              <motion.span
                initial={false}
                animate={{
                  opacity: isHover ? 1 : 0,
                  x: isHover ? 0 : previewSide === 'left' ? 8 : -8,
                  y: '-50%',
                  scale: isHover ? 1 : 0.94
                }}
                transition={{ duration: 0.18 }}
                className="pointer-events-none absolute top-1/2 z-20 w-40 overflow-hidden rounded-xl border border-cyan-200/25 bg-white/[0.06] text-left shadow-[0_18px_46px_-26px_rgba(63,184,255,0.85)] backdrop-blur-md sm:w-44"
                style={{
                  ...(previewSide === 'left' ? { right: 'calc(100% + 10px)' } : { left: 'calc(100% + 10px)' }),
                  transformOrigin: previewSide === 'left' ? 'right center' : 'left center'
                }}
              >
                <span className="block p-1.5">
                  <span className="block aspect-[16/9] w-full overflow-hidden rounded-lg border border-white/10 bg-white/[0.04]">
                    <img
                      src={organ.image?.src ?? '/brand/logo.png'}
                      alt={organ.image?.alt ?? `${organ.name} preview`}
                      className="h-full w-full object-cover"
                      style={{ objectPosition: organ.image?.position ?? 'center' }}
                    />
                  </span>
                  <span className="mt-1 block min-w-0 px-0.5 pb-0.5">
                    <span className="block text-[10px] font-semibold leading-tight text-white sm:text-[11px]">
                      {organ.name}
                    </span>
                    <span className="mt-1 block text-[9px] leading-snug text-cyan-100/68 sm:text-[10px]">
                      {organ.tagline}
                    </span>
                  </span>
                </span>
              </motion.span>
              
            </button>);

        })}
      </div>
    </div>);

}
