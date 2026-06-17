import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Droplets, HeartPulse, Shield, Sparkles, Zap } from 'lucide-react';

const BENEFITS = [
  {
    icon: Droplets,
    title: 'Deep hydration',
    body: 'Deuterium-depleted water is positioned as a key to health and hydration, with 5 ppm DDW designed to support hydration at a cellular level.',
  },
  {
    icon: Brain,
    title: 'Cognitive support',
    body: 'Hydration is connected with brain support, mental clarity, focus, energy production, sleep, and recovery.',
  },
  {
    icon: Zap,
    title: 'Cellular energy',
    body: 'DDW is connected with mitochondria, ATP, energy production, oxidative balance, and cellular performance.',
  },
  {
    icon: HeartPulse,
    title: 'Circulation and oxygen transport',
    body: 'The body-map content frames hydration as support for healthy circulation, oxygen transport, endurance, and recovery after activity.',
  },
  {
    icon: Shield,
    title: 'Recovery from oxidative stress',
    body: 'The website concept and side-panel copy both mention oxidative stress in relation to recovery, aging, cellular balance, and performance.',
  },
  {
    icon: Sparkles,
    title: 'Healthy aging routines',
    body: 'Healthy aging and skin support are core parts of the body-map experience.',
  },
];

export function Benefits() {
  return (
    <section id="benefits" className="hpe-section relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <div className="hpe-hud-label mb-3" style={{ color: '#F0D27A' }}>
            Benefits
          </div>
          <h2 className="text-3xl sm:text-5xl font-medium text-white tracking-tight leading-[1.05]">
            <span className="hpe-text-chrome">Benefits framed as support.</span>
            <br />
            <span className="text-white/80">Clean, compliance-friendly language.</span>
          </h2>
          <p className="mt-5 text-white/60 text-base sm:text-lg leading-relaxed">
            The language stays focused on supports, helps maintain, promotes,
            assists, and designed to support.
            This section follows that direction.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((benefit, index) => (
            <motion.article
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="hpe-glass rounded-2xl p-6"
            >
              <benefit.icon size={18} className="text-amber-200" />
              <h3 className="mt-4 text-xl font-medium text-white">{benefit.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">{benefit.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
