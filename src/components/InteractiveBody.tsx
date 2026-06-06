import React, { useState } from 'react';
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
// Recalibrated for the 16:9 video frame
const HOTSPOT_POSITIONS: Record<
  string,
  {
    x: number;
    y: number;
  }> =
{
  brain: {
    x: 50,
    y: 10
  },
  eyes: {
    x: 50,
    y: 13
  },
  heart: {
    x: 50.5,
    y: 28
  },
  lungs: {
    x: 52.5,
    y: 28
  },
  liver: {
    x: 48.5,
    y: 38
  },
  gut: {
    x: 50,
    y: 45
  },
  kidneys: {
    x: 52,
    y: 42
  },
  spine: {
    x: 50,
    y: 34
  },
  joints: {
    x: 48.5,
    y: 72
  },
  muscles: {
    x: 42,
    y: 42
  },
  nervous: {
    x: 48.5,
    y: 58
  }
};
const BODY_VID = "/Human.webm";

export function InteractiveBody({ onSelect, active }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Ambient backdrop glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="hpe-glow-cyan w-[110%] h-[110%] opacity-60" />
      </div>

      {/* Orbiting rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="rounded-full border border-cyan-400/10"
          style={{
            width: '88%',
            height: '88%',
            animation: 'hpeOrbit 60s linear infinite'
          }} />
        
        <div
          className="absolute rounded-full border border-cyan-400/10 border-dashed"
          style={{
            width: '72%',
            height: '72%',
            animation: 'hpeOrbit 90s linear infinite reverse'
          }} />
        
      </div>

      {/* HOLOGRAPHIC BODY VIDEO + HOTSPOTS */}
      <div
        className="relative w-full max-w-6xl mx-auto hpe-breathe"
        style={{
          aspectRatio: '16 / 9',
          filter: 'drop-shadow(0 0 40px rgba(63,184,255,0.4))'
        }}>
        
        {/* Seamless looping video */}
        <video
          src={BODY_VID}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-contain select-none pointer-events-none"
          style={{
            mixBlendMode: 'screen',
            filter: 'saturate(1.15) brightness(1.08) contrast(1.05)'
          }} />
        

        {/* Scan line over body */}
        <div
          className="absolute left-[20%] right-[20%] h-px pointer-events-none"
          style={{
            background:
            'linear-gradient(90deg, transparent, rgba(63,184,255,0.9), transparent)',
            boxShadow: '0 0 20px rgba(63,184,255,0.8)',
            animation: 'hpeScan 8s linear infinite'
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
          return (
            <button
              key={organ.id}
              type="button"
              aria-label={`Inspect ${organ.name}`}
              onMouseEnter={() => setHovered(organ.id)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(organ.id)}
              onBlur={() => setHovered(null)}
              onClick={() => onSelect(organ)}
              className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none z-10"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                width: 44,
                height: 44
              }}>
              
              <span className="absolute inset-0 rounded-full" />
              <span
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-300"
                style={{
                  width: isHover ? 32 : 24,
                  height: isHover ? 32 : 24,
                  borderColor: color.stroke,
                  opacity: isHover ? 0.85 : 0.45
                }} />
              
              <span
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full hpe-ripple"
                style={{
                  width: 24,
                  height: 24,
                  border: `1.5px solid ${color.stroke}`,
                  animationDelay: `${ORGANS.indexOf(organ) * 0.25 % 2.4}s`
                }} />
              
              <span
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300"
                style={{
                  width: isHover ? 12 : 8,
                  height: isHover ? 12 : 8,
                  background: color.fill,
                  boxShadow: `0 0 ${isHover ? 18 : 10}px ${color.glow}`
                }} />
              
              <span
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
                style={{
                  width: isHover ? 4 : 3,
                  height: isHover ? 4 : 3,
                  opacity: 0.95
                }} />
              
            </button>);

        })}
      </div>
    </div>);

}