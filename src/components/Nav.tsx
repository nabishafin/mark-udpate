import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LogOut, Menu, X } from 'lucide-react';
import { clearCustomerSession, getStoredCustomerSession, onCustomerSessionChange } from '../lib/customer';

const LINKS = [
  { label: 'Home', href: '/' },
  { label: 'The Science', href: '/science' },
  { label: 'Benefits', href: '/benefits' },
  { label: 'Athletes & Recovery', href: '/athletes-recovery' },
  { label: 'Healthy Aging', href: '/healthy-aging' },
  { label: 'Research', href: '/research' },
  { label: 'Blog', href: '/blogs/news' },
  { label: 'Contact', href: '/contact' },
];

type Props = {
  pathname: string;
};

export function Nav({ pathname }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(() => Boolean(getStoredCustomerSession()));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => onCustomerSessionChange(() => setLoggedIn(Boolean(getStoredCustomerSession()))), []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  return (
    <div className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
        className="relative w-full max-w-[min(100%,1080px)] pointer-events-auto lg:w-auto"
      >
        <div
          className={`hpe-glass rounded-2xl px-2.5 py-2.5 flex items-center justify-between gap-3 transition-all duration-300 sm:gap-6 lg:pl-3 lg:pr-2 ${
            scrolled ? 'shadow-[0_8px_40px_-12px_rgba(63,184,255,0.35)]' : ''
          }`}
        >
          <button
            type="button"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/80 transition hover:bg-white/[0.08] hover:text-white lg:hidden"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <a href="/" className="flex items-center gap-2.5 group shrink-0">
            <span className="relative flex h-11 items-center">
              <span className="absolute inset-0 rounded-full bg-cyan-300/20 blur-xl transition group-hover:bg-cyan-300/30" />
              <img
                src="/brand/logo.png"
                alt="Mdrn-Life DDW"
                className="relative h-10 w-auto object-contain drop-shadow-[0_0_18px_rgba(63,184,255,0.38)]"
              />
            </span>
          </a>

          <div className="hidden lg:flex items-center gap-1 max-w-[min(58vw,690px)] overflow-x-auto hpe-no-scrollbar">
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
            Shop
          </a>

          <div className="hidden items-center gap-2 lg:flex">
            {loggedIn ? (
              <>
                <a href="/account" className="rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-medium text-white/75 transition hover:border-cyan-300/30 hover:text-white">
                  Account
                </a>
                <button
                  type="button"
                  aria-label="Logout"
                  onClick={() => clearCustomerSession()}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/60 transition hover:border-cyan-300/30 hover:text-white"
                >
                  <LogOut size={14} />
                </button>
              </>
            ) : (
              <a href="/login" className="rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-medium text-white/75 transition hover:border-cyan-300/30 hover:text-white">
                Login
              </a>
            )}
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-2xl border border-white/10 bg-[#071017]/95 shadow-2xl backdrop-blur-2xl lg:hidden"
            >
              <div className="grid gap-1 p-2">
                {LINKS.map((l) => {
                  const active = pathname === l.href || (l.href !== '/' && pathname.startsWith(`${l.href}/`));
                  return (
                    <a
                      key={l.href}
                      href={l.href}
                      aria-current={active ? 'page' : undefined}
                      className={`rounded-xl px-4 py-3 text-sm transition ${
                        active ? 'bg-cyan-300/[0.12] text-white' : 'text-white/72 hover:bg-white/[0.06] hover:text-white'
                      }`}
                    >
                      {l.label}
                    </a>
                  );
                })}
                <div className="mt-1 grid grid-cols-2 gap-2 border-t border-white/10 pt-2">
                  {loggedIn ? (
                    <>
                      <a href="/account" className="rounded-xl bg-cyan-300/[0.10] px-4 py-3 text-sm text-cyan-100">
                        Account
                      </a>
                      <button type="button" onClick={() => clearCustomerSession()} className="rounded-xl bg-white/[0.05] px-4 py-3 text-left text-sm text-white/72">
                        Logout
                      </button>
                    </>
                  ) : (
                    <a href="/login" className="rounded-xl bg-white/[0.05] px-4 py-3 text-sm text-white/72">
                      Login
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
}
