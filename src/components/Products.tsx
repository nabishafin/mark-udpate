import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Plus, Sparkles } from 'lucide-react';
import { Particles } from './Particles';
type Product = {
  id: string;
  badge: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  volume: string;
  spec: {
    k: string;
    v: string;
  }[];
  accent: 'blue' | 'gold';
};
const PRODUCTS: Product[] = [
{
  id: 'core',
  badge: 'CORE PROTOCOL',
  name: 'HPE Cellular ⁠— 25',
  tagline: 'Daily hydration · ≤25 ppm',
  description:
  'Our flagship deuterium-depleted water. Designed for daily intake by performance-driven individuals.',
  price: 89,
  volume: '12 × 500ml',
  spec: [
  {
    k: 'Deuterium',
    v: '≤25 ppm'
  },
  {
    k: 'pH',
    v: '7.4'
  },
  {
    k: 'Mineral profile',
    v: 'Balanced'
  }],

  accent: 'blue'
},
{
  id: 'elite',
  badge: 'ELITE',
  name: 'HPE Cellular ⁠— 10',
  tagline: 'Athletic & recovery · ≤10 ppm',
  description:
  'Maximum cellular impact. Reserved for elite recovery protocols and performance optimization windows.',
  price: 179,
  volume: '12 × 500ml',
  spec: [
  {
    k: 'Deuterium',
    v: '≤10 ppm'
  },
  {
    k: 'pH',
    v: '7.4'
  },
  {
    k: 'Electrolytes',
    v: 'Performance'
  }],

  accent: 'gold'
},
{
  id: 'reset',
  badge: 'RESET',
  name: 'HPE Reset Pack',
  tagline: 'Quarterly cellular reset · ≤15 ppm',
  description:
  'A 14-day protocol pack engineered to recalibrate your hydration baseline and reset cellular oxidative load.',
  price: 249,
  volume: '28 × 500ml',
  spec: [
  {
    k: 'Deuterium',
    v: '≤15 ppm'
  },
  {
    k: 'Protocol',
    v: '14 days'
  },
  {
    k: 'Includes',
    v: 'Tracker'
  }],

  accent: 'blue'
}];

export function Products() {
  const [adding, setAdding] = useState<string | null>(null);
  return (
    <section id="products" className="hpe-section relative overflow-hidden">
      <div className="absolute inset-0 hpe-grid opacity-30" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] hpe-glow-gold opacity-25" />
      <Particles count={20} color="rgba(240,210,122,0.4)" />

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
          
          <div
            className="hpe-hud-label mb-3"
            style={{
              color: '#F0D27A'
            }}>
            
            06 · The Protocols
          </div>
          <h2 className="text-3xl sm:text-5xl font-medium text-white tracking-tight leading-[1.05]">
            <span className="hpe-text-chrome">Three formulas.</span>
            <br />
            <span className="text-white/80">One uncompromising standard.</span>
          </h2>
          <p className="mt-5 text-white/60 text-base sm:text-lg leading-relaxed">
            Engineered, lab-verified, and ready to integrate into your
            performance protocol.
          </p>
        </motion.div>

        <div className="mt-14 grid md:grid-cols-3 gap-5">
          {PRODUCTS.map((p, i) =>
          <ProductCard
            key={p.id}
            product={p}
            delay={i * 0.1}
            adding={adding === p.id}
            onAdd={() => {
              setAdding(p.id);
              setTimeout(() => setAdding(null), 1800);
            }} />

          )}
        </div>
      </div>
    </section>);

}
function ProductCard({
  product,
  delay,
  adding,
  onAdd





}: {product: Product;delay: number;adding: boolean;onAdd: () => void;}) {
  const isGold = product.accent === 'gold';
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30
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
        duration: 0.7,
        delay
      }}
      whileHover={{
        y: -6
      }}
      className="hpe-glass rounded-3xl p-7 relative overflow-hidden flex flex-col"
      style={
      isGold ?
      {
        borderColor: 'rgba(229,194,90,0.35)',
        boxShadow: '0 30px 80px -30px rgba(229,194,90,0.4)'
      } :
      {
        boxShadow: '0 30px 80px -30px rgba(63,184,255,0.3)'
      }
      }>
      
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isGold ?
          'radial-gradient(circle at 50% 0%, rgba(229,194,90,0.18), transparent 60%)' :
          'radial-gradient(circle at 50% 0%, rgba(63,184,255,0.12), transparent 60%)'
        }} />
      

      {/* Bottle visualization */}
      <div className="relative h-56 flex items-center justify-center mb-4">
        <BottleViz accent={product.accent} />
      </div>

      <div className="relative flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          {isGold && <Sparkles size={12} className="text-amber-300" />}
          <div
            className="hpe-hud-label"
            style={{
              color: isGold ? '#F0D27A' : '#3FB8FF'
            }}>
            
            {product.badge}
          </div>
        </div>
        <h3 className="text-white text-2xl font-medium tracking-tight">
          {product.name}
        </h3>
        <p className="text-white/55 text-sm mt-1">{product.tagline}</p>

        <p className="text-white/65 text-sm leading-relaxed mt-4 flex-1">
          {product.description}
        </p>

        <div className="mt-5 space-y-1.5">
          {product.spec.map((s) =>
          <div
            key={s.k}
            className="flex items-center justify-between text-xs">
            
              <span className="text-white/45">{s.k}</span>
              <span className="font-mono text-white/80">{s.v}</span>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-end justify-between">
          <div>
            <div
              className="hpe-hud-label"
              style={{
                fontSize: 9
              }}>
              
              FROM
            </div>
            <div className="text-white font-mono text-2xl leading-none mt-1">
              ${product.price}
              <span className="text-white/40 text-xs ml-2">
                / {product.volume}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onAdd}
          disabled={adding}
          className={`mt-5 rounded-xl px-4 py-3 text-sm font-medium tracking-wide inline-flex items-center justify-center gap-2 transition ${isGold ? 'hpe-btn-ghost' : 'hpe-btn-primary'}`}>
          
          {adding ?
          <>
              <Check size={14} />
              Added to Cart
            </> :

          <>
              <Plus size={14} />
              Add to Cart
            </>
          }
        </button>
      </div>
    </motion.div>);

}
function BottleViz({ accent }: {accent: 'blue' | 'gold';}) {
  const isGold = accent === 'gold';
  const main = isGold ? '#F0D27A' : '#3FB8FF';
  const soft = isGold ? 'rgba(229,194,90,0.4)' : 'rgba(63,184,255,0.4)';
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div
        className="absolute w-44 h-44 rounded-full"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${soft}, transparent 70%)`
        }} />
      
      <svg
        viewBox="0 0 200 280"
        className="relative h-full w-auto hpe-float"
        style={{
          animationDuration: '8s'
        }}>
        
        <defs>
          <linearGradient id={`bottle-${accent}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={main} stopOpacity="0.05" />
            <stop offset="50%" stopColor={main} stopOpacity="0.4" />
            <stop offset="100%" stopColor={main} stopOpacity="0.05" />
          </linearGradient>
          <filter id={`bottleGlow-${accent}`}>
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>
        {/* Glow halo */}
        <ellipse
          cx="100"
          cy="160"
          rx="60"
          ry="100"
          fill={main}
          opacity="0.12"
          filter={`url(#bottleGlow-${accent})`} />
        

        {/* Cap */}
        <rect
          x="80"
          y="14"
          width="40"
          height="22"
          rx="3"
          fill="rgba(15,20,28,0.95)"
          stroke={main}
          strokeWidth="1"
          opacity="0.9" />
        
        <rect
          x="76"
          y="32"
          width="48"
          height="6"
          rx="2"
          fill="rgba(15,20,28,0.95)"
          stroke={main}
          strokeWidth="1"
          opacity="0.9" />
        

        {/* Bottle body */}
        <path
          d="M70 44 L130 44 L138 70 L138 240 Q138 256 122 256 L78 256 Q62 256 62 240 L62 70 Z"
          fill={`url(#bottle-${accent})`}
          stroke={main}
          strokeWidth="1.2"
          opacity="0.9" />
        
        <path
          d="M70 44 L130 44 L138 70 L138 240 Q138 256 122 256 L78 256 Q62 256 62 240 L62 70 Z"
          fill="rgba(15,20,28,0.7)" />
        

        {/* Inner liquid */}
        <path
          d="M68 80 L132 80 L132 240 Q132 250 122 250 L78 250 Q68 250 68 240 Z"
          fill={main}
          opacity="0.18" />
        
        {/* Liquid waves */}
        <path
          d="M68 95 Q85 88 100 95 T132 95"
          fill="none"
          stroke={main}
          strokeWidth="1"
          opacity="0.6">
          
          <animate
            attributeName="d"
            values="
            M68 95 Q85 88 100 95 T132 95;
            M68 95 Q85 102 100 95 T132 95;
            M68 95 Q85 88 100 95 T132 95"



            dur="4s"
            repeatCount="indefinite" />
          
        </path>

        {/* Label */}
        <rect
          x="76"
          y="140"
          width="48"
          height="60"
          rx="2"
          fill="rgba(7,9,13,0.6)"
          stroke={main}
          strokeWidth="0.6"
          opacity="0.7" />
        
        <text
          x="100"
          y="160"
          textAnchor="middle"
          fill={main}
          fontSize="9"
          fontFamily="Geist Mono"
          letterSpacing="2">
          
          HPE
        </text>
        <text
          x="100"
          y="178"
          textAnchor="middle"
          fill="#fff"
          fontSize="7"
          fontFamily="Geist Mono"
          letterSpacing="1.5"
          opacity="0.8">
          
          DDW
        </text>
        <line
          x1="80"
          y1="186"
          x2="120"
          y2="186"
          stroke={main}
          strokeWidth="0.4"
          opacity="0.5" />
        
        <text
          x="100"
          y="196"
          textAnchor="middle"
          fill="#fff"
          fontSize="6"
          fontFamily="Geist Mono"
          opacity="0.5">
          
          500ML
        </text>

        {/* Rim highlight */}
        <path
          d="M70 44 L130 44 L138 70 L138 240"
          fill="none"
          stroke="#fff"
          strokeWidth="0.5"
          opacity="0.25" />
        
      </svg>
    </div>);

}