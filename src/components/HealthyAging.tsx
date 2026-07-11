import { motion } from 'framer-motion';
import { ArrowRight, CalendarDays, Droplets, Leaf, Moon, ShieldCheck, Sparkles, SunMedium } from 'lucide-react';

const LIFESTYLE_BEATS = [
  { icon: SunMedium, title: 'Morning', body: 'A bottle in the morning.' },
  { icon: Leaf, title: 'Daily Choices', body: 'Food, sleep, movement, stress, and water shape the routine.' },
  { icon: Droplets, title: 'Premium Hydration', body: '5 PPM DDW for longevity-focused daily vitality.' },
  { icon: Moon, title: 'Long Term', body: 'Your future is built today, one better choice at a time.' },
];

const HEALTHY_AGING_STORY = [
  {
    icon: SunMedium,
    title: 'Daily choices',
    signal: 'daily inputs',
    meter: 64,
    body: [
      'Aging is not just about time.',
      'It is about how you live each day.',
      'The food you choose. The sleep you protect. The movement you commit to. The stress you manage. The water you drink.',
    ],
  },
  {
    icon: Leaf,
    title: 'Intentional wellness',
    signal: 'quality filter',
    meter: 78,
    body: [
      'Modern wellness is changing. People are no longer waiting until something feels wrong to care about their bodies. They are becoming more intentional earlier. They are asking better questions. They are looking deeper.',
      'Mdrn-Life DDW was created for that kind of person.',
      'The person who reads labels.',
      'The person who invests in quality.',
      'The person who understands that small daily habits can shape the way they feel, perform, and live.',
    ],
  },
  {
    icon: Droplets,
    title: '5 PPM hydration standard',
    signal: '150 -> 5 PPM',
    meter: 92,
    body: [
      'Most water contains naturally occurring deuterium at approximately 150-155 PPM. Mdrn-Life DDW is produced through an advanced process designed to reduce deuterium levels to as low as 5 PPM, creating a premium hydration experience for people focused on longevity, wellness, and daily vitality.',
      'This is not ordinary bottled water.',
      'This is hydration designed for people who think long term.',
      'Mdrn-Life DDW is bottled in premium glass, made without sugars, flavors, preservatives, or artificial ingredients, and crafted for those who want a cleaner, more intentional approach to daily hydration.',
    ],
  },
  {
    icon: Moon,
    title: 'Routine that compounds',
    signal: 'long-term rhythm',
    meter: 86,
    body: [
      'Healthy aging is not one decision.',
      'It is a lifestyle.',
      'A bottle in the morning.',
      'A better choice at lunch.',
      'A routine that reminds you that your future is built today.',
      'Mdrn-Life DDW belongs in that routine.',
      'Because when you care deeply about how you age, every detail matters.',
    ],
  },
];

export function HealthyAging() {
  return (
    <section id="healthy-aging" className="hpe-section relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center"
        >
          <div>
            <div className="hpe-hud-label mb-3" style={{ color: '#F0D27A' }}>
              Healthy Aging
            </div>
            <h1 className="text-4xl sm:text-6xl font-medium tracking-tight leading-[1.03] text-white">
              Premium DDW for longevity-focused living.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/62 sm:text-lg">
              Healthy aging is a daily system: labels, quality, cleaner
              ingredients, and a routine that compounds over time.
            </p>
            <a href="/products" className="mt-8 hpe-btn-primary rounded-xl px-5 py-3 text-sm font-medium tracking-wide inline-flex items-center gap-2">
              Shop Mdrn-Life DDW
              <ArrowRight size={14} />
            </a>
          </div>

          <LongevitySimulation />
        </motion.div>

        <div className="mt-14 grid gap-4 md:grid-cols-4">
          {LIFESTYLE_BEATS.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-70px' }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              className="hpe-glass rounded-2xl p-5"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-amber-200/20 bg-amber-200/[0.06]">
                <item.icon size={18} className="text-amber-200" />
              </div>
              <div className="hpe-hud-label mb-2" style={{ color: '#F0D27A', fontSize: 9 }}>
                Lifestyle
              </div>
              <h2 className="text-lg font-medium text-white">{item.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/58">{item.body}</p>
            </motion.article>
          ))}
        </div>

        <motion.article
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-70px' }}
          transition={{ duration: 0.65 }}
          className="mt-8 hpe-glass rounded-2xl p-6 sm:p-8"
        >
          <div className="grid gap-8 lg:grid-cols-[0.34fr_0.66fr] lg:items-start">
            <div>
              <div className="hpe-hud-label mb-3" style={{ color: '#F0D27A' }}>
                Longevity Story
              </div>
              <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-white">
                Small decisions, long-term intent.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-white/56">
                Long-term wellness is shaped through daily choices, intentional
                standards, 5 PPM hydration, and routines that keep repeating.
              </p>
            </div>
            <div className="relative space-y-4">
              <div className="absolute left-5 top-6 bottom-6 hidden w-px bg-amber-200/20 sm:block" />
              {HEALTHY_AGING_STORY.map((group, index) => (
                <LongevityStoryStep
                  key={group.title}
                  index={index}
                  icon={group.icon}
                  title={group.title}
                  signal={group.signal}
                  meter={group.meter}
                  body={group.body}
                />
              ))}
            </div>
          </div>
          <div className="mt-8 rounded-2xl border border-amber-200/20 bg-amber-200/[0.06] p-6">
            <div className="hpe-hud-label mb-3" style={{ color: '#F0D27A' }}>
              Mdrn-Life DDW
            </div>
            <p className="text-2xl font-medium text-white">
              Premium Deuterium-Depleted Water for Longevity-Focused Living.
            </p>
            <p className="mt-3 text-white/65">Live Better. Longer.</p>
          </div>
        </motion.article>
      </div>
    </section>
  );
}

function LongevityStoryStep({
  index,
  icon: Icon,
  title,
  signal,
  meter,
  body,
}: {
  index: number;
  icon: typeof SunMedium;
  title: string;
  signal: string;
  meter: number;
  body: string[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 18 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-5 sm:ml-12"
    >
      <span className="absolute -left-[3.15rem] top-5 hidden h-10 w-10 items-center justify-center rounded-full border border-amber-200/30 bg-amber-200/[0.08] font-mono text-xs text-amber-100 backdrop-blur sm:flex">
        {index + 1}
      </span>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_20%,rgba(229,194,90,0.10),transparent_34%)]" />
      <div className="relative grid gap-5 lg:grid-cols-[170px_1fr]">
        <div className="rounded-2xl border border-amber-200/15 bg-amber-200/[0.045] p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-200/25 bg-amber-200/[0.08]">
              <Icon size={17} className={index === 0 ? 'text-cyan-200' : 'text-amber-200'} />
            </div>
            <motion.span
              className="h-3 w-3 rounded-full bg-amber-200 shadow-[0_0_18px_rgba(229,194,90,0.9)]"
              animate={{ scale: [0.8, 1.25, 0.8], opacity: [0.55, 1, 0.55] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className={index === 0 ? 'h-full bg-cyan-200/80' : 'h-full bg-amber-200/80'}
              initial={{ width: 0 }}
              whileInView={{ width: `${meter}%` }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="hpe-hud-label" style={{ fontSize: 8 }}>
              Signal
            </span>
            <span className="font-mono text-[10px] text-amber-100/70">{signal}</span>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-white">{title}</h3>
          <div className="mt-3 space-y-2.5 text-sm leading-relaxed text-white/66">
            {body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function LongevitySimulation() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.08 }}
      className="hpe-glass relative min-h-[420px] overflow-hidden rounded-2xl p-6"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(229,194,90,0.14),transparent_44%)]" />
      <div className="relative z-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="hpe-hud-label" style={{ color: '#F0D27A' }}>
              Longevity Simulation
            </div>
            <h2 className="mt-2 text-2xl font-medium text-white">A daily routine that compounds.</h2>
          </div>
          <CalendarDays className="text-amber-200" size={28} />
        </div>

        <div className="relative mx-auto mt-10 flex h-64 max-w-md items-center justify-center">
          <motion.div
            className="absolute h-56 w-56 rounded-full border border-amber-200/20"
            animate={{ rotate: 360 }}
            transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute h-40 w-40 rounded-full border border-cyan-200/20"
            animate={{ rotate: -360 }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="flex h-28 w-28 items-center justify-center rounded-full border border-amber-200/35 bg-amber-200/[0.08] text-center shadow-[0_0_50px_-18px_rgba(229,194,90,0.9)]"
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div>
              <Sparkles className="mx-auto text-amber-200" size={18} />
              <div className="mt-2 font-mono text-2xl text-white">5</div>
              <div className="hpe-hud-label" style={{ color: '#F0D27A', fontSize: 8 }}>
                PPM DDW
              </div>
            </div>
          </motion.div>
          {[ShieldCheck, Leaf, Droplets, Moon].map((Icon, index) => {
            const positions = [
              'left-5 top-9',
              'right-5 top-9',
              'left-5 bottom-9',
              'right-5 bottom-9',
            ];
            return (
              <motion.div
                key={index}
                className={`absolute ${positions[index]} flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05]`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.3 + index * 0.1 }}
              >
                <Icon size={18} className={index % 2 === 0 ? 'text-cyan-200' : 'text-amber-200'} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
