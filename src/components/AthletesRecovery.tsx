import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Dumbbell, Droplets, Gauge, RefreshCw, Timer } from 'lucide-react';

const RECOVERY_FLOW = [
  {
    icon: Dumbbell,
    title: 'Training Load',
    body: 'Every sprint, lift, ride, run, match, and training session asks more from the body.',
  },
  {
    icon: Gauge,
    title: 'Energy Demand',
    body: 'Muscles work harder. Sweat increases. Energy demand rises.',
  },
  {
    icon: RefreshCw,
    title: 'Recovery Window',
    body: 'Recovery becomes just as important as performance in the quiet moments between sessions.',
  },
  {
    icon: Droplets,
    title: 'Daily Hydration Standard',
    body: 'Mdrn-Life DDW fits before training, during the day, and after a workout.',
  },
];

const ATHLETE_STORY = [
  {
    icon: Dumbbell,
    title: 'Performance demand',
    signal: 'load rises',
    meter: 86,
    body: [
      'Your body is built to move. To push. To adapt. To recover.',
      'Every sprint, lift, ride, run, match, and training session asks something from your body. Muscles work harder. Sweat increases. Energy demand rises. Recovery becomes just as important as performance.',
      'That is why serious athletes do not treat hydration as an afterthought.',
    ],
  },
  {
    icon: Droplets,
    title: 'Why Mdrn-Life fits',
    signal: '5 PPM standard',
    meter: 58,
    body: [
      'Mdrn-Life DDW was created for people who demand more from their daily routine. Produced to deuterium levels as low as 5 PPM, Mdrn-Life DDW offers a premium hydration experience for athletes, fitness enthusiasts, and high performers who pay attention to every detail.',
      'Mdrn-Life DDW is packaged in premium glass, contains no sugar, no artificial ingredients, and no unnecessary additives. Just advanced deuterium-depleted water made for those who want their hydration to match the level of discipline they bring to everything else.',
    ],
  },
  {
    icon: RefreshCw,
    title: 'Recovery rhythm',
    signal: 'repair window',
    meter: 72,
    body: [
      'Because performance is not built only in the gym.',
      'It is built in the quiet moments between training sessions.',
      'The morning after.',
      'The recovery window.',
      'The routine you repeat every day.',
    ],
  },
  {
    icon: Gauge,
    title: 'Daily standard',
    signal: 'routine repeats',
    meter: 94,
    body: [
      'Whether you are training for strength, endurance, recovery, focus, or long-term performance, Mdrn-Life DDW fits naturally into your routine.',
      'Drink it before training.',
      'Keep it close during your day.',
      'Use it after a workout.',
      'Make it part of the standard you refuse to lower.',
      'You already invest in your body.',
      'Now upgrade the water that supports the routine.',
    ],
  },
];

export function AthletesRecovery() {
  return (
    <section id="athletes-recovery" className="hpe-section relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center"
        >
          <div>
            <div className="hpe-hud-label mb-3">Athletes & Recovery</div>
            <h1 className="text-4xl sm:text-6xl font-medium tracking-tight leading-[1.03] text-white">
              Advanced hydration for performance-focused living.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/62 sm:text-lg">
              Hydration belongs inside the performance routine: before training,
              during demanding days, and through the recovery window.
            </p>
            <a href="/products" className="mt-8 hpe-btn-primary rounded-xl px-5 py-3 text-sm font-medium tracking-wide inline-flex items-center gap-2">
              Shop Performance Hydration
              <ArrowRight size={14} />
            </a>
          </div>

          <TrainingSimulation />
        </motion.div>

        <div className="mt-14 grid gap-4 md:grid-cols-4">
          {RECOVERY_FLOW.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-70px' }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              className="hpe-glass rounded-2xl p-5"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/[0.06]">
                <item.icon size={18} className="text-cyan-300" />
              </div>
              <div className="hpe-hud-label mb-2" style={{ fontSize: 9 }}>
                Step {index + 1}
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
              <div className="hpe-hud-label mb-3">Performance Story</div>
              <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-white">
                Training, recovery, routine, standard.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-white/56">
                Performance is built through repeated signals: training load,
                energy demand, recovery windows, and the standard you refuse to lower.
              </p>
            </div>
            <div className="relative space-y-4">
              <div className="absolute left-5 top-6 bottom-6 hidden w-px bg-cyan-300/20 sm:block" />
              {ATHLETE_STORY.map((group, index) => (
                <StorySimulationStep
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
          <div className="mt-8 rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.06] p-6">
            <div className="hpe-hud-label mb-3">Mdrn-Life DDW</div>
            <p className="text-2xl font-medium text-white">
              Advanced Hydration for Athletes, Recovery & Performance-Focused Living.
            </p>
            <p className="mt-3 text-white/65">Live Better. Longer.</p>
          </div>
        </motion.article>
      </div>
    </section>
  );
}

function StorySimulationStep({
  index,
  icon: Icon,
  title,
  signal,
  meter,
  body,
}: {
  index: number;
  icon: typeof Dumbbell;
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
      <span className="absolute -left-[3.15rem] top-5 hidden h-10 w-10 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-300/[0.08] font-mono text-xs text-cyan-100 backdrop-blur sm:flex">
        {index + 1}
      </span>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_20%,rgba(63,184,255,0.10),transparent_34%)]" />
      <div className="relative grid gap-5 lg:grid-cols-[170px_1fr]">
        <div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.045] p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/25 bg-cyan-300/[0.08]">
              <Icon size={17} className={index === 0 ? 'text-amber-200' : 'text-cyan-200'} />
            </div>
            <motion.span
              className="h-3 w-3 rounded-full bg-cyan-200 shadow-[0_0_18px_rgba(63,184,255,0.9)]"
              animate={{ scale: [0.8, 1.25, 0.8], opacity: [0.55, 1, 0.55] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className={index === 0 ? 'h-full bg-amber-200/80' : 'h-full bg-cyan-300/80'}
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
            <span className="font-mono text-[10px] text-cyan-100/70">{signal}</span>
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

function TrainingSimulation() {
  const phases = [
    {
      icon: Dumbbell,
      label: 'Before training',
      body: 'Prime the routine before the body asks for more.',
    },
    {
      icon: Gauge,
      label: 'During demand',
      body: 'Muscles work harder, sweat increases, energy demand rises.',
    },
    {
      icon: RefreshCw,
      label: 'Recovery window',
      body: 'Hydration belongs in the quiet moments between sessions.',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.08 }}
      className="hpe-glass relative min-h-[520px] overflow-hidden rounded-2xl p-6"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_32%,rgba(63,184,255,0.18),transparent_38%),radial-gradient(circle_at_82%_74%,rgba(229,194,90,0.11),transparent_32%)]" />
      <motion.div
        className="absolute left-0 right-0 top-[46%] h-px bg-gradient-to-r from-transparent via-cyan-200/45 to-transparent"
        animate={{ opacity: [0.25, 0.85, 0.25], scaleX: [0.78, 1, 0.78] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 flex min-h-[472px] flex-col">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="hpe-hud-label">Recovery Simulation</div>
            <h2 className="mt-2 text-2xl font-medium text-white">Training demand to recovery rhythm.</h2>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-300/25 bg-cyan-300/[0.07]">
            <Timer className="text-cyan-300" size={22} />
          </div>
        </div>

        <div className="mt-8 grid flex-1 gap-5 lg:grid-cols-[0.72fr_1fr]">
          <div className="grid gap-3">
            {phases.map((phase, index) => (
              <motion.div
                key={phase.label}
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: 0.18 + index * 0.1 }}
                className="rounded-2xl border border-white/10 bg-white/[0.035] p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/[0.06]">
                    <phase.icon size={17} className={index === 1 ? 'text-amber-200' : 'text-cyan-200'} />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white">{phase.label}</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-white/50">{phase.body}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.055] p-4">
              <div className="mb-3 flex items-center justify-between gap-4">
                <span className="hpe-hud-label" style={{ fontSize: 9 }}>
                  Demand curve
                </span>
                <span className="font-mono text-xs text-cyan-100/70">train -&gt; recover</span>
              </div>
              <div className="flex h-24 items-end gap-2">
                {[38, 64, 88, 72, 48, 30].map((height, index) => (
                  <motion.span
                    key={height}
                    className={`flex-1 rounded-t-lg ${index < 3 ? 'bg-amber-200/70' : 'bg-cyan-300/70'}`}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 0.65, delay: 0.4 + index * 0.08 }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="relative min-h-[310px] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(63,184,255,0.17),transparent_42%)]" />

            <div className="relative z-10 flex h-full flex-col justify-between">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="hpe-hud-label" style={{ fontSize: 9 }}>
                    Cellular recovery window
                  </div>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/62">
                    Mdrn-Life DDW is positioned as the hydration standard that fits
                    before training, during the day, and after workout stress.
                  </p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-300/[0.08]">
                  <Droplets className="text-cyan-200" size={22} />
                </div>
              </div>

              <div className="relative mx-auto my-6 h-40 w-full max-w-sm">
                {[0, 1, 2, 3].map((line) => (
                  <motion.div
                    key={line}
                    className="absolute left-4 right-4 h-3 rounded-full bg-gradient-to-r from-cyan-300/20 via-cyan-100/70 to-amber-200/35"
                    style={{ top: `${18 + line * 24}%` }}
                    animate={{ x: [0, 10, 0], opacity: [0.52, 0.95, 0.52] }}
                    transition={{ duration: 2.8 + line * 0.25, repeat: Infinity, ease: 'easeInOut' }}
                  />
                ))}

                {[18, 36, 58, 74].map((left, index) => (
                  <motion.span
                    key={left}
                    className="absolute top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-cyan-200/35 bg-cyan-300/[0.09]"
                    style={{ left: `${left}%` }}
                    animate={{ y: [0, -16, 0], scale: [0.88, 1.08, 0.88] }}
                    transition={{ duration: 2.4 + index * 0.28, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <span className="h-2 w-2 rounded-full bg-cyan-200 shadow-[0_0_18px_rgba(63,184,255,0.9)]" />
                  </motion.span>
                ))}

                <motion.div
                  className="absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-200/50 to-transparent"
                  animate={{ opacity: [0.2, 0.7, 0.2] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  ['Before', 'Drink it before training'],
                  ['During', 'Keep it close'],
                  ['After', 'Use it after workout'],
                ].map(([label, body], index) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.62 + index * 0.08 }}
                    className="rounded-xl border border-white/10 bg-white/[0.035] p-3"
                  >
                    <div className="font-mono text-xs text-cyan-100">{label}</div>
                    <div className="mt-1 text-[10px] leading-tight text-white/48">{body}</div>
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
