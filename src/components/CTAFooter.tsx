import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Hexagon, Instagram, Twitter, Youtube } from 'lucide-react';
import { Particles } from './Particles';

export function CTAFooter() {
  return (
    <footer className="relative overflow-hidden">
      <section className="hpe-section relative">
        <div className="absolute inset-0 hpe-grid opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[700px] hpe-glow-cyan opacity-40" />
        <Particles count={32} />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8 }}
          >
            <div className="hpe-hud-label mb-5">08 - Begin</div>
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-medium tracking-tight leading-[1.02]">
              <span className="hpe-text-chrome">Begin your</span>
              <br />
              <span style={{ color: '#3FB8FF', textShadow: '0 0 32px rgba(63,184,255,0.5)' }}>
                hydration journey.
              </span>
            </h2>
            <p className="mt-6 text-white/65 text-lg max-w-2xl mx-auto leading-relaxed">
              Every system in the body depends on hydration, energy, circulation,
              and cellular balance. Discover Mdrn-Life DDW in verified 5 ppm Glass
              and PET Plastic formats.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#products"
                className="hpe-btn-primary rounded-xl px-6 py-3.5 text-sm font-medium tracking-wide inline-flex items-center gap-2"
              >
                Discover Mdrn-Life DDW
                <ArrowRight size={14} />
              </a>
              <a href="#science/lab-testing" className="hpe-btn-ghost rounded-xl px-6 py-3.5 text-sm font-medium tracking-wide">
                Explore the Science
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="relative border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <span
                className="relative w-9 h-9 rounded-lg flex items-center justify-center"
                style={{
                  background: 'linear-gradient(180deg, rgba(63,184,255,0.25), rgba(63,184,255,0.05))',
                  border: '1px solid rgba(63,184,255,0.4)',
                  boxShadow: '0 0 20px -4px rgba(63,184,255,0.5)',
                }}
              >
                <Hexagon size={16} className="text-cyan-300" strokeWidth={1.6} />
              </span>
              <div className="flex flex-col leading-none">
                <span className="text-white font-medium tracking-tight">Mdrn-Life</span>
                <span className="hpe-hud-label" style={{ fontSize: 8 }}>
                  5 PPM DDW
                </span>
              </div>
            </div>
            <p className="text-white/45 text-sm leading-relaxed max-w-xs">
              Independently verified 5 ppm deuterium-depleted water in Glass and
              PET Plastic bottles.
            </p>
            <div className="mt-4 flex gap-2">
              {[Instagram, Twitter, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg hpe-glass flex items-center justify-center text-white/60 hover:text-cyan-300 transition"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          <FooterCol
            title="Explore"
            links={[
              ['Interactive Body', '#body'],
              ['DDW Science', '#science'],
              ['Lab Testing', '#science/lab-testing'],
              ['Systems', '#systems'],
            ]}
          />

          <FooterCol
            title="Shop"
            links={[
              ['Glass Bottles', '#products'],
              ['PET Plastic Bottles', '#products'],
              ['5 ppm DDW', '#products'],
              ['Current Store', 'https://mdrnlifeddw.com/collections/mdrn-life-ddw'],
            ]}
          />

          <FooterCol
            title="Company"
            links={[
              ['Research', '#science'],
              ['Contact', 'https://mdrnlifeddw.com/pages/contact'],
              ['Privacy', 'https://mdrnlifeddw.com/policies/privacy-policy'],
              ['Terms', 'https://mdrnlifeddw.com/policies/terms-of-service'],
            ]}
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <div className="font-mono">© 2026 MDRN-LIFE DDW</div>
          <div className="font-mono">5 PPM - GLASS AND PET PLASTIC</div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <div className="hpe-hud-label mb-3">{title}</div>
      <ul className="space-y-2">
        {links.map(([label, href]) => (
          <li key={label}>
            <a href={href} className="text-white/70 hover:text-white transition text-sm">
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
