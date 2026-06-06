import React from 'react';
import { motion } from 'framer-motion';
import { Particles } from './Particles';
export function OxidativeStress() {
  return (
    <section className="hpe-section relative overflow-hidden">
      <div className="absolute inset-0 hpe-grid opacity-30" />
      <div className="absolute top-1/2 right-0 w-[700px] h-[700px] hpe-glow-gold opacity-30" />
      <Particles count={22} color="rgba(240,210,122,0.5)" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
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
          }}>
          
          <div
            className="hpe-hud-label mb-3"
            style={{
              color: '#F0D27A'
            }}>
            
            03 · Oxidative Stress
          </div>
          <h2 className="text-3xl sm:text-5xl font-medium text-white tracking-tight leading-[1.05]">
            The hidden current that{' '}
            <span
              style={{
                color: '#F0D27A',
                textShadow: '0 0 24px rgba(229,194,90,0.5)'
              }}>
              
              ages every cell.
            </span>
          </h2>
          <p className="mt-5 text-white/60 text-base sm:text-lg leading-relaxed">
            Every breath you take generates reactive oxygen species. A small
            amount is essential. Too much is the silent driver of inflammation,
            fatigue, and biological aging. DDW calibrates this balance —
            protecting the cells you can't afford to lose.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <StatCard
              label="ROS reduction"
              value="−27"
              unit="%"
              note="vs. control hydration" />
            
            <StatCard
              label="Glutathione"
              value="+18"
              unit="%"
              note="master antioxidant" />
            
            <StatCard
              label="Inflammation (CRP)"
              value="−14"
              unit="%"
              note="6-week protocol" />
            
            <StatCard
              label="DNA repair"
              value="+9"
              unit="%"
              note="γH2AX assay" />
            
          </div>
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.94
          }}
          whileInView={{
            opacity: 1,
            scale: 1
          }}
          viewport={{
            once: true,
            margin: '-80px'
          }}
          transition={{
            duration: 0.9
          }}
          className="relative h-[480px] rounded-3xl hpe-glass overflow-hidden">
          
          <RosViz />
        </motion.div>
      </div>
    </section>);

}
function StatCard({
  label,
  value,
  unit,
  note





}: {label: string;value: string;unit: string;note: string;}) {
  return (
    <div className="hpe-glass rounded-xl px-4 py-4">
      <div
        className="hpe-hud-label"
        style={{
          fontSize: 9,
          color: '#F0D27A'
        }}>
        
        {label}
      </div>
      <div className="text-white font-mono text-2xl leading-none mt-2">
        {value}
        <span className="text-white/40 text-xs ml-1">{unit}</span>
      </div>
      <div className="text-white/40 text-[11px] mt-1">{note}</div>
    </div>);

}
function RosViz() {
  // A "cell" with mitochondria + free radicals being neutralized
  return (
    <div className="relative w-full h-full">
      <div
        className="absolute inset-0"
        style={{
          background:
          'radial-gradient(circle at 50% 50%, rgba(229,194,90,0.12), transparent 70%)'
        }} />
      
      <svg viewBox="0 0 600 480" className="absolute inset-0 w-full h-full">
        <defs>
          <radialGradient id="cellMembrane" cx="50%" cy="50%" r="50%">
            <stop offset="70%" stopColor="rgba(63,184,255,0.04)" />
            <stop offset="95%" stopColor="rgba(63,184,255,0.3)" />
            <stop offset="100%" stopColor="rgba(63,184,255,0)" />
          </radialGradient>
          <filter id="rosGlow">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
        </defs>

        {/* Cell membrane */}
        <ellipse
          cx="300"
          cy="240"
          rx="220"
          ry="170"
          fill="url(#cellMembrane)"
          stroke="#3FB8FF"
          strokeWidth="1"
          strokeDasharray="3 5"
          opacity="0.6" />
        
        <ellipse
          cx="300"
          cy="240"
          rx="220"
          ry="170"
          fill="none"
          stroke="#3FB8FF"
          strokeWidth="0.6"
          opacity="0.4">
          
          <animate
            attributeName="rx"
            values="220;225;220"
            dur="6s"
            repeatCount="indefinite" />
          
          <animate
            attributeName="ry"
            values="170;175;170"
            dur="6s"
            repeatCount="indefinite" />
          
        </ellipse>

        {/* Nucleus */}
        <ellipse
          cx="300"
          cy="240"
          rx="50"
          ry="40"
          fill="rgba(63,184,255,0.08)"
          stroke="#3FB8FF"
          strokeWidth="0.8"
          opacity="0.7" />
        
        <text
          x="300"
          y="244"
          textAnchor="middle"
          fill="#3FB8FF"
          fontSize="9"
          fontFamily="Geist Mono"
          letterSpacing="2">
          
          NUCLEUS
        </text>

        {/* Mitochondria */}
        {[
        {
          x: 180,
          y: 160,
          r: 0
        },
        {
          x: 430,
          y: 200,
          r: 25
        },
        {
          x: 200,
          y: 330,
          r: -15
        },
        {
          x: 410,
          y: 320,
          r: 10
        }].
        map((m, i) =>
        <g key={i} transform={`translate(${m.x},${m.y}) rotate(${m.r})`}>
            <ellipse
            rx="28"
            ry="14"
            fill="rgba(63,184,255,0.12)"
            stroke="#3FB8FF"
            strokeWidth="0.8" />
          
            <path
            d="M-20 0 Q-10 -6 0 0 Q10 6 20 0"
            fill="none"
            stroke="#3FB8FF"
            strokeWidth="0.6"
            opacity="0.6" />
          
          </g>
        )}

        {/* Free radicals — gold dots being neutralized */}
        {Array.from({
          length: 14
        }).map((_, i) => {
          const angle = i / 14 * Math.PI * 2;
          const r = 100 + Math.random() * 80;
          const x = 300 + Math.cos(angle) * r;
          const y = 240 + Math.sin(angle) * r * 0.7;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="4" fill="#F0D27A" filter="url(#rosGlow)">
                <animate
                  attributeName="opacity"
                  values="0.9;0.2;0.9"
                  dur={`${3 + i * 0.2}s`}
                  repeatCount="indefinite" />
                
                <animate
                  attributeName="r"
                  values="4;1;4"
                  dur={`${3 + i * 0.2}s`}
                  repeatCount="indefinite" />
                
              </circle>
            </g>);

        })}

        {/* Hydration flow lines penetrating from outside */}
        {[0, 1, 2, 3].map((i) =>
        <path
          key={i}
          d={`M ${i * 150 + 40} 60 Q ${i * 150 + 80} 240 ${i * 150 + 60} 420`}
          fill="none"
          stroke="#3FB8FF"
          strokeWidth="1"
          strokeDasharray="3 8"
          opacity="0.4"
          className="hpe-dash"
          style={{
            animationDuration: `${8 + i}s`,
            animationDelay: `${i * 0.5}s`
          }} />

        )}
      </svg>

      <div
        className="absolute top-4 left-4 hpe-hud-label"
        style={{
          color: '#F0D27A'
        }}>
        
        CELL VIEW · ROS NEUTRALIZATION
      </div>
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end font-mono text-[10px] text-white/40">
        <span>SCALE · 10µm</span>
        <span>LIVE</span>
        <span>ROS ↓ · ATP ↑</span>
      </div>
    </div>);

}