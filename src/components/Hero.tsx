import React from 'react';
import { ShieldCheck, Sparkles } from 'lucide-react';
import { InteractiveBody } from './InteractiveBody';
import { Organ } from './organData';

type Props = {
  onSelectOrgan: (organ: Organ) => void;
  activeId?: string | null;
};

export function Hero({ onSelectOrgan, activeId }: Props) {
  return (
    <section id="top" className="relative min-h-screen w-full overflow-hidden pt-28 pb-12 hpe-hero-premium">
      <div className="absolute inset-0 hpe-hero-liquid" />

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
            <span className="hpe-text-chrome">Every Cell Needs Energy.</span>
            <br />
            <span className="text-white/70">Every System Needs</span>{' '}
            <span style={{ color: '#3FB8FF', textShadow: '0 0 24px rgba(63,184,255,0.5)' }}>
              Hydration.
            </span>
          </h1>

          <p className="mt-3 text-white/65 text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
            Explore how advanced deuterium-depleted hydration supports the brain, joints, gut,
            energy production, recovery, and healthy aging.
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

        <div className="absolute bottom-5 inset-x-0 z-10 hidden sm:flex justify-center px-6 pointer-events-none">
          <div className="hpe-glass rounded-full px-5 py-2.5 flex items-center gap-3 sm:gap-5 pointer-events-auto">
            {[
              'Independently Tested',
              'IRMS Verified',
              'Produced to 5 PPM',
              'Florida Manufactured',
              'Glass & PET',
            ].map((item, i) => (
              <React.Fragment key={item}>
                {i > 0 && <span className="text-white/18 font-mono text-xs">·</span>}
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={10} className="text-cyan-400/70 shrink-0" />
                  <span className="hpe-hud-label" style={{ fontSize: 9 }}>{item}</span>
                </span>
              </React.Fragment>
            ))}
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
