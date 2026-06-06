import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
const TESTIMONIALS = [
{
  quote:
  "My HRV climbed 22 points in three weeks. I've tried every recovery protocol in the field. This is the only intervention that moved the needle that fast.",
  author: 'Dr. Marcus Rhee',
  role: 'Sports Cardiologist · NY Performance Lab'
},
{
  quote:
  'I run a 12-hour operating schedule. Mid-day cognitive fade was non-negotiable. Six weeks on the protocol, that fade is gone. My team noticed before I did.',
  author: 'Sara Kohl, MD',
  role: 'Neurosurgeon · Mount Sinai'
},
{
  quote:
  'We tested DDW against three premium hydration regimens. Across nine biomarkers, the DDW protocol led on seven, tied on two, and lost none.',
  author: 'Dr. Aaron Levine',
  role: 'Director · Cellular Research Institute'
},
{
  quote:
  "Athletes describe it as 'quieter recovery' — less DOMS, less mid-set fade, and sharper morning starts. The data backs every word.",
  author: 'Coach Elena Moreau',
  role: 'Strength & Conditioning · Olympic Federation'
}];

const VALIDATORS = [
{
  label: 'PEER-REVIEWED',
  value: '14 studies'
},
{
  label: 'CLINICAL TRIALS',
  value: '6 ongoing'
},
{
  label: 'COUNTRIES',
  value: '23'
},
{
  label: 'PROTOCOLS DEPLOYED',
  value: '48,200+'
}];

export function Testimonials() {
  return (
    <section id="story" className="hpe-section relative overflow-hidden">
      <div className="absolute inset-0 hpe-grid opacity-30" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] hpe-glow-cyan opacity-25" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] hpe-glow-gold opacity-20" />

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
          
          <div className="hpe-hud-label mb-3">07 · Validation</div>
          <h2 className="text-3xl sm:text-5xl font-medium text-white tracking-tight leading-[1.05]">
            <span className="text-white/80">Trusted by the people</span>{' '}
            <span className="hpe-text-chrome">
              measuring biology for a living.
            </span>
          </h2>
        </motion.div>

        <div className="mt-12 grid md:grid-cols-2 gap-5">
          {TESTIMONIALS.map((t, i) =>
          <motion.figure
            key={i}
            initial={{
              opacity: 0,
              y: 20
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
              delay: i * 0.08
            }}
            className="hpe-glass rounded-2xl p-7 relative">
            
              <Quote
              size={28}
              className="text-cyan-400/40 absolute top-5 right-5" />
            
              <blockquote className="text-white/85 text-base sm:text-lg leading-relaxed">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span
                className="w-9 h-9 rounded-full flex items-center justify-center font-mono text-cyan-200 text-xs"
                style={{
                  background: 'rgba(63,184,255,0.1)',
                  border: '1px solid rgba(63,184,255,0.3)'
                }}>
                
                  {t.author.
                split(' ').
                map((s) => s[0]).
                slice(0, 2).
                join('')}
                </span>
                <div>
                  <div className="text-white text-sm font-medium">
                    {t.author}
                  </div>
                  <div className="text-white/45 text-xs">{t.role}</div>
                </div>
              </figcaption>
            </motion.figure>
          )}
        </div>

        {/* Validators strip */}
        <div className="mt-16 hpe-glass rounded-2xl p-7 grid grid-cols-2 md:grid-cols-4 gap-6">
          {VALIDATORS.map((v) =>
          <div key={v.label}>
              <div
              className="hpe-hud-label"
              style={{
                fontSize: 9
              }}>
              
                {v.label}
              </div>
              <div className="text-white font-mono text-xl mt-1.5">
                {v.value}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

}