import React from 'react';
import { motion } from 'framer-motion';
import { Atom, FlaskConical, Waves, Cpu } from 'lucide-react';
import { Particles } from './Particles';
const PILLARS = [
{
  icon: Atom,
  label: 'Deuterium Depletion',
  title: 'Lighter water, lighter cells',
  body: 'We strip heavy hydrogen isotopes (deuterium) from water down to <25 ppm — well below the 150 ppm found in standard drinking water. Lighter water moves through mitochondrial ATP synthase faster.'
},
{
  icon: Cpu,
  label: 'Mitochondrial Yield',
  title: 'Cleaner ATP cycles',
  body: 'Less deuterium load means less mechanical strain on the rotor of ATP synthase. Independent labs report up to a 14% increase in ATP per oxygen molecule consumed.'
},
{
  icon: Waves,
  label: 'Oxidative Stress',
  title: 'Lower ROS production',
  body: 'Cleaner ATP = fewer leaked electrons in the electron transport chain. Fewer leaked electrons = less reactive oxygen species. Less ROS = slower cellular aging.'
},
{
  icon: FlaskConical,
  label: 'Cellular Hydration',
  title: 'Structured intracellular water',
  body: 'Beyond drinking volume, hydration is about what reaches the cytosol. DDW penetrates aquaporin channels more efficiently, restoring intracellular fluid where it matters.'
}];

export function ScienceSection() {
  return (
    <section id="science" className="hpe-section relative overflow-hidden">
      <div className="absolute inset-0 hpe-grid opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] hpe-glow-cyan opacity-30" />
      <Particles count={26} />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section header */}
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
            duration: 0.7,
            ease: [0.2, 0.8, 0.2, 1]
          }}
          className="max-w-3xl">
          
          <div className="hpe-hud-label mb-3">02 · The Science</div>
          <h2 className="text-3xl sm:text-5xl font-medium text-white tracking-tight leading-[1.05]">
            <span className="hpe-text-chrome">Deuterium-Depleted Water,</span>
            <br />
            <span className="text-white/80">engineered for the cell.</span>
          </h2>
          <p className="mt-5 text-white/60 text-base sm:text-lg leading-relaxed">
            Water is not a uniform molecule. The proportion of heavy hydrogen —
            deuterium — directly governs how efficiently your mitochondria
            generate energy. DDW reduces that load, sharpening every downstream
            system from cognition to recovery.
          </p>
        </motion.div>

        {/* Molecular animation centerpiece */}
        <MoleculeViz />

        {/* Pillars */}
        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PILLARS.map((p, i) =>
          <motion.div
            key={p.label}
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
              delay: i * 0.08,
              ease: [0.2, 0.8, 0.2, 1]
            }}
            className="hpe-glass rounded-2xl p-6 relative group overflow-hidden">
            
              <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background:
                'radial-gradient(circle at 50% 0%, rgba(63,184,255,0.12), transparent 70%)'
              }} />
            
              <div className="relative">
                <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                style={{
                  background: 'rgba(63,184,255,0.1)',
                  border: '1px solid rgba(63,184,255,0.3)'
                }}>
                
                  <p.icon size={16} className="text-cyan-300" />
                </div>
                <div className="hpe-hud-label mb-2">{p.label}</div>
                <h3 className="text-white text-lg font-medium leading-snug">
                  {p.title}
                </h3>
                <p className="mt-2 text-white/55 text-sm leading-relaxed">
                  {p.body}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>);

}
function MoleculeViz() {
  return (
    <div className="mt-14 relative h-[360px] sm:h-[440px] rounded-3xl hpe-glass overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
          'radial-gradient(circle at 50% 50%, rgba(63,184,255,0.18), transparent 60%)'
        }} />
      
      {/* Scan line */}
      <div
        className="absolute left-0 right-0 h-px pointer-events-none"
        style={{
          background:
          'linear-gradient(90deg, transparent, #3FB8FF, transparent)',
          boxShadow: '0 0 16px #3FB8FF',
          animation: 'hpeScan 7s linear infinite'
        }} />
      

      <svg viewBox="0 0 800 440" className="absolute inset-0 w-full h-full">
        <defs>
          <radialGradient id="atomBlue" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#aee4ff" />
            <stop offset="60%" stopColor="#3FB8FF" />
            <stop offset="100%" stopColor="#0a4f78" />
          </radialGradient>
          <radialGradient id="atomGold" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#fff2c5" />
            <stop offset="60%" stopColor="#F0D27A" />
            <stop offset="100%" stopColor="#7a5a1a" />
          </radialGradient>
          <radialGradient id="atomGreen" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#c8ffe9" />
            <stop offset="60%" stopColor="#5EE6B5" />
            <stop offset="100%" stopColor="#1d6b50" />
          </radialGradient>
          <filter id="atomGlow">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        {/* Central H2O molecule */}
        <g transform="translate(400, 220)">
          {/* Orbit rings */}
          <circle
            r="110"
            fill="none"
            stroke="#3FB8FF"
            strokeOpacity="0.15"
            strokeDasharray="2 6" />
          
          <circle
            r="160"
            fill="none"
            stroke="#3FB8FF"
            strokeOpacity="0.08"
            strokeDasharray="2 10" />
          

          {/* Bonds */}
          <line
            x1="0"
            y1="0"
            x2="-70"
            y2="-50"
            stroke="#3FB8FF"
            strokeWidth="2"
            opacity="0.6" />
          
          <line
            x1="0"
            y1="0"
            x2="70"
            y2="-50"
            stroke="#3FB8FF"
            strokeWidth="2"
            opacity="0.6" />
          

          {/* Oxygen (large) */}
          <circle r="34" fill="url(#atomBlue)" filter="url(#atomGlow)" />
          <circle r="34" fill="url(#atomBlue)" />
          <text
            x="0"
            y="6"
            textAnchor="middle"
            fill="#fff"
            fontSize="18"
            fontFamily="Geist Mono"
            fontWeight="600">
            
            O
          </text>

          {/* Hydrogen 1 */}
          <g transform="translate(-70,-50)">
            <circle r="20" fill="url(#atomGreen)" filter="url(#atomGlow)" />
            <circle r="20" fill="url(#atomGreen)" />
            <text
              x="0"
              y="5"
              textAnchor="middle"
              fill="#06251c"
              fontSize="13"
              fontFamily="Geist Mono"
              fontWeight="700">
              
              H
            </text>
          </g>

          {/* Hydrogen 2 */}
          <g transform="translate(70,-50)">
            <circle r="20" fill="url(#atomGreen)" filter="url(#atomGlow)" />
            <circle r="20" fill="url(#atomGreen)" />
            <text
              x="0"
              y="5"
              textAnchor="middle"
              fill="#06251c"
              fontSize="13"
              fontFamily="Geist Mono"
              fontWeight="700">
              
              H
            </text>
          </g>

          {/* Label */}
          <text
            x="0"
            y="80"
            textAnchor="middle"
            fill="#3FB8FF"
            fontSize="11"
            fontFamily="Geist Mono"
            letterSpacing="3">
            
            H₂O · LIGHT
          </text>
        </g>

        {/* Floating molecules around */}
        {[
        {
          x: 120,
          y: 90,
          r: 16,
          type: 'green'
        },
        {
          x: 680,
          y: 110,
          r: 22,
          type: 'blue'
        },
        {
          x: 140,
          y: 340,
          r: 18,
          type: 'green'
        },
        {
          x: 660,
          y: 360,
          r: 14,
          type: 'blue'
        },
        {
          x: 240,
          y: 60,
          r: 10,
          type: 'gold'
        },
        {
          x: 560,
          y: 60,
          r: 12,
          type: 'gold'
        }].
        map((m, i) =>
        <g
          key={i}
          className="hpe-float"
          style={{
            animationDelay: `${i * 0.4}s`
          }}>
          
            <circle
            cx={m.x}
            cy={m.y}
            r={m.r}
            fill={`url(#atom${m.type === 'blue' ? 'Blue' : m.type === 'green' ? 'Green' : 'Gold'})`}
            filter="url(#atomGlow)"
            opacity="0.7" />
          
            <circle
            cx={m.x}
            cy={m.y}
            r={m.r}
            fill={`url(#atom${m.type === 'blue' ? 'Blue' : m.type === 'green' ? 'Green' : 'Gold'})`}
            opacity="0.95" />
          
          </g>
        )}

        {/* Comparison: heavy water vs light water bar */}
        <g transform="translate(60, 400)">
          <text
            fill="#F0D27A"
            fontSize="10"
            fontFamily="Geist Mono"
            letterSpacing="2">
            
            STANDARD WATER · 150 PPM D
          </text>
          <rect
            x="0"
            y="6"
            width="280"
            height="3"
            fill="#F0D27A"
            opacity="0.4" />
          
        </g>
        <g transform="translate(440, 400)">
          <text
            fill="#3FB8FF"
            fontSize="10"
            fontFamily="Geist Mono"
            letterSpacing="2">
            
            HPE DDW · ≤25 PPM D
          </text>
          <rect x="0" y="6" width="50" height="3" fill="#3FB8FF" />
        </g>
      </svg>

      <div className="absolute top-4 left-4 hpe-hud-label">
        MOLECULAR INSPECTION · LIVE
      </div>
      <div className="absolute top-4 right-4 hpe-hud-label">
        REF · ATP-SYNTHASE
      </div>
    </div>);

}