import React, { useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Activity,
  Zap,
  Droplets,
  ShieldCheck,
  ChevronLeft,
  ChevronRight } from
'lucide-react';
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
    soft: 'rgba(63,184,255,0.12)'
  },
  gold: {
    stroke: '#F0D27A',
    glow: 'rgba(229,194,90,0.5)',
    soft: 'rgba(229,194,90,0.12)'
  },
  green: {
    stroke: '#5EE6B5',
    glow: 'rgba(94,230,181,0.5)',
    soft: 'rgba(94,230,181,0.12)'
  }
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
      {organ &&
      <motion.aside
        key="side-panel"
        role="dialog"
        aria-modal="false"
        aria-labelledby="organ-title"
        className="fixed top-24 right-4 lg:right-8 bottom-4 lg:bottom-8 z-40 w-[calc(100%-2rem)] lg:w-[440px] xl:w-[500px] hpe-glass-strong overflow-y-auto border border-white/10 rounded-3xl shadow-2xl"
        initial={{
          x: '120%',
          opacity: 0
        }}
        animate={{
          x: 0,
          opacity: 1
        }}
        exit={{
          x: '120%',
          opacity: 0
        }}
        transition={{
          type: 'spring',
          stiffness: 220,
          damping: 28
        }}
        style={{
          boxShadow: `-20px 20px 80px -20px ${color.glow}`
        }}>
        
          <Particles count={15} color={color.stroke} />

          <div className="relative z-10 p-6 sm:p-8">
            {/* Top bar: navigation + close */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <button
                onClick={goPrev}
                aria-label="Previous system"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition">
                
                  <ChevronLeft size={16} />
                </button>
                <button
                onClick={goNext}
                aria-label="Next system"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition">
                
                  <ChevronRight size={16} />
                </button>
                <span className="ml-2 font-mono text-[10px] uppercase tracking-widest text-white/40">
                  {String(index + 1).padStart(2, '0')} /{' '}
                  {String(ORGANS.length).padStart(2, '0')}
                </span>
              </div>
              <button
              onClick={onClose}
              aria-label="Close"
              className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition">
              
                <X size={16} />
              </button>
            </div>

            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{
                  background: color.stroke,
                  boxShadow: `0 0 8px ${color.stroke}`
                }} />
              
                <div
                className="hpe-hud-label tracking-widest"
                style={{
                  color: color.stroke
                }}>
                
                  {organ.bodySystem}
                </div>
              </div>
              <h2
              id="organ-title"
              className="text-3xl sm:text-4xl font-medium text-white leading-tight tracking-tight">
              
                {organ.name}
              </h2>
              <p className="mt-2 text-white/60 text-sm">{organ.tagline}</p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              {organ.metrics.map((m) =>
            <div
              key={m.label}
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-3 backdrop-blur-md">
              
                  <div
                className="hpe-hud-label mb-1.5"
                style={{
                  fontSize: 9,
                  color: color.stroke
                }}>
                
                    {m.label}
                  </div>
                  <div className="font-mono text-white text-lg leading-none">
                    {m.value}
                    {m.unit &&
                <span className="text-white/40 text-[10px] ml-1">
                        {m.unit}
                      </span>
                }
                  </div>
                </div>
            )}
            </div>

            {/* Visualization */}
            <OrganVisualization color={color} id={organ.id} />

            {/* Content Sections */}
            <div className="mt-8 space-y-6">
              <PanelSection
              icon={<Activity size={14} />}
              title="Scientific Overview"
              color={color.stroke}>
              
                {organ.description}
              </PanelSection>
              <PanelSection
              icon={<Droplets size={14} />}
              title="Hydration Impact"
              color={color.stroke}>
              
                {organ.hydrationImpact}
              </PanelSection>
              <PanelSection
              icon={<ShieldCheck size={14} />}
              title="Oxidative Stress"
              color={color.stroke}>
              
                {organ.oxidativeImpact}
              </PanelSection>
              <PanelSection
              icon={<Zap size={14} />}
              title="Recovery & Performance"
              color={color.stroke}>
              
                {organ.recovery}
              </PanelSection>
            </div>

            <div className="mt-8">
              <a
              href="#products"
              onClick={onClose}
              className="w-full hpe-btn-primary rounded-xl px-5 py-3.5 text-sm font-medium tracking-wide flex items-center justify-center shadow-lg">
              
                Optimize this System →
              </a>
            </div>
          </div>
        </motion.aside>
      }
    </AnimatePresence>);

}
function PanelSection({
  icon,
  title,
  color,
  children





}: {icon: React.ReactNode;title: string;color: string;children: React.ReactNode;}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span
          style={{
            color
          }}>
          
          {icon}
        </span>
        <div
          className="hpe-hud-label"
          style={{
            color
          }}>
          
          {title}
        </div>
      </div>
      <p className="text-white/75 text-sm leading-relaxed">{children}</p>
    </div>);

}
function OrganVisualization({
  color,
  id







}: {color: {stroke: string;glow: string;soft: string;};id: string;}) {
  return (
    <div className="mt-6 relative h-40 rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 60%, ${color.soft}, transparent 70%)`
        }} />
      
      <div
        className="absolute left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${color.stroke}, transparent)`,
          animation: 'hpeScan 4s linear infinite',
          boxShadow: `0 0 16px ${color.stroke}`
        }} />
      
      <svg viewBox="0 0 400 160" className="absolute inset-0 w-full h-full">
        <defs>
          <filter id={`viz-glow-${id}`}>
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>
        <path
          d="M0 80 Q50 50 100 80 T200 80 T300 80 T400 80"
          fill="none"
          stroke={color.stroke}
          strokeWidth="1.4"
          opacity="0.7"
          filter={`url(#viz-glow-${id})`}>
          
          <animate
            attributeName="d"
            dur="4s"
            repeatCount="indefinite"
            values="
              M0 80 Q50 50 100 80 T200 80 T300 80 T400 80;
              M0 80 Q50 110 100 80 T200 80 T300 80 T400 80;
              M0 80 Q50 50 100 80 T200 80 T300 80 T400 80" />



          
        </path>
        <path
          d="M0 90 Q50 70 100 90 T200 90 T300 90 T400 90"
          fill="none"
          stroke={color.stroke}
          strokeWidth="0.8"
          opacity="0.35">
          
          <animate
            attributeName="d"
            dur="5s"
            repeatCount="indefinite"
            values="
              M0 90 Q50 70 100 90 T200 90 T300 90 T400 90;
              M0 90 Q50 120 100 90 T200 90 T300 90 T400 90;
              M0 90 Q50 70 100 90 T200 90 T300 90 T400 90" />



          
        </path>
        {[60, 140, 220, 300, 360].map((x, i) =>
        <circle
          key={x}
          cx={x}
          cy="80"
          r="3"
          fill={color.stroke}
          opacity="0.9">
          
            <animate
            attributeName="opacity"
            values="0.3;1;0.3"
            dur="2s"
            begin={`${i * 0.3}s`}
            repeatCount="indefinite" />
          
            <animate
            attributeName="r"
            values="2;4;2"
            dur="2s"
            begin={`${i * 0.3}s`}
            repeatCount="indefinite" />
          
          </circle>
        )}
      </svg>
      <div
        className="absolute bottom-2 left-3 hpe-hud-label"
        style={{
          color: color.stroke,
          fontSize: 9
        }}>
        
        LIVE SIGNAL · {id.toUpperCase()}
      </div>
    </div>);

}