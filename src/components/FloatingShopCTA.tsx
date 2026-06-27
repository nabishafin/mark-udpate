import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ShoppingCart } from 'lucide-react';

type Props = { pathname: string };

export function FloatingShopCTA({ pathname }: Props) {
  const [visible, setVisible] = useState(false);
  const isShopPage =
    pathname === '/products' || pathname === '/cart' || pathname === '/products/cart';

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 420);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && !isShopPage && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
          className="fixed bottom-6 left-6 z-40 pointer-events-auto"
        >
          <a
            href="/products"
            className="hpe-btn-primary inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium tracking-wide shadow-2xl"
          >
            <ShoppingCart size={14} />
            Shop 5 PPM DDW
            <ArrowRight size={13} />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
