import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Brain, FlaskConical, Heart, Leaf, Microscope, Zap } from 'lucide-react';

const ARTICLES = [
  {
    slug: 'deuterium-mitochondria',
    title: 'Deuterium and Mitochondria',
    category: 'Cellular Science',
    icon: Microscope,
    intro: 'Researchers have long studied the role of hydrogen isotopes in cellular energy production. Deuterium — the heavier isotope of hydrogen — occurs naturally in water and plays a measurable role in the function of the mitochondrial nanomotor.',
    keyPoints: [
      'Natural water contains approximately 145–155 ppm deuterium',
      'ATP Synthase rotor function is a focus of deuterium research',
      'Mdrn-Life DDW is verified at 5 ppm via IRMS',
      'Scientific interest in this field continues to grow',
    ],
    sections: [
      {
        heading: 'What Is Deuterium?',
        body: 'Hydrogen exists in two stable forms: protium (standard hydrogen, mass 1) and deuterium (heavy hydrogen, mass 2). Ordinary drinking water contains approximately 145–155 parts per million deuterium, which varies slightly by geography and source. Deuterium-depleted water (DDW) is produced through a fractional distillation process that reduces this concentration — Mdrn-Life DDW is produced to 5 ppm.',
      },
      {
        heading: 'The Mitochondrial Connection',
        body: 'Mitochondria produce ATP through a structure called ATP Synthase, which operates via a rapidly spinning rotor driven by hydrogen ions. Scientific interest has focused on whether the lighter mass of standard hydrogen (protium) versus deuterium affects the efficiency of this rotor mechanism. Researchers study how hydrogen isotope composition in water may influence cellular energy metabolism.',
      },
      {
        heading: 'What the Research Explores',
        body: 'A growing body of peer-reviewed literature explores the relationship between deuterium concentration and biological systems. Scientists study whether lower deuterium levels may support mitochondrial efficiency, particularly in high-demand tissues like muscle, brain, and heart. This area of research remains active and evolving.',
      },
      {
        heading: 'Why 5 ppm Specifically',
        body: 'Most DDW products are produced at concentrations between 25–125 ppm. Mdrn-Life DDW is produced to 5 ppm — among the most depleted concentrations commercially available. Each batch is verified by Isotope Ratio Mass Spectrometry (IRMS) through independent laboratories to confirm this standard.',
      },
    ],
  },
  {
    slug: 'hydration-recovery',
    title: 'Hydration and Recovery',
    category: 'Performance',
    icon: Zap,
    intro: 'Physical training places significant demands on the body\'s cellular systems. Recovery — the process by which the body repairs and restores — depends fundamentally on cellular hydration status and the quality of water available at the cellular level.',
    keyPoints: [
      'Cellular hydration is central to post-exercise recovery',
      'Mitochondria play a critical role in energy restoration',
      'DDW may support cellular energy systems during recovery',
      'Consistent hydration protocols support long-term performance',
    ],
    sections: [
      {
        heading: 'Cellular Hydration and Exercise',
        body: 'During physical activity, cells experience increased metabolic demand, heat stress, and oxidative challenge. Hydration at the cellular level supports the transport of nutrients, removal of metabolic byproducts, and maintenance of electrolyte balance. Research consistently shows that even mild dehydration can impair performance and delay recovery.',
      },
      {
        heading: 'The Recovery Window',
        body: 'The post-exercise period is a time of heightened cellular activity. Muscles are synthesizing protein, the liver is processing metabolic waste, and the cardiovascular system is normalizing. Optimal hydration during this window may support the efficiency of these processes.',
      },
      {
        heading: 'What Makes DDW Different',
        body: 'Deuterium-depleted water operates on the principle that the hydrogen isotope composition of water may influence mitochondrial function. Since mitochondria are central to energy recovery after exercise, researchers study whether DDW may support the cellular energy systems involved in recovery. Mdrn-Life DDW is independently verified at 5 ppm.',
      },
      {
        heading: 'Building a Recovery Protocol',
        body: 'Many athletes incorporate DDW as part of a structured hydration protocol. Common approaches include pre-workout DDW to support cellular hydration before training begins, intra-workout intake to maintain hydration levels, and post-workout DDW to support the recovery process. Individual needs vary based on body weight, training intensity, and environment.',
      },
    ],
  },
  {
    slug: 'hydration-brain-function',
    title: 'Hydration and Brain Function',
    category: 'Cognitive Health',
    icon: Brain,
    intro: 'The brain is approximately 75% water by mass and represents one of the most metabolically active organs in the body. Cognitive performance, mental clarity, and neurological function are closely tied to hydration status at the cellular level.',
    keyPoints: [
      'The brain is approximately 75% water by mass',
      'Dehydration affects cognitive performance and working memory',
      'The brain uses approximately 20% of total body energy output',
      'Cellular hydration quality may support neurological function',
    ],
    sections: [
      {
        heading: 'The Brain and Water',
        body: 'Neurons require consistent hydration to maintain electrical potential, transmit signals, and manage the metabolic demands of cognitive activity. Cerebrospinal fluid — which cushions and nourishes the brain — is primarily water. Research shows that dehydration of even 1–2% of body weight can noticeably affect cognitive performance, attention, and working memory.',
      },
      {
        heading: 'Energy Demands of the Brain',
        body: 'Despite representing only about 2% of body weight, the brain consumes approximately 20% of the body\'s total energy output. This energy is produced almost entirely by mitochondria. Researchers study how the quality and composition of cellular hydration may influence mitochondrial efficiency in brain tissue.',
      },
      {
        heading: 'DDW and Cognitive Hydration',
        body: 'Deuterium-depleted water may support cognitive function through its potential influence on mitochondrial energy production. Scientific interest in the relationship between deuterium concentration and brain tissue function continues to grow. Mdrn-Life DDW provides a precisely verified 5 ppm hydration source for those who take cognitive performance seriously.',
      },
      {
        heading: 'Practical Application',
        body: 'Incorporating DDW into a morning hydration routine is a common approach for those focused on cognitive performance. Beginning the day with DDW before consuming caffeine or food may support baseline cellular hydration. Consistent hydration throughout the day supports ongoing cognitive and neurological function.',
      },
    ],
  },
  {
    slug: 'hydration-gut-health',
    title: 'Hydration and Gut Health',
    category: 'Digestive Wellness',
    icon: Leaf,
    intro: 'The gut is home to trillions of microorganisms and serves as a critical interface between the outside world and the body\'s internal systems. Hydration plays a fundamental role in gut function, mucosal integrity, and the environment in which the microbiome operates.',
    keyPoints: [
      'The gut mucosal lining is water-dense and requires consistent hydration',
      'Gut microbiome health is influenced by the gut environment',
      'Water absorption begins immediately throughout the digestive tract',
      'Hydration quality is a component of gut health protocols',
    ],
    sections: [
      {
        heading: 'Water and the Gut Lining',
        body: 'The mucosal lining of the digestive tract is a water-dense structure that protects the gut wall, facilitates nutrient absorption, and forms a barrier between the gut environment and the bloodstream. Adequate cellular hydration supports the integrity and function of this lining. Dehydration can impair mucous production and compromise mucosal barrier function.',
      },
      {
        heading: 'The Gut Microbiome Connection',
        body: 'The gut microbiome — the complex ecosystem of bacteria and other microorganisms in the digestive tract — is directly influenced by the gut environment. Hydration status affects the pH balance, osmotic conditions, and overall environment of the gut. Research explores how hydration quality and composition may influence microbiome diversity and stability.',
      },
      {
        heading: 'Absorption and Cellular Uptake',
        body: 'Water absorption begins in the mouth and continues throughout the digestive tract. The small intestine absorbs the majority of water consumed, delivering it to the bloodstream and from there to cells throughout the body. The composition of consumed water — including its isotope profile — reaches cellular systems through this pathway.',
      },
      {
        heading: 'DDW and Digestive Support',
        body: 'Mdrn-Life DDW may support gut health as part of a consistent hydration protocol. The 5 ppm deuterium concentration is precisely verified, ensuring a consistent hydration source. Those focused on gut health and microbiome balance often prioritize water quality as one component of a broader wellness approach.',
      },
    ],
  },
  {
    slug: 'hydration-healthy-aging',
    title: 'Hydration and Healthy Aging',
    category: 'Longevity',
    icon: Heart,
    intro: 'Aging is a complex biological process influenced by genetics, lifestyle, and environment. At the cellular level, aging is associated with declining mitochondrial efficiency, increasing oxidative challenge, and changes in cellular hydration. Research into the relationship between water quality and longevity is an active area of scientific inquiry.',
    keyPoints: [
      'Mitochondrial efficiency declines with age',
      'Oxidative balance is central to cellular aging processes',
      'Research explores deuterium\'s role in longevity models',
      'Consistent hydration quality supports long-term cellular health',
    ],
    sections: [
      {
        heading: 'Cellular Aging and Hydration',
        body: 'As cells age, their ability to maintain optimal hydration and manage oxidative stress declines. Mitochondrial function — central to cellular energy production — is particularly susceptible to age-related changes. Researchers study how environmental factors, including the quality of cellular hydration, may influence the pace and expression of cellular aging processes.',
      },
      {
        heading: 'The Deuterium-Aging Connection',
        body: 'Scientific interest in deuterium\'s role in aging stems partly from research on organisms raised on deuterium-depleted water, which demonstrated altered lifespan outcomes in some model studies. While human research in this area is ongoing, researchers explore whether lower deuterium exposure may support the cellular systems associated with healthy aging.',
      },
      {
        heading: 'Oxidative Balance and Cellular Health',
        body: 'Oxidative stress — the imbalance between reactive oxygen species production and the body\'s antioxidant defenses — is closely linked to cellular aging. Mitochondria are both a primary source of reactive oxygen species and a target of oxidative damage. Researchers study how mitochondrial efficiency, potentially influenced by hydrogen isotope composition, may relate to oxidative balance.',
      },
      {
        heading: 'A Long-Term Approach',
        body: 'Healthy aging is built on consistent, compounding lifestyle decisions. Incorporating high-quality, precisely verified DDW into a daily hydration routine is one approach favored by those focused on longevity. Mdrn-Life DDW is produced to 5 ppm and independently verified by IRMS — a level of transparency aligned with the standards of the longevity community.',
      },
    ],
  },
  {
    slug: 'cellular-energy-performance',
    title: 'Cellular Energy and Performance',
    category: 'Performance Science',
    icon: FlaskConical,
    intro: 'Every movement, thought, and biological process depends on ATP — the universal energy currency produced by mitochondria in every cell. Understanding how cellular energy production works, and what factors may influence it, is central to performance science.',
    keyPoints: [
      'ATP Synthase is the molecular machine behind cellular energy production',
      'Deuterium is 100% heavier than standard hydrogen (protium)',
      'Researchers study whether isotope composition affects ATP Synthase efficiency',
      'IRMS verification confirms every production batch at 5 ppm',
    ],
    sections: [
      {
        heading: 'ATP and the Mitochondrial Rotor',
        body: 'Adenosine triphosphate (ATP) is synthesized by ATP Synthase, a molecular machine embedded in the inner mitochondrial membrane. This enzyme operates through a spinning rotor driven by the flow of hydrogen ions across the membrane. Scientists study how the mass of hydrogen isotopes — protium versus deuterium — may influence the efficiency of this rotor mechanism.',
      },
      {
        heading: 'The Hydrogen Isotope Factor',
        body: 'Deuterium (mass 2) is twice the mass of standard hydrogen (protium, mass 1). This mass difference is proportionally larger than any other stable isotope pair. Researchers study whether this mass difference has functional significance at the scale of molecular machines like ATP Synthase, where atomic-level interactions drive biological processes.',
      },
      {
        heading: 'Performance Applications',
        body: 'Athletes, biohackers, and performance-focused individuals have shown increasing interest in DDW as part of comprehensive performance protocols. The premise is that supporting mitochondrial efficiency through water lower in deuterium may contribute to better cellular energy availability during high-demand activities. Mdrn-Life DDW provides the 5 ppm standard for those pursuing this approach.',
      },
      {
        heading: 'Measuring What Matters',
        body: 'Mdrn-Life DDW is verified through Isotope Ratio Mass Spectrometry (IRMS) — the same technology used by research laboratories to measure stable isotope ratios. This verification method confirms the deuterium concentration with scientific precision. Batch results are documented and available on the lab testing page for full transparency.',
      },
    ],
  },
];

type Article = typeof ARTICLES[number];
type Props = { slug?: string };

export function LearnPage({ slug }: Props) {
  if (slug) {
    const article = ARTICLES.find((a) => a.slug === slug);
    if (!article) return <LearnIndex />;
    return <ArticlePage article={article} />;
  }
  return <LearnIndex />;
}

function LearnIndex() {
  return (
    <section className="hpe-section relative min-h-screen overflow-hidden pt-32">
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <div className="hpe-hud-label">Learn</div>
          <h1 className="mt-4 text-4xl font-medium tracking-tight text-white sm:text-6xl">
            The science behind DDW, explained.
          </h1>
          <p className="mt-5 text-base leading-relaxed text-white/62 sm:text-lg">
            Educational articles on deuterium, cellular hydration, mitochondrial science,
            and the research behind Mdrn-Life DDW.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ARTICLES.map((article, i) => (
            <motion.a
              key={article.slug}
              href={`/learn/${article.slug}`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.07 }}
              whileHover={{ y: -5 }}
              className="group hpe-glass rounded-2xl p-6 flex flex-col"
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/[0.07] text-cyan-200 transition group-hover:text-white">
                  <article.icon size={16} />
                </span>
                <div className="hpe-hud-label" style={{ fontSize: 9 }}>{article.category}</div>
              </div>
              <h2 className="text-lg font-medium text-white">{article.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-white/55 line-clamp-3">
                {article.intro}
              </p>
              <div className="mt-5 flex items-center gap-2 text-xs text-cyan-200/70 transition group-hover:text-cyan-200">
                Read article <ArrowRight size={11} />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArticlePage({ article }: { article: Article }) {
  return (
    <section className="hpe-section relative min-h-screen overflow-hidden pt-32">
      <div className="relative z-10 mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <a
            href="/learn"
            className="mb-8 inline-flex items-center gap-2 text-xs text-white/50 hover:text-white/80 transition"
          >
            <ArrowLeft size={12} />
            Back to Learn
          </a>
          <div className="mb-3 mt-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/[0.07] text-cyan-200">
              <article.icon size={16} />
            </span>
            <div className="hpe-hud-label">{article.category}</div>
          </div>
          <h1 className="mt-2 text-4xl font-medium tracking-tight text-white sm:text-5xl">
            {article.title}
          </h1>
          <p className="mt-5 text-base leading-relaxed text-white/70 sm:text-lg">
            {article.intro}
          </p>
        </motion.div>

        <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
          <div className="hpe-hud-label mb-3">Key Points</div>
          <ul className="space-y-2">
            {article.keyPoints.map((point) => (
              <li key={point} className="flex items-start gap-2.5 text-sm text-white/70">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 space-y-8">
          {article.sections.map((section, i) => (
            <motion.div
              key={section.heading}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: i * 0.06 }}
            >
              <h2 className="text-xl font-medium text-white sm:text-2xl">{section.heading}</h2>
              <p className="mt-3 text-base leading-relaxed text-white/62">{section.body}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
          className="mt-14 rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.04] p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <div className="hpe-hud-label mb-2">Ready to explore further?</div>
            <h3 className="text-xl font-medium text-white">Shop 5 PPM Verified DDW</h3>
            <p className="mt-2 text-sm text-white/55">
              Every batch independently tested and IRMS-verified. Glass and PET options available.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="/science/lab-testing"
              className="hpe-btn-ghost inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium tracking-wide shrink-0"
            >
              Lab Testing
            </a>
            <a
              href="/products"
              className="hpe-btn-primary inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium tracking-wide shrink-0"
            >
              Shop DDW
              <ArrowRight size={13} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
