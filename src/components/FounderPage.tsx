import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Atom, Cpu, FlaskConical, ShieldCheck, Target } from 'lucide-react';

const JOURNEY = [
  {
    icon: Atom,
    label: 'The Question',
    title: 'What exactly is in the water?',
    body: 'Most people have never questioned their water beyond basic purity. Scientists discovered that ordinary water — even the cleanest spring water — contains a heavier isotope of hydrogen called deuterium at concentrations between 145 and 155 parts per million. That number has been measured, published, and consistently reproduced across independent labs for decades.',
  },
  {
    icon: FlaskConical,
    label: 'The Research',
    title: 'A specific, measurable field of study.',
    body: 'Scientific interest in deuterium depletion spans several decades. Researchers have studied how deuterium concentrations in water relate to cellular processes and biological activity. The literature is precise, measurable, and independently reproducible. Mdrn-Life is built on that body of work — not around it.',
  },
  {
    icon: Target,
    label: 'The Standard',
    title: 'Why 5 ppm, not 25 or 50.',
    body: 'After reviewing the research, 5 ppm was identified as the production target — one of the lowest deuterium concentrations produced at commercial scale. Most DDW producers operate at 25 to 125 ppm. We chose 5 ppm as our benchmark, then set out to independently verify it.',
  },
  {
    icon: ShieldCheck,
    label: 'The Verification',
    title: 'Every batch. Two independent labs.',
    body: 'We partnered with Hydroisotop GmbH and the USGS Reston Stable Isotope Lab to confirm our 5 ppm concentration using Isotope Ratio Mass Spectrometry. Not a one-time certification — batch-specific transparency. If we cannot verify it, it does not ship.',
  },
  {
    icon: Cpu,
    label: 'The Mission',
    title: 'Built for people who ask better questions.',
    body: 'Mdrn-Life DDW exists for people who read labels, understand biomarkers, and want to know exactly what goes into their body. People who treat hydration as a variable worth optimizing — not an afterthought. The mission is to build the most verified, most transparent, and most precisely produced DDW available.',
  },
];

export function FounderPage() {
  return (
    <section className="hpe-section relative min-h-screen overflow-hidden pt-32">
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <div className="hpe-hud-label mb-3">Our Story</div>
          <h1 className="text-4xl font-medium tracking-tight text-white sm:text-6xl leading-[1.03]">
            <span className="hpe-text-chrome">The science behind</span>
            <br />
            <span style={{ color: '#3FB8FF', textShadow: '0 0 24px rgba(63,184,255,0.5)' }}>
              the standard.
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/62 sm:text-lg">
            Mdrn-Life DDW was built from a single question: if deuterium levels in water
            are measurable, reproducible, and scientifically studied — why isn't anyone
            producing a verified low-deuterium product with complete batch transparency?
          </p>
        </motion.div>

        <div className="mt-14 grid gap-5">
          {JOURNEY.map((step, index) => (
            <motion.article
              key={step.label}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 + index * 0.07 }}
              className="hpe-glass rounded-2xl p-6 sm:p-8 grid gap-6 sm:grid-cols-[auto_1fr]"
            >
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                style={{
                  background: 'rgba(63,184,255,0.09)',
                  border: '1px solid rgba(63,184,255,0.25)',
                }}
              >
                <step.icon size={20} className="text-cyan-300" />
              </div>
              <div>
                <div className="hpe-hud-label mb-2">{step.label}</div>
                <h2 className="text-xl font-medium text-white sm:text-2xl">{step.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-white/62 sm:text-base">{step.body}</p>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-10 hpe-glass rounded-2xl p-8 text-center"
        >
          <div className="hpe-hud-label mb-3">Independently Verified</div>
          <h2 className="text-2xl font-medium text-white sm:text-3xl">
            Start with the lab results.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base">
            Hydroisotop GmbH. USGS Reston Stable Isotope Lab. IRMS testing. Batch-specific
            verification. Every claim made by Mdrn-Life DDW has a document behind it.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <a
              href="/science/lab-testing"
              className="hpe-btn-ghost rounded-xl px-6 py-3.5 text-sm font-medium tracking-wide"
            >
              View Lab Testing
            </a>
            <a
              href="/products"
              className="hpe-btn-primary rounded-xl px-6 py-3.5 text-sm font-medium tracking-wide inline-flex items-center gap-2"
            >
              Shop 5 PPM DDW
              <ArrowRight size={14} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
