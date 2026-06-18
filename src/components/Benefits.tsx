import { motion } from 'framer-motion';
import {
  ArrowRight,
  Brain,
  Dumbbell,
  Droplets,
  FlaskConical,
  GlassWater,
  Leaf,
  type LucideIcon,
  ShieldCheck,
  Timer,
} from 'lucide-react';

const BENEFIT_REASONS = [
  {
    icon: Droplets,
    title: 'Advanced Hydration',
    signal: '5 PPM',
    body: 'Produced to deuterium levels as low as 5 PPM, Mdrn-Life DDW offers a premium hydration experience for people seeking a higher standard of daily water consumption.',
  },
  {
    icon: Dumbbell,
    title: 'Performance & Recovery Focused',
    signal: 'routine',
    body: 'Athletes, active individuals, and wellness enthusiasts often prioritize hydration as part of their training, recovery, and performance routines.',
  },
  {
    icon: Brain,
    title: 'Wellness-Conscious Living',
    signal: 'lifestyle',
    body: 'Many customers incorporate Mdrn-Life DDW into broader wellness practices that include exercise, nutrition, sleep, mindfulness, and healthy lifestyle habits.',
  },
  {
    icon: Timer,
    title: 'Healthy Aging Mindset',
    signal: 'daily habit',
    body: 'People focused on longevity understand that daily habits matter. Hydration is one of the most fundamental habits of all.',
  },
  {
    icon: FlaskConical,
    title: 'Independently Tested',
    signal: 'verified',
    body: 'Quality and transparency are central to our mission. Independent testing helps verify our production standards and commitment to consistency.',
  },
  {
    icon: Leaf,
    title: 'Clean & Pure',
    signal: 'no additives',
    body: 'No sugars. No artificial ingredients. No preservatives. No unnecessary additives. Just premium deuterium-depleted water.',
  },
  {
    icon: GlassWater,
    title: 'Premium Glass Bottles',
    signal: 'glass',
    body: 'Our glass packaging helps preserve purity and provides a premium drinking experience without direct plastic contact with the water.',
  },
];

const HABIT_STACK = [
  'Every cell',
  'Every tissue',
  'Every system',
  'Every day',
];

const ORBIT_ITEMS: { Icon: LucideIcon; label: string; position: string }[] = [
  { Icon: Dumbbell, label: 'Recovery', position: 'left-2 top-10' },
  { Icon: Brain, label: 'Wellness', position: 'right-2 top-10' },
  { Icon: FlaskConical, label: 'Tested', position: 'left-5 bottom-10' },
  { Icon: Leaf, label: 'Clean', position: 'right-5 bottom-10' },
];

export function Benefits() {
  return (
    <section id="benefits" className="hpe-section relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center"
        >
          <div>
            <div className="hpe-hud-label mb-3" style={{ color: '#F0D27A' }}>
              Benefits
            </div>
            <h1 className="text-4xl sm:text-6xl font-medium tracking-tight leading-[1.03] text-white">
              Why people choose Mdrn-Life DDW.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/62 sm:text-lg">
              Hydration is one of the few things your body depends on every
              single day. The water you drink becomes part of every cell, every
              tissue, and every system in your body.
            </p>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/62">
              That is why more people are becoming intentional about the quality
              of their hydration. Mdrn-Life DDW was created for individuals who
              refuse to settle for ordinary.
            </p>
            <a href="/products" className="mt-8 hpe-btn-primary rounded-xl px-5 py-3 text-sm font-medium tracking-wide inline-flex items-center gap-2">
              Choose 5 PPM DDW
              <ArrowRight size={14} />
            </a>
          </div>

          <BenefitsSimulation />
        </motion.div>

        <div className="mt-14 grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-70px' }}
            transition={{ duration: 0.6 }}
            className="hpe-glass rounded-2xl p-6 sm:p-8"
          >
            <div className="hpe-hud-label mb-3" style={{ color: '#F0D27A' }}>
              Daily Dependence
            </div>
            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-white">
              Hydration becomes the baseline habit.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              Live Better. Longer. Because when you pay attention to the details
              that others overlook, small choices can become meaningful habits.
            </p>
            <div className="mt-8 grid gap-3">
              {HABIT_STACK.map((label, index) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.42, delay: index * 0.08 }}
                  className="rounded-xl border border-amber-200/15 bg-amber-200/[0.045] p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-medium text-white">{label}</span>
                    <span className="font-mono text-xs text-amber-100/70">hydration input</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.article>

          <div className="grid gap-4 md:grid-cols-2">
            {BENEFIT_REASONS.map((benefit, index) => (
              <BenefitReason key={benefit.title} benefit={benefit} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function BenefitsSimulation() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.08 }}
      className="hpe-glass relative min-h-[480px] overflow-hidden rounded-2xl p-6"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(229,194,90,0.15),transparent_38%),radial-gradient(circle_at_78%_72%,rgba(63,184,255,0.14),transparent_34%)]" />
      <div className="relative z-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="hpe-hud-label" style={{ color: '#F0D27A' }}>
              Hydration Choice System
            </div>
            <h2 className="mt-2 text-2xl font-medium text-white">One daily input, many routines.</h2>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-amber-200/25 bg-amber-200/[0.07]">
            <ShieldCheck className="text-amber-200" size={22} />
          </div>
        </div>

        <div className="relative mx-auto mt-10 flex h-72 max-w-lg items-center justify-center">
          <motion.div
            className="absolute h-64 w-64 rounded-full border border-amber-200/20"
            animate={{ rotate: 360 }}
            transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute h-44 w-44 rounded-full border border-cyan-200/20"
            animate={{ rotate: -360 }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="flex h-32 w-32 items-center justify-center rounded-full border border-cyan-200/35 bg-cyan-300/[0.08] text-center shadow-[0_0_60px_-20px_rgba(63,184,255,0.95)]"
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div>
              <Droplets className="mx-auto text-cyan-200" size={22} />
              <div className="mt-2 font-mono text-2xl text-white">5</div>
              <div className="hpe-hud-label" style={{ fontSize: 8 }}>
                PPM DDW
              </div>
            </div>
          </motion.div>

          {ORBIT_ITEMS.map(({ Icon, label, position }, index) => (
            <motion.div
              key={label}
              className={`absolute ${position} rounded-xl border border-white/10 bg-white/[0.05] p-3 text-center`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.28 + index * 0.1 }}
            >
              <Icon size={17} className="mx-auto text-amber-200" />
              <div className="mt-1 font-mono text-[10px] text-white/68">{label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          {['No sugars', 'No artificial ingredients', 'No preservatives'].map((label, index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.65 + index * 0.08 }}
              className="rounded-xl border border-white/10 bg-white/[0.035] p-3"
            >
              <div className="text-[11px] font-medium text-white/72">{label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function BenefitReason({
  benefit,
  index,
}: {
  benefit: (typeof BENEFIT_REASONS)[number];
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="hpe-glass relative overflow-hidden rounded-2xl p-5"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(229,194,90,0.09),transparent_34%)]" />
      <div className="relative">
        <div className="flex items-center justify-between gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-200/20 bg-amber-200/[0.06]">
            <benefit.icon size={18} className="text-amber-200" />
          </div>
          <span className="font-mono text-[10px] text-cyan-100/65">{benefit.signal}</span>
        </div>
        <h3 className="mt-5 text-lg font-medium text-white">{benefit.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-white/58">{benefit.body}</p>
      </div>
    </motion.article>
  );
}
