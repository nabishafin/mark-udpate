import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Hexagon } from 'lucide-react';
const LINKS = [
{
  label: 'Body',
  href: '#body'
},
{
  label: 'Science',
  href: '#science'
},
{
  label: 'Systems',
  href: '#systems'
},
{
  label: 'Products',
  href: '#products'
},
{
  label: 'Story',
  href: '#story'
}];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, {
      passive: true
    });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className="fixed top-4 inset-x-0 z-30 flex justify-center px-4 pointer-events-none">
      <motion.nav
        initial={{
          y: -30,
          opacity: 0
        }}
        animate={{
          y: 0,
          opacity: 1
        }}
        transition={{
          duration: 0.6,
          ease: [0.2, 0.8, 0.2, 1]
        }}
        className="w-auto max-w-full pointer-events-auto">
        
        <div
          className={`hpe-glass rounded-2xl pl-4 pr-2 sm:pl-5 py-2.5 flex items-center gap-4 sm:gap-6 transition-all duration-300 ${scrolled ? 'shadow-[0_8px_40px_-12px_rgba(63,184,255,0.35)]' : ''}`}>
          
          <a href="#top" className="flex items-center gap-2.5 group shrink-0">
            <span
              className="relative w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background:
                'linear-gradient(180deg, rgba(63,184,255,0.25), rgba(63,184,255,0.05))',
                border: '1px solid rgba(63,184,255,0.4)',
                boxShadow: '0 0 20px -4px rgba(63,184,255,0.5)'
              }}>
              
              <Hexagon size={14} className="text-cyan-300" strokeWidth={1.6} />
              <span className="absolute inset-0 rounded-lg hpe-ripple border border-cyan-400/40" />
            </span>
            <div className="flex flex-col leading-none">
              <span className="text-white font-medium tracking-tight text-sm">
                HPE
              </span>
              <span
                className="hpe-hud-label text-[8px]"
                style={{
                  fontSize: 8
                }}>
                
                HUMAN · PERFORMANCE
              </span>
            </div>
          </a>

          <div className="hidden md:flex items-center gap-1">
            {LINKS.map((l) =>
            <a
              key={l.href}
              href={l.href}
              className="px-3 py-1.5 text-sm text-white/70 hover:text-white rounded-lg transition relative group">
              
                {l.label}
                <span className="absolute left-3 right-3 bottom-1 h-px bg-cyan-400/0 group-hover:bg-cyan-400/60 transition-all" />
              </a>
            )}
          </div>

          <a
            href="#products"
            className="hpe-btn-primary rounded-xl px-4 py-2 text-xs sm:text-sm font-medium tracking-wide shrink-0">
            
            Begin Journey →
          </a>
        </div>
      </motion.nav>
    </div>);

}