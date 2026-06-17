import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Explore the Body', href: '/explore-the-body' },
  { label: 'The Science', href: '/science' },
  { label: 'Benefits', href: '/benefits' },
  { label: 'Athletes & Recovery', href: '/athletes-recovery' },
  { label: 'Healthy Aging', href: '/healthy-aging' },
  { label: 'Shop', href: '/products' },
  { label: 'Research', href: '/research' },
  { label: 'Contact', href: '/contact' },
];

type Props = {
  pathname: string;
};

export function Nav({ pathname }: Props) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed top-4 inset-x-0 z-30 flex justify-center px-4 pointer-events-none">
      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
        className="w-auto max-w-full pointer-events-auto"
      >
        <div
          className={`hpe-glass rounded-2xl pl-3 pr-2 sm:pl-4 py-2.5 flex items-center gap-4 sm:gap-6 transition-all duration-300 ${
            scrolled ? 'shadow-[0_8px_40px_-12px_rgba(63,184,255,0.35)]' : ''
          }`}
        >
          <a href="/" className="flex items-center gap-2.5 group shrink-0">
            <span className="relative flex h-11 items-center">
              <span className="absolute inset-0 rounded-full bg-cyan-300/20 blur-xl transition group-hover:bg-cyan-300/30" />
              <img
                src="/brand/logo.png"
                alt="Mdrn-Life DDW"
                className="relative h-10 w-auto object-contain drop-shadow-[0_0_18px_rgba(63,184,255,0.38)]"
              />
            </span>
            <div className="hidden sm:flex flex-col leading-none">
              <span className="text-white font-medium tracking-tight text-sm">Mdrn-Life</span>
              <span className="hpe-hud-label text-[8px]" style={{ fontSize: 8 }}>
                5 PPM DDW
              </span>
            </div>
          </a>

          <div className="hidden lg:flex items-center gap-1 max-w-[min(66vw,780px)] overflow-x-auto hpe-no-scrollbar">
            {LINKS.map((l) => {
              const active = pathname === l.href || (l.href !== '/' && pathname.startsWith(`${l.href}/`));
              return (
                <a
                  key={l.href}
                  href={l.href}
                  aria-current={active ? 'page' : undefined}
                  className={`shrink-0 px-2.5 py-1.5 text-[12px] rounded-lg transition relative group ${
                    active ? 'text-white' : 'text-white/70 hover:text-white'
                  }`}
                >
                  {l.label}
                  <span
                    className={`absolute left-2.5 right-2.5 bottom-1 h-px transition-all ${
                      active ? 'bg-cyan-400/80' : 'bg-cyan-400/0 group-hover:bg-cyan-400/60'
                    }`}
                  />
                </a>
              );
            })}
          </div>

          <a
            href="/products"
            className="hpe-btn-primary rounded-xl px-4 py-2 text-xs sm:text-sm font-medium tracking-wide shrink-0"
          >
            Shop DDW -&gt;
          </a>
        </div>
      </motion.nav>
    </div>
  );
}
