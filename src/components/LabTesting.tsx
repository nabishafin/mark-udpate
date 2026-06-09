import React from 'react';
import { motion } from 'framer-motion';
import { Award, Beaker, FileCheck2, ShieldCheck } from 'lucide-react';
import { Particles } from './Particles';

const RESULTS = [
  { label: 'Mdrn-Life DDW', value: '5 ppm', detail: 'Batch-specific target' },
  { label: 'Tap water baseline', value: '~150 ppm', detail: 'Typical drinking water' },
  { label: 'Standard bottled water', value: '~145 ppm', detail: 'Common market range' },
];

const FAQS = [
  {
    q: 'Is deuterium depleted water the same as hydrogen water?',
    a: 'No. Hydrogen water is regular water infused with dissolved molecular hydrogen. Deuterium-depleted water is processed to reduce the heavy hydrogen isotope concentration from typical drinking-water levels to a lower ppm target.',
  },
  {
    q: 'How do I know my DDW is actually 5 ppm?',
    a: 'Mdrn-Life DDW presents independent verification from Hydroisotop GmbH and the USGS Reston Stable Isotope Lab using isotope analysis methods including Isotope Ratio Mass Spectrometry.',
  },
  {
    q: 'What labs test deuterium levels in water?',
    a: 'Specialized stable isotope laboratories test deuterium levels. The client SEO brief names Hydroisotop GmbH in Germany and the USGS Reston Stable Isotope Lab in the United States.',
  },
  {
    q: 'Where can I buy independently tested deuterium depleted water?',
    a: 'Mdrn-Life DDW is available through the current product collection in glass bottles and PET plastic bottles, with internal links provided from this experience.',
  },
];

const LAB_SCHEMA = [
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Why Independent Lab Testing Makes Mdrn-Life DDW the World\'s Most Verified Deuterium-Depleted Water',
    description:
      'Every batch of Mdrn-Life DDW is verified by Hydroisotop GmbH and USGS Reston Stable Isotope Lab using isotope testing. See the results and what they mean.',
    url: 'https://mdrnlifeddw.com/science/lab-testing',
    publisher: {
      '@type': 'Organization',
      name: 'Mdrn-Life DDW',
      url: 'https://mdrnlifeddw.com',
    },
    mainEntityOfPage: 'https://mdrnlifeddw.com/science/lab-testing',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://mdrnlifeddw.com' },
      { '@type': 'ListItem', position: 2, name: 'Science', item: 'https://mdrnlifeddw.com/science' },
      { '@type': 'ListItem', position: 3, name: 'Lab Testing', item: 'https://mdrnlifeddw.com/science/lab-testing' },
    ],
  },
];

export function LabTesting() {
  return (
    <section id="science/lab-testing" className="hpe-section relative overflow-hidden">
      {LAB_SCHEMA.map((schema) => (
        <script
          key={schema['@type']}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <div className="absolute inset-0 hpe-grid opacity-25" />
      <div className="absolute left-1/2 top-0 h-[620px] w-[920px] -translate-x-1/2 hpe-glow-cyan opacity-25" />
      <Particles count={18} color="rgba(94,230,181,0.36)" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl"
        >
          <div className="hpe-hud-label mb-3" style={{ color: '#5EE6B5' }}>
            03 - Lab Testing
          </div>
          <h2 className="text-3xl sm:text-5xl font-medium text-white tracking-tight leading-[1.05]">
            <span className="hpe-text-chrome">Why independent lab testing makes</span>
            <br />
            <span className="text-white/80">Mdrn-Life DDW verifiable.</span>
          </h2>
          <p className="mt-5 max-w-3xl text-white/65 text-base sm:text-lg leading-relaxed">
            The wellness water market is crowded with unverified claims. Mdrn-Life DDW
            turns verification into the standard: 5 ppm deuterium results, independent
            review, and a clear explanation of what the lab data means for cellular
            hydration and performance.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="hpe-glass rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-emerald-300" size={22} />
              <h3 className="text-2xl font-medium text-white">Meet the verification labs</h3>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <LabCard
                icon={<Award size={18} />}
                title="Hydroisotop GmbH"
                body="Germany-based stable isotope specialists named by the client as an independent third-party validation source for Mdrn-Life DDW."
              />
              <LabCard
                icon={<FileCheck2 size={18} />}
                title="USGS Reston Stable Isotope Lab"
                body="A United States federal stable isotope laboratory referenced in the SEO brief for independent deuterium verification."
              />
            </div>
            <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.04] p-5">
              <div className="hpe-hud-label mb-2" style={{ color: '#5EE6B5' }}>
                Method
              </div>
              <p className="text-sm leading-relaxed text-white/70">
                Deuterium concentration is evaluated with stable isotope testing,
                including Isotope Ratio Mass Spectrometry. This measures the ratio of
                hydrogen isotopes in water and reports the result in parts per million,
                making the 5 ppm target easy to compare against ordinary water.
              </p>
            </div>
          </div>

          <div className="hpe-glass rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <Beaker className="text-cyan-300" size={22} />
              <h3 className="text-2xl font-medium text-white">Batch transparency</h3>
            </div>
            <div className="mt-6 space-y-3">
              {RESULTS.map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.04] p-4">
                  <div>
                    <div className="text-sm font-medium text-white">{row.label}</div>
                    <div className="mt-1 text-xs text-white/45">{row.detail}</div>
                  </div>
                  <div className="font-mono text-lg text-cyan-200">{row.value}</div>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm leading-relaxed text-white/65">
              This content gives search engines and buyers the same answer: Mdrn-Life DDW
              is positioned as the independently verified 5 ppm option among deuterium
              depleted water brands.
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-4">
          {FAQS.map((faq) => (
            <article key={faq.q} className="hpe-glass rounded-2xl p-5">
              <h3 className="text-base font-medium leading-snug text-white">{faq.q}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">{faq.a}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <a href="#products" className="hpe-btn-primary rounded-xl px-5 py-3 text-sm font-medium tracking-wide">
            Try it risk-free for 30 days
          </a>
          <a href="#science" className="hpe-btn-ghost rounded-xl px-5 py-3 text-sm font-medium tracking-wide">
            Explore the science
          </a>
        </div>
      </div>
    </section>
  );
}

function LabCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
      <div className="mb-3 flex items-center gap-2 text-cyan-200">
        {icon}
        <div className="hpe-hud-label" style={{ color: '#5EE6B5' }}>
          Independent
        </div>
      </div>
      <h3 className="text-lg font-medium text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-white/60">{body}</p>
    </div>
  );
}
