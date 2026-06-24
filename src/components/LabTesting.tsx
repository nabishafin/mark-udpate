import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Award, Beaker, ChevronDown, FileCheck2, ShieldCheck, X } from 'lucide-react';
import { LAB_FAQS } from '../lib/seo';

const RESULTS = [
  { label: 'Mdrn-Life DDW', value: '5 ppm', detail: 'Batch-specific target', width: '6%' },
  { label: 'Tap water baseline', value: '~150 ppm', detail: 'Typical drinking water', width: '96%' },
  { label: 'Standard bottled water', value: '~145 ppm', detail: 'Common market range', width: '92%' },
  { label: 'Competitor claims', value: 'Varies', detail: 'Often missing public batch proof', width: '58%' },
];

type LabReport = {
  title: string;
  lab: string;
  href: string;
};

const LAB_REPORTS = {
  hydroisotop: {
    title: 'Hydroisotop Batch PDF',
    lab: 'Hydroisotop GmbH',
    href: '/lab-reports/hydroisotop-batch.pdf',
  },
  usgs: {
    title: 'USGS Reston Batch PDF',
    lab: 'USGS Reston Stable Isotope Lab',
    href: '/lab-reports/usgs-reston-batch.pdf',
  },
} satisfies Record<string, LabReport>;

const LAB_SCHEMA = [
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: LAB_FAQS.map((faq) => ({
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
    headline: "Why Independent Lab Testing Makes Mdrn-Life DDW the World's Most Verified Deuterium-Depleted Water",
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
  const [openFaq, setOpenFaq] = useState(0);
  const [activeReport, setActiveReport] = useState<LabReport | null>(null);

  return (
    <section id="science/lab-testing" className="hpe-section relative overflow-hidden">
      {LAB_SCHEMA.map((schema) => (
        <script
          key={schema['@type']}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl"
        >
          <div className="hpe-hud-label mb-3" style={{ color: '#5EE6B5' }}>
            Lab Testing
          </div>
          <h2 className="text-3xl sm:text-5xl font-medium text-white tracking-tight leading-[1.05]">
            <span className="hpe-text-chrome">Why independent lab testing makes Mdrn-Life DDW</span>
            <br />
            <span className="text-white/80">the world's most verified deuterium-depleted water.</span>
          </h2>
          <p className="mt-5 max-w-3xl text-white/65 text-base sm:text-lg leading-relaxed">
            The lab testing page follows the client SEO outline directly: market
            skepticism, what deuterium testing measures, the independent labs,
            batch transparency, what the results mean, and a schema-ready FAQ.
          </p>
        </motion.div>

        <div className="mt-12 space-y-6">
          <OutlineSection eyebrow="The Problem With Unverified Claims" title="Consumers are right to be skeptical.">
            <p>
              The supplement and wellness water industry is full of unverified
              claims. Consumers and practitioners need proof before trusting a
              product that makes scientific claims.
            </p>
            <p>
              Mdrn-Life DDW chose independent verification from day one because
              verification is a scientific obligation, not a marketing move.
            </p>
          </OutlineSection>

          <OutlineSection eyebrow="What Deuterium Testing Actually Measures" title="Deuterium ppm, IRMS, and the 5 ppm result.">
            <DeuteriumMeasurement />
            <p>
              Deuterium testing measures the ratio of hydrogen isotopes in water
              and reports the result in parts per million. Isotope Ratio Mass
              Spectrometry gives a clear way to verify whether a batch reaches
              the 5 ppm target.
            </p>
            <p>
              In simple terms, deuterium is heavier hydrogen. The Mdrn-Life DDW
              science story connects that measurement to the ATP Synthase analogy:
              lighter hydrogen movement supports the cellular energy story in a
              way shoppers can understand without losing the science.
            </p>
          </OutlineSection>

          <article className="hpe-glass rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-emerald-300" size={22} />
              <div>
                <div className="hpe-hud-label" style={{ color: '#5EE6B5' }}>
                  Meet the Labs
                </div>
                <h3 className="mt-2 text-2xl font-medium text-white">Hydroisotop GmbH and USGS Reston Stable Isotope Lab</h3>
              </div>
            </div>
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <LabCard
                icon={<Award size={18} />}
                title="Hydroisotop GmbH"
                body="Hydroisotop GmbH is presented as an independent stable-isotope specialist used to verify deuterium and isotope ratios for Mdrn-Life DDW."
                report={LAB_REPORTS.hydroisotop}
                onOpenReport={setActiveReport}
              />
              <LabCard
                icon={<FileCheck2 size={18} />}
                title="USGS Reston Stable Isotope Lab"
                body="USGS Reston Stable Isotope Lab is presented as a United States institutional lab reference for deuterium and isotope-ratio validation."
                report={LAB_REPORTS.usgs}
                onOpenReport={setActiveReport}
              />
            </div>
          </article>

          <article className="hpe-glass rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <Beaker className="text-cyan-300" size={22} />
              <div>
                <div className="hpe-hud-label" style={{ color: '#5EE6B5' }}>
                  Batch-by-Batch Transparency
                </div>
                <h3 className="mt-2 text-2xl font-medium text-white">5 ppm shown against ordinary water benchmarks.</h3>
              </div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {RESULTS.map((row, index) => (
                <motion.div
                  key={row.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="rounded-xl border border-white/10 bg-white/[0.04] p-4"
                >
                  <div className="text-sm font-medium text-white">{row.label}</div>
                  <div className="mt-3 font-mono text-2xl text-cyan-200">{row.value}</div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      className={row.label === 'Mdrn-Life DDW' ? 'h-full bg-cyan-300' : 'h-full bg-amber-200/80'}
                      initial={{ width: 0 }}
                      whileInView={{ width: row.width }}
                      viewport={{ once: true, margin: '-60px' }}
                      transition={{ duration: 0.9, delay: 0.15 + index * 0.08 }}
                    />
                  </div>
                  <div className="mt-2 text-xs leading-relaxed text-white/45">{row.detail}</div>
                </motion.div>
              ))}
            </div>
          </article>

          <OutlineSection eyebrow="What This Means for You" title="Verification connected to energy, recovery, and cellular performance.">
            <p>
              The test results support the broader science story without replacing
              it with unsupported promises. The verified 5 ppm positioning connects
              back to energy, recovery, cellular hydration, and performance in a
              compliance-friendly way.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a href="/benefits" className="hpe-btn-ghost rounded-xl px-5 py-3 text-sm font-medium tracking-wide">
                Explore benefits
              </a>
              <a href="/products" className="hpe-btn-primary rounded-xl px-5 py-3 text-sm font-medium tracking-wide inline-flex items-center gap-2">
                See the full lab report - then try it risk-free for 30 days
                <ArrowRight size={14} />
              </a>
            </div>
          </OutlineSection>

          <article className="hpe-glass rounded-2xl p-6 sm:p-8">
            <div className="hpe-hud-label mb-3" style={{ color: '#5EE6B5' }}>
              FAQ Block
            </div>
            <div className="mt-6 space-y-3">
              {LAB_FAQS.map((faq, index) => (
                <motion.article
                  key={faq.q}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.45, delay: index * 0.04 }}
                  className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.035]"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left"
                    aria-expanded={openFaq === index}
                  >
                    <span className="text-base font-medium leading-snug text-white">{faq.q}</span>
                    <motion.span animate={{ rotate: openFaq === index ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown size={18} className="text-cyan-200" />
                    </motion.span>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: openFaq === index ? 'auto' : 0, opacity: openFaq === index ? 1 : 0 }}
                    transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-sm leading-relaxed text-white/60">{faq.a}</p>
                  </motion.div>
                </motion.article>
              ))}
            </div>
          </article>
        </div>
      </div>
      <LabReportPanel report={activeReport} onClose={() => setActiveReport(null)} />
    </section>
  );
}

function DeuteriumMeasurement() {
  return (
    <div className="mb-6 grid gap-3 sm:grid-cols-3">
      {[
        ['Sample', 'Water batch'],
        ['Measure', 'Hydrogen isotope ratio'],
        ['Verify', '5 ppm result'],
      ].map(([label, value], index) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.45, delay: index * 0.08 }}
          className="rounded-xl border border-cyan-300/15 bg-cyan-300/[0.045] p-4"
        >
          <div className="hpe-hud-label" style={{ color: '#5EE6B5', fontSize: 9 }}>
            {label}
          </div>
          <div className="mt-2 text-sm font-medium text-white">{value}</div>
        </motion.div>
      ))}
    </div>
  );
}

function OutlineSection({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="hpe-glass rounded-2xl p-6 sm:p-8">
      <div className="hpe-hud-label mb-3" style={{ color: '#5EE6B5' }}>
        {eyebrow}
      </div>
      <h3 className="text-2xl font-medium text-white">{title}</h3>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-white/65">{children}</div>
    </article>
  );
}

function LabCard({
  icon,
  title,
  body,
  report,
  onOpenReport,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  report: LabReport;
  onOpenReport: (report: LabReport) => void;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
      <div className="mb-3 flex items-center gap-2 text-cyan-200">
        {icon}
        <div className="hpe-hud-label" style={{ color: '#5EE6B5' }}>
          Independent Verification
        </div>
      </div>
      <h4 className="text-lg font-medium text-white">{title}</h4>
      <p className="mt-2 text-sm leading-relaxed text-white/60">{body}</p>
      <button
        type="button"
        onClick={() => onOpenReport(report)}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-300/35 bg-cyan-300/[0.08] px-4 py-3 text-sm font-medium text-cyan-100 transition hover:border-cyan-200/70 hover:bg-cyan-300/[0.14] focus:outline-none focus:ring-2 focus:ring-cyan-300/40"
      >
        <FileCheck2 size={15} />
        View batch PDF
      </button>
    </div>
  );
}

function LabReportPanel({ report, onClose }: { report: LabReport | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {report && (
        <motion.aside
          key={report.href}
          role="dialog"
          aria-modal="false"
          aria-labelledby="lab-report-title"
          className="fixed top-24 right-3 bottom-3 z-40 flex w-[88vw] max-w-[520px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#071017]/92 shadow-2xl backdrop-blur-2xl lg:right-8 lg:bottom-8 lg:w-[560px] lg:max-w-none xl:w-[640px]"
          initial={{ x: '120%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '120%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 28 }}
        >
          <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3 sm:px-5">
            <div className="min-w-0">
              <div className="hpe-hud-label" style={{ color: '#5EE6B5', fontSize: 9 }}>
                {report.lab}
              </div>
              <h3 id="lab-report-title" className="mt-1 truncate text-base font-medium text-white">
                {report.title}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close lab report"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
          <iframe
            title={report.title}
            src={`${report.href}#toolbar=1&navpanes=0`}
            className="min-h-0 flex-1 bg-white"
          />
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
