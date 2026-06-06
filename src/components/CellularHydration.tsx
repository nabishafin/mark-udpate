import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, Waves, ArrowRight } from 'lucide-react';
import { Particles } from './Particles';
const STEPS = [
{
  n: '01',
  title: 'Aquaporin entry',
  body: 'DDW molecules pass through aquaporin channels with measurably lower resistance, reaching the cytosol faster than standard water.'
},
{
  n: '02',
  title: 'Cytosolic structuring',
  body: 'Inside the cell, water organizes around proteins into exclusion-zone (EZ) water — the most biologically active phase.'
},
{
  n: '03',
  title: 'Mitochondrial loading',
  body: 'Lighter water enters the mitochondrial matrix without slowing the ATP synthase rotor. Cleaner ATP follows.'
},
{
  n: '04',
  title: 'Systemic uplift',
  body: 'Every system — neural, cardiac, immune, muscular — measurably benefits within 7–14 days of protocol adoption.'
}];

export function CellularHydration() {
  return (
    <section className="hpe-section relative overflow-hidden">
      <div className="absolute inset-0 hpe-grid opacity-30" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[600px] hpe-glow-cyan opacity-30" />
      <Particles count={28} />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{
            opacity: 0,
            y: 24
          }}
          whileInView={{
            opacity: 1,
            y: 0
          }}
          viewport={{
            once: true,
            margin: '-80px'
          }}
          transition={{
            duration: 0.7
          }}
          className="max-w-3xl">
          
          <div className="hpe-hud-label mb-3">04 · Cellular Hydration</div>
          <h2 className="text-3xl sm:text-5xl font-medium text-white tracking-tight leading-[1.05]">
            <span className="hpe-text-chrome">It's not what you drink.</span>
            <br />
            <span className="text-white/80">It's what reaches the cell.</span>
          </h2>
          <p className="mt-5 text-white/60 text-base sm:text-lg leading-relaxed">
            Standard hydration metrics measure plasma. We measure cytosol. DDW
            penetrates the cellular membrane more efficiently — restoring the
            intracellular fluid where every biological reaction actually
            happens.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="mt-14 relative">
          {/* Connecting line */}
          <div
            className="absolute left-0 right-0 top-7 h-px hidden lg:block"
            style={{
              background:
              'linear-gradient(90deg, transparent, rgba(63,184,255,0.5), rgba(63,184,255,0.5), transparent)'
            }} />
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STEPS.map((s, i) =>
            <motion.div
              key={s.n}
              initial={{
                opacity: 0,
                y: 24
              }}
              whileInView={{
                opacity: 1,
                y: 0
              }}
              viewport={{
                once: true,
                margin: '-50px'
              }}
              transition={{
                duration: 0.6,
                delay: i * 0.1
              }}
              className="relative">
              
                {/* Node */}
                <div className="flex items-center gap-3 mb-4 relative z-10">
                  <span
                  className="w-14 h-14 rounded-full flex items-center justify-center font-mono text-cyan-300 text-sm"
                  style={{
                    background: 'rgba(7,9,13,0.95)',
                    border: '1px solid rgba(63,184,255,0.4)',
                    boxShadow: '0 0 20px -4px rgba(63,184,255,0.5)'
                  }}>
                  
                    {s.n}
                  </span>
                  {i < STEPS.length - 1 &&
                <ArrowRight
                  size={14}
                  className="text-cyan-400/40 hidden lg:block" />

                }
                </div>
                <h3 className="text-white text-lg font-medium">{s.title}</h3>
                <p className="mt-2 text-white/55 text-sm leading-relaxed">
                  {s.body}
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Bottom split */}
        <div className="mt-20 grid lg:grid-cols-2 gap-6">
          <CompareCard
            tone="dim"
            icon={<Droplets size={16} />}
            label="STANDARD WATER"
            title="Reaches plasma. Stalls at the cell wall."
            metrics={[
            {
              k: 'Cytosol penetration',
              v: 'Baseline'
            },
            {
              k: 'D content',
              v: '150 ppm'
            },
            {
              k: 'ATP yield',
              v: 'Baseline'
            }]
            } />
          
          <CompareCard
            tone="bright"
            icon={<Waves size={16} />}
            label="HPE DDW"
            title="Crosses the membrane. Powers the mitochondria."
            metrics={[
            {
              k: 'Cytosol penetration',
              v: '+18%'
            },
            {
              k: 'D content',
              v: '<25 ppm'
            },
            {
              k: 'ATP yield',
              v: '+14%'
            }]
            } />
          
        </div>
      </div>
    </section>);

}
function CompareCard({
  tone,
  icon,
  label,
  title,
  metrics









}: {tone: 'dim' | 'bright';icon: React.ReactNode;label: string;title: string;metrics: {k: string;v: string;}[];}) {
  const isBright = tone === 'bright';
  return (
    <div
      className="hpe-glass rounded-2xl p-7 relative overflow-hidden"
      style={
      isBright ?
      {
        borderColor: 'rgba(63,184,255,0.35)',
        boxShadow: '0 20px 60px -20px rgba(63,184,255,0.4)'
      } :
      {}
      }>
      
      {isBright &&
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
          'radial-gradient(circle at 50% 0%, rgba(63,184,255,0.12), transparent 70%)'
        }} />

      }
      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <span className={isBright ? 'text-cyan-300' : 'text-white/40'}>
            {icon}
          </span>
          <div
            className="hpe-hud-label"
            style={{
              color: isBright ? '#3FB8FF' : 'rgba(255,255,255,0.4)'
            }}>
            
            {label}
          </div>
        </div>
        <h3
          className={`text-xl font-medium ${isBright ? 'text-white' : 'text-white/60'}`}>
          
          {title}
        </h3>
        <div className="mt-5 space-y-2">
          {metrics.map((m) =>
          <div
            key={m.k}
            className="flex items-center justify-between border-b border-white/5 pb-2">
            
              <span className="text-xs text-white/45">{m.k}</span>
              <span
              className={`font-mono text-sm ${isBright ? 'text-cyan-300' : 'text-white/60'}`}>
              
                {m.v}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>);

}