import React, { ComponentType } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Atom,
  Brain,
  Droplets,
  Eye,
  Footprints,
  Heart,
  Shield,
  Smile,
  Wind,
} from 'lucide-react';
import { Organ, ORGANS } from './organData';

type Props = {
  onSelectOrgan: (organ: Organ) => void;
};

const ICONS: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  brain: Brain,
  eyes: Eye,
  mouth: Smile,
  heart: Heart,
  lungs: Wind,
  liver: Droplets,
  gut: Activity,
  kidneys: Droplets,
  joints: Footprints,
  muscles: Activity,
  skin: Shield,
  mitochondria: Atom,
};

const FEATURED = [
  'brain',
  'eyes',
  'mouth',
  'heart',
  'lungs',
  'liver',
  'gut',
  'kidneys',
  'muscles',
  'joints',
  'skin',
  'mitochondria',
];

export function OrganShowcase({ onSelectOrgan }: Props) {
  return (
    <section id="systems" className="hpe-section relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <h2 className="text-3xl sm:text-5xl font-medium text-white tracking-tight leading-[1.05]">
            <span className="text-white/80">Every system,</span>{' '}
            <span className="hpe-text-chrome">mapped to hydration.</span>
          </h2>
          <p className="mt-5 text-white/60 text-base sm:text-lg leading-relaxed">
            Click any system below to inspect the hydration support message,
            educational body content, and available conversion CTA.
          </p>
        </motion.div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURED.map((id, i) => {
            const organ = ORGANS.find((o) => o.id === id);
            if (!organ) return null;
            const Icon = ICONS[id] || Activity;
            const color = organ.color;

            return (
              <motion.button
                key={id}
                onClick={() => onSelectOrgan(organ)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                className="text-left hpe-glass rounded-2xl p-6 relative group overflow-hidden transition-all"
                style={{ transitionDuration: '300ms' }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background:
                      color === 'gold'
                        ? 'radial-gradient(circle at 50% 0%, rgba(229,194,90,0.14), transparent 70%)'
                        : color === 'green'
                          ? 'radial-gradient(circle at 50% 0%, rgba(94,230,181,0.14), transparent 70%)'
                          : 'radial-gradient(circle at 50% 0%, rgba(63,184,255,0.14), transparent 70%)',
                  }}
                />

                <div className="relative">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                    style={{
                      background:
                        color === 'gold'
                          ? 'rgba(229,194,90,0.1)'
                          : color === 'green'
                            ? 'rgba(94,230,181,0.1)'
                            : 'rgba(63,184,255,0.1)',
                      border:
                        color === 'gold'
                          ? '1px solid rgba(229,194,90,0.3)'
                          : color === 'green'
                            ? '1px solid rgba(94,230,181,0.3)'
                            : '1px solid rgba(63,184,255,0.3)',
                    }}
                  >
                    <Icon
                      size={18}
                      className={
                        color === 'gold'
                          ? 'text-amber-200'
                          : color === 'green'
                            ? 'text-emerald-300'
                            : 'text-cyan-300'
                      }
                    />
                  </div>
                  <div
                    className="hpe-hud-label mb-1"
                    style={{
                      color: color === 'gold' ? '#F0D27A' : color === 'green' ? '#5EE6B5' : '#3FB8FF',
                    }}
                  >
                    {organ.bodySystem}
                  </div>
                  <h3 className="text-white text-lg font-medium leading-snug">{organ.name}</h3>
                  <p className="mt-2 text-white/55 text-sm leading-snug line-clamp-2">{organ.tagline}</p>
                  <div className="mt-4 flex items-center gap-1.5 text-xs text-white/40 group-hover:text-white/80 transition">
                    <span className="font-mono uppercase tracking-widest">Inspect</span>
                    <span>→</span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
