import { motion } from 'framer-motion';
import { ArrowRight, Atom, Cpu, FlaskConical, Gauge, Package, ShieldCheck, Waves } from 'lucide-react';

const PILLARS = [
  {
    icon: Atom,
    label: 'Deuterium Depletion',
    title: '5 ppm DDW positioning',
    body: 'Mdrn-Life DDW is positioned as 5 ppm deuterium-depleted water, compared with ordinary water around 145-155 ppm.',
  },
  {
    icon: Cpu,
    label: 'Mitochondria',
    title: 'Cellular energy support',
    body: 'Deuterium-depleted hydration is connected with mitochondria, ATP, cellular function, energy production, recovery, and oxidative balance.',
  },
  {
    icon: Waves,
    label: 'Oxidative Stress',
    title: 'Recovery and aging language',
    body: 'The website concept and body-panel content mention oxidative stress as a support theme for recovery, skin, aging routines, and cellular balance.',
  },
  {
    icon: FlaskConical,
    label: 'Lab Verification',
    title: 'IRMS and independent testing',
    body: 'Hydroisotop GmbH, USGS Reston Stable Isotope Lab, and Isotope Ratio Mass Spectrometry form the credibility foundation.',
  },
];

export function ScienceSection() {
  return (
    <section id="science" className="hpe-section relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-start"
        >
          <div>
            <div className="hpe-hud-label mb-3">The Science</div>
            <h1 className="text-4xl sm:text-6xl font-medium text-white tracking-tight leading-[1.03]">
              Deuterium-depleted water, explained through motion.
            </h1>
            <p className="mt-5 max-w-2xl text-white/62 text-base sm:text-lg leading-relaxed">
              DDW is framed around deuterium ppm, cellular hydration, mitochondria,
              oxidative stress, lab testing, recovery, and healthy aging.
            </p>
          </div>

          <ScienceSimulation />
        </motion.div>

        <DDWJourney />

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          <ScienceStat label="Ordinary water range" value="145-155 ppm" />
          <ScienceStat label="Mdrn-Life DDW" value="5 ppm" />
          <ScienceStat label="Verification method" value="IRMS" />
        </div>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PILLARS.map((pillar, index) => (
            <motion.article
              key={pillar.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
              className="hpe-glass rounded-2xl p-6"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                style={{
                  background: 'rgba(63,184,255,0.1)',
                  border: '1px solid rgba(63,184,255,0.3)',
                }}
              >
                <pillar.icon size={16} className="text-cyan-300" />
              </div>
              <div className="hpe-hud-label mb-2">{pillar.label}</div>
              <h2 className="text-white text-lg font-medium leading-snug">{pillar.title}</h2>
              <p className="mt-2 text-white/55 text-sm leading-relaxed">{pillar.body}</p>
            </motion.article>
          ))}
        </div>

        <div className="mt-8 hpe-glass rounded-2xl p-6 sm:p-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="hpe-hud-label mb-2">Independent Verification</div>
            <h2 className="text-2xl font-medium text-white">IRMS verified DDW, documented batch by batch.</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/60 max-w-2xl">
              Hydroisotop GmbH, USGS Reston Stable Isotope Lab, IRMS, and
              batch-specific 5 ppm verification are documented on the dedicated
              lab testing page.
            </p>
          </div>
          <a href="/science/lab-testing" className="hpe-btn-primary rounded-xl px-5 py-3 text-sm font-medium tracking-wide inline-flex items-center justify-center gap-2 shrink-0">
            View Lab Testing
            <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}

function DDWJourney() {
  const steps = [
    {
      icon: Waves,
      label: 'Natural Water',
      value: '145-155 ppm',
      body: 'Deuterium occurs naturally in drinking water at this baseline concentration.',
      color: 'text-amber-200',
    },
    {
      icon: FlaskConical,
      label: 'Depletion Process',
      value: 'Fractional distillation',
      body: 'A selective process progressively reduces deuterium content to target levels.',
      color: 'text-cyan-200',
    },
    {
      icon: Cpu,
      label: '5 ppm Production',
      value: 'Target reached',
      body: 'Water is produced to a verified 5 ppm deuterium concentration.',
      color: 'text-green-200',
    },
    {
      icon: ShieldCheck,
      label: 'IRMS Verification',
      value: 'Independent labs',
      body: 'Isotope Ratio Mass Spectrometry confirms every batch from two independent labs.',
      color: 'text-emerald-200',
    },
    {
      icon: Package,
      label: 'Final Bottling',
      value: 'Glass & PET',
      body: 'Verified DDW bottled in premium glass and BPA-free PET plastic in the US.',
      color: 'text-cyan-200',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: 0.1 }}
      className="mt-12"
    >
      <div className="hpe-hud-label mb-4">DDW Production Journey</div>
      <div className="grid gap-3 sm:grid-cols-5">
        {steps.map((step, index) => (
          <motion.div
            key={step.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            className="relative rounded-2xl border border-white/10 bg-white/[0.035] p-4"
          >
            {index < steps.length - 1 && (
              <span className="absolute -right-1.5 top-1/2 hidden -translate-y-1/2 text-white/20 sm:block text-xs">&gt;</span>
            )}
            <div className="mb-3 flex items-center gap-2">
              <step.icon size={14} className={step.color} />
              <div className="hpe-hud-label" style={{ fontSize: 8 }}>{step.label}</div>
            </div>
            <div className="font-mono text-sm text-white leading-tight">{step.value}</div>
            <p className="mt-2 text-xs leading-relaxed text-white/48">{step.body}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function ScienceSimulation() {
  const stages = [
    {
      icon: Atom,
      label: 'Measure',
      title: 'Deuterium ppm',
      body: 'Compare ordinary water at 145-155 ppm against the 5 ppm Mdrn-Life DDW target.',
      accent: 'text-amber-200',
    },
    {
      icon: FlaskConical,
      label: 'Verify',
      title: 'IRMS testing',
      body: 'Use isotope ratio mass spectrometry to confirm the actual batch measurement.',
      accent: 'text-cyan-200',
    },
    {
      icon: Cpu,
      label: 'Explain',
      title: 'ATP Synthase analogy',
      body: 'Connect lighter hydrogen movement to the cellular energy story without losing the science.',
      accent: 'text-green-200',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.08 }}
      className="hpe-glass relative min-h-[430px] overflow-hidden rounded-2xl p-6"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(63,184,255,0.18),transparent_44%)]" />
      <div className="relative z-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="hpe-hud-label">Automated Explanation</div>
            <h2 className="mt-2 text-2xl font-medium text-white">Measure, verify, then explain.</h2>
          </div>
          <Gauge className="text-cyan-300" size={28} />
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-[0.9fr_1.1fr] sm:items-center">
          <div className="space-y-4">
            {stages.map((stage, index) => (
              <motion.div
                key={stage.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: 0.25 + index * 0.12 }}
                className="rounded-xl border border-white/10 bg-white/[0.035] p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
                    <stage.icon size={16} className={stage.accent} />
                  </div>
                  <div>
                    <div className="hpe-hud-label" style={{ fontSize: 8 }}>
                      {stage.label}
                    </div>
                    <h3 className="mt-1 text-sm font-medium text-white">{stage.title}</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-white/52">{stage.body}</p>
                  </div>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className={index === 0 ? 'h-full bg-amber-200' : index === 1 ? 'h-full bg-cyan-300' : 'h-full bg-green-300'}
                    initial={{ width: 0 }}
                    animate={{ width: index === 0 ? '94%' : index === 1 ? '72%' : '52%' }}
                    transition={{ duration: 0.9, delay: 0.45 + index * 0.14 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="relative mx-auto flex h-72 w-full max-w-sm items-center justify-center">
            <motion.div
              className="absolute h-60 w-60 rounded-full border border-cyan-200/20"
              animate={{ rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute h-40 w-40 rounded-full border border-amber-200/20"
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="flex h-28 w-28 items-center justify-center rounded-full border border-cyan-200/35 bg-cyan-300/[0.08] text-center"
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div>
                <Cpu className="mx-auto text-cyan-200" size={18} />
                <div className="mt-2 font-mono text-xl text-white">5 ppm</div>
                <div className="hpe-hud-label" style={{ fontSize: 8 }}>
                  Verified
                </div>
              </div>
            </motion.div>
            {stages.map((stage, index) => (
              <motion.div
                key={stage.title}
                className="absolute w-24 rounded-xl border border-white/10 bg-white/[0.055] p-2 text-center backdrop-blur"
                style={{
                  left: `${10 + index * 34}%`,
                  top: index === 1 ? '4%' : '74%',
                }}
                animate={{ y: [0, -10, 0], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2.8 + index * 0.35, repeat: Infinity, ease: 'easeInOut' }}
              >
                <stage.icon size={15} className={`mx-auto ${stage.accent}`} />
                <div className="mt-1 text-[10px] leading-tight text-white/72">{stage.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ScienceStat({ label, value }: { label: string; value: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
      className="hpe-glass rounded-2xl p-5"
    >
      <div className="hpe-hud-label" style={{ fontSize: 9 }}>
        {label}
      </div>
      <div className="mt-2 font-mono text-2xl text-white">{value}</div>
    </motion.div>
  );
}
