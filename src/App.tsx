import { lazy, Suspense, useEffect, useState } from 'react';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { CTAFooter } from './components/CTAFooter';
import { OrganPanel } from './components/OrganPanel';
import { SeoHead } from './components/SeoHead';
import { FloatingShopCTA } from './components/FloatingShopCTA';
import { NotFoundPage } from './components/NotFoundPage';
import type { Organ } from './components/organData';

const ScienceSection = lazy(() => import('./components/ScienceSection').then(({ ScienceSection }) => ({ default: ScienceSection })));
const LabTesting = lazy(() => import('./components/LabTesting').then(({ LabTesting }) => ({ default: LabTesting })));
const Benefits = lazy(() => import('./components/Benefits').then(({ Benefits }) => ({ default: Benefits })));
const AthletesRecovery = lazy(() => import('./components/AthletesRecovery').then(({ AthletesRecovery }) => ({ default: AthletesRecovery })));
const HealthyAging = lazy(() => import('./components/HealthyAging').then(({ HealthyAging }) => ({ default: HealthyAging })));
const Products = lazy(() => import('./components/Products').then(({ Products }) => ({ default: Products })));
const CartPage = lazy(() => import('./components/CartPage').then(({ CartPage }) => ({ default: CartPage })));
const Research = lazy(() => import('./components/Research').then(({ Research }) => ({ default: Research })));
const ContactPage = lazy(() => import('./components/ContactPage').then(({ ContactPage }) => ({ default: ContactPage })));
const BlogPage = lazy(() => import('./components/BlogPage').then(({ BlogPage }) => ({ default: BlogPage })));
const BlogArticlePage = lazy(() => import('./components/BlogArticlePage').then(({ BlogArticlePage }) => ({ default: BlogArticlePage })));
const PolicyPage = lazy(() => import('./components/PolicyPage').then(({ PolicyPage }) => ({ default: PolicyPage })));
const FounderPage = lazy(() => import('./components/FounderPage').then(({ FounderPage }) => ({ default: FounderPage })));
const LearnPage = lazy(() => import('./components/LearnPage').then(({ LearnPage }) => ({ default: LearnPage })));
const CheckoutPage = lazy(() => import('./components/CheckoutPage').then(({ CheckoutPage }) => ({ default: CheckoutPage })));
const AccountPage = lazy(() => import('./components/AccountPage').then(({ AccountPage }) => ({ default: AccountPage })));
const OrdersPage = lazy(() => import('./components/OrderPages').then(({ OrdersPage }) => ({ default: OrdersPage })));
const ShopifyInbox = lazy(() => import('./components/ShopifyInbox').then(({ ShopifyInbox }) => ({ default: ShopifyInbox })));
const EmailPopup = lazy(() => import('./components/EmailPopup').then(({ EmailPopup }) => ({ default: EmailPopup })));

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
        <Suspense fallback={<PageFallback />}>
          {page}
        </Suspense>
        <CTAFooter />
      </main>

      <OrganPanel
        organ={activeOrgan}
        onClose={() => setActiveOrgan(null)}
        onNavigate={handleSelectOrgan}
      />
      <FloatingShopCTA pathname={pathname} />
      <Suspense fallback={null}>
        <ShopifyInbox />
        <EmailPopup />
      </Suspense>
    </div>
  );
}

function PageFallback() {
  return (
    <section className="flex min-h-screen items-center justify-center px-6 pt-28">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-cyan-300" />
    </section>
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
    case '/login':
      return <AccountPage mode="login" />;
    case '/register':
      return <AccountPage mode="register" />;
    case '/forgot-password':
      return <AccountPage mode="recover" />;
    case '/reset-password':
      return <AccountPage mode="reset" />;
    case '/account':
      return <AccountPage mode="account" />;
    case '/account/orders':
      return <OrdersPage />;
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
      if (pathname.startsWith('/account/orders/') && pathname.length > '/account/orders/'.length) {
        return <OrdersPage orderId={pathname.slice('/account/orders/'.length)} />;
      }
      if (pathname.startsWith('/account/reset/') && pathname.length > '/account/reset/'.length) {
        return <AccountPage mode="reset" />;
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
      return <NotFoundPage />;
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
