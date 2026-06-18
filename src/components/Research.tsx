import { motion } from 'framer-motion';
import {
  ArrowRight,
  Atom,
  Cpu,
  Droplets,
  FlaskConical,
  Gauge,
  Microscope,
  ShieldCheck,
  Waves,
  type LucideIcon,
} from 'lucide-react';

const RESEARCH_BEATS = [
  {
    icon: Atom,
    title: 'Deuterium in water',
    signal: '145-155 PPM natural range',
    body: 'Every glass of water contains hydrogen. A small portion of that hydrogen exists as deuterium, a naturally occurring isotope that is approximately twice as heavy as ordinary hydrogen.',
  },
  {
    icon: Cpu,
    title: 'Cellular energy context',
    signal: 'mitochondrial function',
    body: "Researchers around the world have spent decades studying the role deuterium may play in biological systems, cellular energy production, metabolism, and mitochondrial function.",
  },
  {
    icon: Droplets,
    title: 'Depletion target',
    signal: '150-155 -> 5 PPM',
    body: 'Mdrn-Life DDW is produced through an advanced multi-stage purification and depletion process designed to reduce naturally occurring deuterium levels from approximately 150-155 PPM to as low as 5 PPM.',
  },
  {
    icon: ShieldCheck,
    title: 'Transparent standards',
    signal: 'independent testing',
    body: 'Every batch is produced with a commitment to quality, consistency, and transparency. Independent laboratory testing is performed to verify isotopic composition and maintain production standards.',
  },
];

const PROCESS_STEPS = [
  { label: 'Reverse osmosis', icon: Waves },
  { label: 'Fractional distillation', icon: FlaskConical },
  { label: 'Electrolysis', icon: Gauge },
  { label: 'Filtration', icon: Droplets },
  { label: 'Purification', icon: ShieldCheck },
];

const EDUCATION_FLOW = [
  {
    title: 'Hydrogen and deuterium',
    body: 'Most natural drinking water contains between 145-155 parts per million of deuterium.',
  },
  {
    title: 'Why researchers study it',
    body: 'Because hydrogen is involved in many biological processes, scientists have explored how varying deuterium concentrations may influence cellular environments.',
  },
  {
    title: 'How the product is framed',
    body: 'The process combines reverse osmosis, fractional distillation, electrolysis, filtration, and purification technologies to create one of the most highly depleted waters available.',
  },
  {
    title: 'What the brand shares',
    body: 'At Mdrn-Life DDW, informed consumers make better decisions. The brand is committed to sharing the science, supporting ongoing research, and providing premium hydration for people who demand more from their water.',
  },
];

export function Research() {
  return (
    <section id="research" className="hpe-section relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center"
        >
          <div>
            <div className="hpe-hud-label mb-3">Research</div>
            <h1 className="text-4xl sm:text-6xl font-medium tracking-tight leading-[1.03] text-white">
              The science behind deuterium.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/62 sm:text-lg">
              Every glass of water contains hydrogen. A small portion of that
              hydrogen exists as deuterium, a naturally occurring isotope that is
              approximately twice as heavy as ordinary hydrogen.
            </p>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/62">
              Most natural drinking water contains between 145-155 PPM of
              deuterium. Mdrn-Life DDW is produced to reduce that level to as low
              as 5 PPM through an advanced multi-stage process.
            </p>
            <a
              href="/science/lab-testing"
              className="mt-8 hpe-btn-primary rounded-xl px-5 py-3 text-sm font-medium tracking-wide inline-flex items-center gap-2"
            >
              View independent testing
              <ArrowRight size={14} />
            </a>
          </div>

          <ResearchSimulation />
        </motion.div>

        <div className="mt-14 grid gap-4 md:grid-cols-4">
          {RESEARCH_BEATS.map((beat, index) => (
            <ResearchBeat key={beat.title} beat={beat} index={index} />
          ))}
        </div>

        <motion.article
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-70px' }}
          transition={{ duration: 0.65 }}
          className="mt-8 hpe-glass rounded-2xl p-6 sm:p-8"
        >
          <div className="grid gap-8 lg:grid-cols-[0.35fr_0.65fr] lg:items-start">
            <div>
              <div className="hpe-hud-label mb-3">Research Flow</div>
              <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-white">
                From isotope context to product transparency.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-white/56">
                The page walks users through what deuterium is, why researchers
                study it, how Mdrn-Life DDW is produced, and how testing supports
                the quality standard.
              </p>
            </div>
            <div className="relative space-y-4">
              <div className="absolute left-5 top-6 bottom-6 hidden w-px bg-cyan-300/20 sm:block" />
              {EDUCATION_FLOW.map((step, index) => (
                <ResearchStoryStep key={step.title} step={step} index={index} />
              ))}
            </div>
          </div>
        </motion.article>

        <motion.article
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-70px' }}
          transition={{ duration: 0.65 }}
          className="mt-8 hpe-glass rounded-2xl p-6 sm:p-8"
        >
          <div className="grid gap-8 lg:grid-cols-[0.4fr_0.6fr] lg:items-center">
            <div>
              <div className="hpe-hud-label mb-3">Production Path</div>
              <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-white">
                Multi-stage depletion and purification.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-white/58">
                The process combines reverse osmosis, fractional distillation,
                electrolysis, filtration, and purification technologies to create
                one of the most highly depleted waters available.
              </p>
            </div>
            <ProcessSimulation />
          </div>
        </motion.article>
      </div>
    </section>
  );
}

function ResearchSimulation() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.08 }}
      className="hpe-glass relative min-h-[520px] overflow-hidden rounded-2xl p-6"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_48%_35%,rgba(63,184,255,0.17),transparent_40%),radial-gradient(circle_at_78%_76%,rgba(229,194,90,0.12),transparent_32%)]" />
      <div className="relative z-10 flex min-h-[472px] flex-col">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="hpe-hud-label">Deuterium Model</div>
            <h2 className="mt-2 text-2xl font-medium text-white">From natural water to 5 PPM DDW.</h2>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-300/25 bg-cyan-300/[0.07]">
            <Microscope className="text-cyan-300" size={22} />
          </div>
        </div>

        <div className="mt-9 grid flex-1 gap-5 lg:grid-cols-[0.8fr_1fr]">
          <div className="space-y-4">
            <IsotopeRow label="Ordinary hydrogen" value="H" weight="lighter" />
            <IsotopeRow label="Deuterium isotope" value="D" weight="about 2x heavier" accent />

            <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.045] p-4">
              <div className="flex items-center justify-between gap-4">
                <span className="hpe-hud-label" style={{ fontSize: 9 }}>
                  Natural drinking water
                </span>
                <span className="font-mono text-xs text-cyan-100/75">145-155 PPM</span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full bg-cyan-300/80"
                  initial={{ width: 0 }}
                  animate={{ width: '94%' }}
                  transition={{ duration: 1, delay: 0.45 }}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-amber-200/20 bg-amber-200/[0.055] p-4">
              <div className="flex items-center justify-between gap-4">
                <span className="hpe-hud-label" style={{ color: '#F0D27A', fontSize: 9 }}>
                  Mdrn-Life DDW target
                </span>
                <span className="font-mono text-xs text-amber-100/80">as low as 5 PPM</span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full bg-amber-200/85"
                  initial={{ width: 0 }}
                  animate={{ width: '8%' }}
                  transition={{ duration: 1, delay: 0.65 }}
                />
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(63,184,255,0.14),transparent_42%)]" />
            <div className="relative z-10 flex h-full flex-col justify-between">
              <div>
                <div className="hpe-hud-label" style={{ fontSize: 9 }}>
                  Mitochondrial context
                </div>
                <p className="mt-2 text-sm leading-relaxed text-white/62">
                  Mitochondria help convert nutrients and oxygen into usable
                  cellular energy. Because hydrogen is involved in many of these
                  processes, deuterium concentration remains a research topic.
                </p>
              </div>

              <div className="relative mx-auto my-7 h-48 w-full max-w-sm">
                <motion.div
                  className="absolute inset-6 rounded-full border border-cyan-300/22"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div
                  className="absolute inset-14 rounded-full border border-amber-200/22"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
                />
                <div className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-300/[0.08]">
                  <Cpu className="text-cyan-200" size={28} />
                </div>
                {[18, 36, 58, 76].map((left, index) => (
                  <motion.span
                    key={left}
                    className="absolute top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-amber-200/30 bg-amber-200/[0.08]"
                    style={{ left: `${left}%` }}
                    animate={{ y: [0, -18, 0], scale: [0.86, 1.08, 0.86] }}
                    transition={{ duration: 2.5 + index * 0.3, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <span className="h-2 w-2 rounded-full bg-amber-200 shadow-[0_0_18px_rgba(229,194,90,0.9)]" />
                  </motion.span>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                {['Biological systems', 'Metabolism', 'Cellular energy'].map((label, index) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.68 + index * 0.08 }}
                    className="rounded-xl border border-white/10 bg-white/[0.035] p-3"
                  >
                    <div className="text-[10px] leading-tight text-white/58">{label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function IsotopeRow({
  label,
  value,
  weight,
  accent = false,
}: {
  label: string;
  value: string;
  weight: string;
  accent?: boolean;
}) {
  return (
    <div className={`rounded-2xl border p-4 ${accent ? 'border-amber-200/20 bg-amber-200/[0.05]' : 'border-cyan-300/20 bg-cyan-300/[0.045]'}`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <motion.div
            className={`flex h-12 w-12 items-center justify-center rounded-full border font-mono text-xl ${accent ? 'border-amber-200/30 text-amber-100' : 'border-cyan-300/30 text-cyan-100'}`}
            animate={{ scale: accent ? [1, 1.08, 1] : [1, 1.03, 1] }}
            transition={{ duration: accent ? 2.2 : 2.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            {value}
          </motion.div>
          <div>
            <h3 className="text-sm font-medium text-white">{label}</h3>
            <p className="mt-1 text-xs text-white/48">{weight}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResearchBeat({
  beat,
  index,
}: {
  beat: (typeof RESEARCH_BEATS)[number];
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.55, delay: index * 0.08 }}
      className="hpe-glass rounded-2xl p-5"
    >
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/[0.06]">
        <beat.icon size={18} className={index === 2 ? 'text-amber-200' : 'text-cyan-300'} />
      </div>
      <div className="hpe-hud-label mb-2" style={{ fontSize: 9 }}>
        {beat.signal}
      </div>
      <h2 className="text-lg font-medium text-white">{beat.title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-white/58">{beat.body}</p>
    </motion.article>
  );
}

function ResearchStoryStep({
  step,
  index,
}: {
  step: (typeof EDUCATION_FLOW)[number];
  index: number;
}) {
  const width = [92, 76, 52, 88][index];
  return (
    <motion.div
      initial={{ opacity: 0, x: 18 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-5 sm:ml-12"
    >
      <span className="absolute -left-[3.15rem] top-5 hidden h-10 w-10 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-300/[0.08] font-mono text-xs text-cyan-100 backdrop-blur sm:flex">
        {index + 1}
      </span>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_20%,rgba(63,184,255,0.10),transparent_34%)]" />
      <div className="relative grid gap-5 lg:grid-cols-[170px_1fr]">
        <div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.045] p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/25 bg-cyan-300/[0.08]">
              <Atom size={17} className={index === 2 ? 'text-amber-200' : 'text-cyan-200'} />
            </div>
            <motion.span
              className="h-3 w-3 rounded-full bg-cyan-200 shadow-[0_0_18px_rgba(63,184,255,0.9)]"
              animate={{ scale: [0.8, 1.25, 0.8], opacity: [0.55, 1, 0.55] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className={index === 2 ? 'h-full bg-amber-200/80' : 'h-full bg-cyan-300/80'}
              initial={{ width: 0 }}
              whileInView={{ width: `${width}%` }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="hpe-hud-label" style={{ fontSize: 8 }}>
              Signal
            </span>
            <span className="font-mono text-[10px] text-cyan-100/70">
              {index === 2 ? 'process' : 'science'}
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-white">{step.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-white/66">{step.body}</p>
        </div>
      </div>
    </motion.div>
  );
}

function ProcessSimulation() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(229,194,90,0.09),transparent_42%)]" />
      <div className="relative z-10 grid gap-3 sm:grid-cols-5">
        {PROCESS_STEPS.map((step, index) => (
          <ProcessNode key={step.label} step={step} index={index} />
        ))}
      </div>
    </div>
  );
}

function ProcessNode({
  step,
  index,
}: {
  step: { label: string; icon: LucideIcon };
  index: number;
}) {
  const Icon = step.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className="relative rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-center"
    >
      <motion.div
        className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-300/22 bg-cyan-300/[0.06]"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2.4 + index * 0.16, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Icon size={18} className={index === PROCESS_STEPS.length - 1 ? 'text-amber-200' : 'text-cyan-200'} />
      </motion.div>
      <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-100/55">
        Step {index + 1}
      </div>
      <h3 className="mt-2 text-sm font-medium text-white">{step.label}</h3>
    </motion.div>
  );
}
