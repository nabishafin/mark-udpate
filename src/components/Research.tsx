import React from 'react';
import { motion } from 'framer-motion';
import { FileCheck2, Link2, Search, ShieldCheck } from 'lucide-react';

const RESEARCH_ITEMS = [
  {
    icon: Search,
    title: 'Keyword opportunity',
    body: 'Priority research topics include deuterium depleted water, deuterium depleted water benefits, DDW brands, and best deuterium depleted water.',
  },
  {
    icon: ShieldCheck,
    title: 'Competitive gap',
    body: 'Most DDW competitors do not publish strong English-language lab transparency content.',
  },
  {
    icon: FileCheck2,
    title: 'Lab reports as proof',
    body: 'Hydroisotop GmbH and USGS Reston Stable Isotope Lab reports should function as downloadable trust assets.',
  },
  {
    icon: Link2,
    title: 'Internal linking',
    body: 'Homepage, product, science, and email content should link back to the lab testing page.',
  },
];

export function Research() {
  return (
    <section id="research" className="hpe-section relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <div className="hpe-hud-label mb-3">Research</div>
          <h2 className="text-3xl sm:text-5xl font-medium text-white tracking-tight leading-[1.05]">
            <span className="text-white/80">Research built around</span>{' '}
            <span className="hpe-text-chrome">verification and search intent.</span>
          </h2>
          <p className="mt-5 text-white/60 text-base sm:text-lg leading-relaxed">
            Research content is focused on verification, lab transparency, search
            demand, and internal linking.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {RESEARCH_ITEMS.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="hpe-glass rounded-2xl p-6"
            >
              <item.icon size={18} className="text-cyan-300" />
              <h3 className="mt-4 text-lg font-medium text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">{item.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
