import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { InteractiveBody } from './InteractiveBody';
import { Particles } from './Particles';
import { Organ } from './organData';

type Props = {
  onSelectOrgan: (organ: Organ) => void;
  activeId?: string | null;
};

export function Hero({ onSelectOrgan, activeId }: Props) {
  return (
    <section id="top" className="relative min-h-screen w-full overflow-hidden pt-28 pb-12">
      <div className="absolute inset-0 hpe-grid opacity-50" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] hpe-glow-cyan opacity-50" />
      <div className="absolute -bottom-40 right-0 w-[600px] h-[600px] hpe-glow-gold opacity-30" />
      <Particles count={40} />

      <div className="relative z-10 w-full px-6 flex flex-col items-center min-h-[calc(100vh-7rem)] justify-center">
        <div
          className={`transition-all duration-700 ease-in-out w-full flex flex-col items-center text-center max-w-3xl z-20 ${
            activeId ? 'opacity-0 h-0 overflow-hidden scale-95' : 'opacity-100 h-auto scale-100 mb-12'
          }`}
        >
          <div className="inline-flex items-center gap-2 hpe-glass rounded-full px-3 py-1.5 mb-4">
            <Sparkles size={12} className="text-cyan-300" />
            <span className="hpe-hud-label" style={{ fontSize: 10 }}>
              Mdrn-Life DDW - 5 ppm
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight leading-[1.05]">
            <span className="hpe-text-chrome">Explore Hydration</span>
            <br />
            <span className="text-white/70">at the</span>{' '}
            <span style={{ color: '#3FB8FF', textShadow: '0 0 24px rgba(63,184,255,0.5)' }}>
              Cellular Level
            </span>
          </h1>

          <p className="mt-3 text-white/65 text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
            Independently verified 5 ppm deuterium-depleted water, made for
            cellular hydration, recovery support, and everyday longevity routines.
          </p>
        </div>

        <div className="relative w-full flex items-center justify-center mt-8 min-h-[58vh] sm:min-h-[64vh] lg:min-h-0">
          <div
            className={`hidden lg:flex absolute left-12 top-1/2 -translate-y-1/2 flex-col gap-6 transition-all duration-700 ${
              activeId ? 'opacity-0 -translate-x-10' : 'opacity-100 translate-x-0'
            }`}
          >
            <SpecBlock label="DEUTERIUM" value="5" unit="ppm" />
            <SpecBlock label="LABS" value="2" unit="independent" />
          </div>

          <div
            className={`relative w-full max-w-none flex-1 flex items-center justify-center transition-all duration-700 ease-in-out ${
              activeId ? '-translate-x-[34vw] sm:-translate-x-[24vw] lg:-translate-x-[15vw] scale-100' : 'translate-x-0 scale-100 sm:scale-110 lg:scale-125'
            }`}
            id="body"
            style={{ minHeight: '58vh' }}
          >
            <InteractiveBody onSelect={onSelectOrgan} active={activeId} />
          </div>

          <div
            className={`hidden lg:flex absolute right-12 top-1/2 -translate-y-1/2 flex-col gap-6 transition-all duration-700 ${
              activeId ? 'opacity-0 translate-x-10' : 'opacity-100 translate-x-0'
            }`}
          >
            <SpecBlock label="FORMATS" value="2" unit="bottle types" />
            <SpecBlock label="ORIGIN" value="US" unit="made" />
          </div>
        </div>

        <div
          className={`w-full flex flex-col items-center gap-6 transition-all duration-700 ease-in-out z-20 ${
            activeId ? 'opacity-0 h-0 overflow-hidden scale-95' : 'opacity-100 h-auto scale-100 mt-2'
          }`}
        >
          <div className="flex flex-wrap gap-3 justify-center">
            <a href="#top" className="hpe-btn-primary rounded-xl px-5 py-3 text-sm font-medium tracking-wide inline-flex items-center gap-2">
              Explore the Body
              <ArrowRight size={14} />
            </a>
            <a href="#science/lab-testing" className="hpe-btn-ghost rounded-xl px-5 py-3 text-sm font-medium tracking-wide inline-flex items-center gap-2">
              View Lab Testing
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function SpecBlock({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="hpe-glass rounded-xl px-3 py-3 text-center">
      <div className="hpe-hud-label" style={{ fontSize: 9 }}>
        {label}
      </div>
      <div className="text-white font-mono text-lg leading-none mt-1.5">
        {value}
        <span className="text-white/40 text-[10px] ml-1">{unit}</span>
      </div>
    </div>
  );
}
