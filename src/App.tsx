import React, { useEffect, useState } from 'react';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { ScienceSection } from './components/ScienceSection';
import { LabTesting } from './components/LabTesting';
import { Benefits } from './components/Benefits';
import { AthletesRecovery } from './components/AthletesRecovery';
import { HealthyAging } from './components/HealthyAging';
import { Products } from './components/Products';
import { CartPage } from './components/CartPage';
import { Research } from './components/Research';
import { CTAFooter } from './components/CTAFooter';
import { ContactPage } from './components/ContactPage';
import { OrganPanel } from './components/OrganPanel';
import { SeoHead } from './components/SeoHead';
import { BlogPage } from './components/BlogPage';
import { BlogArticlePage } from './components/BlogArticlePage';
import { PolicyPage } from './components/PolicyPage';
import { FounderPage } from './components/FounderPage';
import { LearnPage } from './components/LearnPage';
import { FloatingShopCTA } from './components/FloatingShopCTA';
import { CheckoutPage } from './components/CheckoutPage';
import { Organ } from './components/organData';

function normalizePath(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1);
  return pathname || '/';
}

export function App() {
  const [activeOrgan, setActiveOrgan] = useState<Organ | null>(null);
  const [pathname, setPathname] = useState(() => normalizePath(window.location.pathname));

  useEffect(() => {
    const updatePath = () => {
      setPathname(normalizePath(window.location.pathname));
      setActiveOrgan(null);
      window.scrollTo({ top: 0, behavior: 'auto' });
    };

    window.addEventListener('popstate', updatePath);
    return () => window.removeEventListener('popstate', updatePath);
  }, []);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
      if (!link || link.target || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const url = new URL(link.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.hash) return;

      event.preventDefault();
      window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`);
      window.dispatchEvent(new PopStateEvent('popstate'));
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const handleSelectOrgan = (organ: Organ | null) => {
    setActiveOrgan(organ);
    if (organ) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  const page = renderPage(pathname, handleSelectOrgan, activeOrgan?.id ?? null);

  return (
    <div className="dark min-h-screen w-full bg-[#050608] text-white antialiased relative">
      <SeoHead />
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-[#050608]" />
        <div className="absolute top-0 left-1/3 w-[800px] h-[800px] hpe-glow-cyan opacity-25" />
        <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] hpe-glow-gold opacity-15" />
      </div>

      <Nav pathname={pathname} />

      <main>
        {page}
        <CTAFooter />
      </main>

      <OrganPanel
        organ={activeOrgan}
        onClose={() => setActiveOrgan(null)}
        onNavigate={handleSelectOrgan}
      />
      <FloatingShopCTA pathname={pathname} />
    </div>
  );
}

function renderPage(pathname: string, onSelectOrgan: (organ: Organ) => void, activeId: string | null) {
  switch (pathname) {
    case '/':
      return <HomePage onSelectOrgan={onSelectOrgan} activeId={activeId} />;
    case '/science':
      return <ScienceSection />;
    case '/science/lab-testing':
      return <LabTesting />;
    case '/benefits':
      return <Benefits />;
    case '/athletes-recovery':
      return <AthletesRecovery />;
    case '/healthy-aging':
      return <HealthyAging />;
    case '/shop':
    case '/products':
      return <Products />;
    case '/cart':
    case '/products/cart':
      return <CartPage />;
    case '/checkout':
      return <CheckoutPage />;
    case '/research':
      return <Research />;
    case '/blogs':
    case '/blogs/news':
      return <BlogPage />;
    case '/contact':
      return <ContactPage />;
    case '/learn':
      return <LearnPage />;
    default:
      if (pathname.startsWith('/blogs/news/') && pathname.length > '/blogs/news/'.length) {
        return <BlogArticlePage handle={pathname.slice('/blogs/news/'.length)} />;
      }
      if (pathname.startsWith('/policies/')) {
        return <PolicyPage slug={pathname.replace('/policies/', '')} />;
      }
      if (pathname === '/pages/refund') {
        return <PolicyPage slug="refund-information" />;
      }
      if (pathname === '/founder') {
        return <FounderPage />;
      }
      if (pathname.startsWith('/learn/') && pathname.length > '/learn/'.length) {
        return <LearnPage slug={pathname.slice('/learn/'.length)} />;
      }
      // NOTE: Shopify checkout paths (/checkouts/, /cart/c/, /a/checkout) are handled
      // by the nginx reverse-proxy (see docs/nginx-shopify-checkout-proxy.conf), so the
      // SPA never renders for them in production. No client-side redirect here — a
      // window.location redirect to the myshopify domain causes an infinite refresh
      // loop (Shopify bounces back to the canonical domain -> SPA -> redirect -> ...).
      return <HomePage onSelectOrgan={onSelectOrgan} activeId={activeId} />;
  }
}

function HomePage({
  onSelectOrgan,
  activeId,
}: {
  onSelectOrgan: (organ: Organ) => void;
  activeId: string | null;
}) {
  return (
    <Hero onSelectOrgan={onSelectOrgan} activeId={activeId} />
  );
}

