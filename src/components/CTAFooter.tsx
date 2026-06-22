import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Instagram, Music2, Youtube } from 'lucide-react';

const FINAL_CTA_TITLE = 'Explore the Human Body Like Never Before';
const FINAL_CTA_BODY =
  'Every system in the body depends on hydration, energy, circulation, and cellular balance. Discover how advanced hydration may support performance, recovery, and healthy aging from the inside out.';

export function CTAFooter() {
  return (
    <footer className="relative overflow-hidden">
      <section className="hpe-section relative">
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8 }}
          >
            <div className="hpe-hud-label mb-5">Human Body Experience</div>
            <h2
              aria-label={FINAL_CTA_TITLE}
              className="text-4xl sm:text-6xl lg:text-7xl font-medium tracking-tight leading-[1.02]"
            >
              <span className="hpe-text-chrome">Explore the Human Body</span>
              <br />
              <span style={{ color: '#3FB8FF', textShadow: '0 0 32px rgba(63,184,255,0.5)' }}>
                Like Never Before
              </span>
            </h2>
            <p aria-label={FINAL_CTA_BODY} className="mt-6 text-white/65 text-lg max-w-2xl mx-auto leading-relaxed">
              Every system in the body depends on hydration, energy, circulation,
              and cellular balance. Discover how advanced hydration may support
              performance, recovery, and healthy aging from the inside out.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <a href="/science/lab-testing" className="hpe-btn-ghost rounded-xl px-6 py-3.5 text-sm font-medium tracking-wide">
                Explore the Science
              </a>
              <a
                href="/products"
                className="hpe-btn-primary rounded-xl px-6 py-3.5 text-sm font-medium tracking-wide inline-flex items-center gap-2"
              >
                Discover Mdrn-Life DDW
                <ArrowRight size={14} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative py-12">
        <div className="max-w-7xl mx-auto px-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <span className="relative flex h-12 items-center">
                <span className="absolute inset-0 rounded-full bg-cyan-300/20 blur-xl" />
                <img
                  src="/brand/logo.png"
                  alt="Mdrn-Life DDW"
                  className="relative h-11 w-auto object-contain drop-shadow-[0_0_18px_rgba(63,184,255,0.32)]"
                />
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
              {[
                { Icon: Instagram, href: 'https://www.instagram.com/modernlifewater/', label: 'Instagram' },
                { Icon: Music2, href: 'https://www.tiktok.com/@modernlifeddw', label: 'TikTok' },
                { Icon: Youtube, href: 'https://www.youtube.com/channel/UC19CpjpBOs1SxrAr47eX-xg', label: 'YouTube' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
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
              ['DDW Science', '/science'],
              ['Lab Testing', '/science/lab-testing'],
              ['Healthy Aging', '/healthy-aging'],
              ['Benefits', '/benefits'],
              ['Learn', '/learn'],
            ]}
          />

          <FooterCol
            title="Shop"
            links={[
              ['Glass Bottles', '/products'],
              ['PET Plastic Bottles', '/products'],
              ['5 ppm DDW', '/products'],
            ]}
          />

          <FooterCol
            title="Company"
            links={[
              ['Our Story', '/founder'],
              ['Research', '/research'],
              ['Blog', '/blogs/news'],
              ['Contact', '/contact'],
            ]}
          />

          <FooterCol
            title="Policies"
            links={[
              ['Terms of Service', '/policies/terms-of-service'],
              ['Shipping Policy', '/policies/shipping-policy'],
              ['Refund Policy', '/policies/refund-policy'],
              ['Privacy Policy', '/policies/privacy-policy'],
              ['Refund Information', '/pages/refund'],
              ['Subscription Policy', '/policies/subscription-policy'],
            ]}
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <div className="font-mono">© 2026 MDRN-LIFE DDW</div>
          <div className="font-mono">5 PPM - GLASS AND PET PLASTIC</div>
        </div>
      </section>
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
