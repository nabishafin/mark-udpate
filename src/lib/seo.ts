export type SeoConfig = {
  title: string;
  description: string;
  canonical: string;
  keywords?: string;
  ogTitle: string;
  ogDescription: string;
  ogUrl: string;
  ogType: 'website' | 'article' | 'product';
  twitterTitle: string;
  twitterDescription: string;
  image?: string;
  schema?: Record<string, unknown>[];
};

const siteUrl = 'https://mdrnlifeddw.com';
const socialImage = `${siteUrl}/products/mdrn-life-ddw-glass.webp`;

export const LAB_FAQS = [
  {
    q: 'Is deuterium depleted water the same as hydrogen water?',
    a: 'No. Hydrogen water is regular water infused with dissolved molecular hydrogen (H2). It does not reduce deuterium content. Deuterium-depleted water (DDW) is processed to remove the heavy hydrogen isotope, reducing concentration from ~150 ppm to as low as 5 ppm using vacuum rectification distillation.',
  },
  {
    q: 'How do I know my DDW is actually 5 ppm?',
    a: 'Every batch of Mdrn-Life DDW is tested by Hydroisotop GmbH (Germany) and the USGS Reston Stable Isotope Lab (USA) using Isotope Ratio Mass Spectrometry (IRMS). Downloadable lab reports are available on this page.',
  },
  {
    q: 'What labs test deuterium levels in water?',
    a: "Deuterium is measured using IRMS at specialized stable isotope labs. Mdrn-Life DDW uses Hydroisotop GmbH (Germany) and the USGS Reston Stable Isotope Lab (USA), two of the world's most credible isotope analysis institutions.",
  },
  {
    q: 'Where can I buy independently tested deuterium depleted water?',
    a: 'Mdrn-Life DDW is available at mdrnlifeddw.com — the only US-manufactured DDW verified at 5 ppm by two independent international isotope laboratories. Ships to the US, Canada, and Mexico with a 30-day guarantee.',
  },
  {
    q: 'How is deuterium depleted water made?',
    a: 'Mdrn-Life DDW uses proprietary multi-stage vacuum rectification distillation at our Fort Lauderdale facility. Artesian source water at 145–155 ppm deuterium is progressively depleted to 5 ppm through controlled distillation, then processed through reverse osmosis, electrolysis, hydrogen infusion, and ionization.',
  },
  {
    q: 'What is the difference between deuterium depleted water brands?',
    a: 'Key differences are depletion level, verification, and origin. Most DDW brands are produced in Eastern Europe or China at 25–125 ppm with unverified claims. Mdrn-Life DDW is US-made at 5 ppm with batch-specific IRMS verification from both USGS Reston and Hydroisotop GmbH.',
  },
];

const labSchema = [
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
      'Every batch of Mdrn-Life DDW is verified by Hydroisotop GmbH and USGS Reston Stable Isotope Lab using IRMS. See the results and what they mean.',
    url: `${siteUrl}/science/lab-testing`,
    publisher: {
      '@type': 'Organization',
      name: 'Mdrn-Life DDW',
      url: siteUrl,
    },
    mainEntityOfPage: `${siteUrl}/science/lab-testing`,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Science', item: `${siteUrl}/science` },
      { '@type': 'ListItem', position: 3, name: 'Lab Testing', item: `${siteUrl}/science/lab-testing` },
    ],
  },
];

export const SEO_CONFIGS = {
  home: {
    title: 'Mdrn-Life DDW — 5 ppm Deuterium-Depleted Water | Live Better. Longer.',
    description:
      "The world's most depleted deuterium water at 5 ppm. US-made, independently lab-verified, and built for cellular performance, recovery, and longevity.",
    canonical: `${siteUrl}/`,
    keywords: 'deuterium depleted water, best deuterium depleted water, deuterium depleted water brands, deuterium water lab test, 5 ppm DDW',
    ogTitle: 'Mdrn-Life DDW — 5 ppm Deuterium-Depleted Water',
    ogDescription: 'US-manufactured, independently verified at 5 ppm. The future of premium cellular hydration.',
    ogUrl: `${siteUrl}/`,
    ogType: 'website',
    twitterTitle: 'Mdrn-Life DDW — 5 ppm Deuterium-Depleted Water',
    twitterDescription: 'US-manufactured, independently verified at 5 ppm. Explore cellular hydration, lab testing, and DDW science.',
    image: socialImage,
  },
  lab: {
    title: 'Independently Lab-Tested DDW | Mdrn-Life DDW',
    description:
      'Every batch of Mdrn-Life DDW is verified by Hydroisotop GmbH and USGS Reston Lab. See our 5 ppm deuterium results and what they mean for your health.',
    canonical: `${siteUrl}/science/lab-testing`,
    keywords:
      'deuterium depleted water, deuterium depleted water brands, best deuterium depleted water, how is deuterium depleted water made, deuterium water lab test',
    ogTitle: "The World's Most Verified Deuterium-Depleted Water | Mdrn-Life DDW",
    ogDescription: '5 ppm deuterium. Verified by Hydroisotop GmbH and the USGS Reston Stable Isotope Lab. See the proof.',
    ogUrl: `${siteUrl}/science/lab-testing`,
    ogType: 'article',
    twitterTitle: "The World's Most Verified DDW | Mdrn-Life DDW",
    twitterDescription: '5 ppm deuterium. Verified by two independent world-class isotope labs. See the results.',
    image: socialImage,
    schema: labSchema,
  },
  product: {
    title: 'Buy Deuterium-Depleted Water — 5 ppm Verified | Mdrn-Life DDW',
    description:
      "Buy the world's most depleted DDW at 5 ppm. US-made, glass or PET, 30-day guarantee. Independently verified by Hydroisotop GmbH and USGS Reston Lab.",
    canonical: `${siteUrl}/products`,
    ogTitle: 'Buy Deuterium-Depleted Water — 5 ppm | Mdrn-Life DDW',
    ogDescription: 'The deepest depletion commercially available. Verified. US-made. 30-day guarantee.',
    ogUrl: `${siteUrl}/products`,
    ogType: 'product',
    twitterTitle: 'Buy 5 ppm Deuterium-Depleted Water | Mdrn-Life DDW',
    twitterDescription: 'Shop verified 5 ppm Mdrn-Life DDW in glass or PET formats through Shopify checkout.',
    image: socialImage,
  },
  science: {
    title: 'DDW Science | Mdrn-Life DDW',
    description:
      'Learn how Mdrn-Life DDW explains deuterium-depleted water through ppm, mitochondria, ATP, cellular hydration, and independent verification.',
    canonical: `${siteUrl}/science`,
    keywords: 'DDW science, deuterium depleted water science, ATP Synthase, cellular hydration, 5 ppm DDW',
    ogTitle: 'DDW Science | Mdrn-Life DDW',
    ogDescription: 'Explore deuterium ppm, mitochondria, ATP, cellular hydration, and verification.',
    ogUrl: `${siteUrl}/science`,
    ogType: 'article',
    twitterTitle: 'DDW Science | Mdrn-Life DDW',
    twitterDescription: 'Explore deuterium ppm, mitochondria, ATP, cellular hydration, and verification.',
    image: socialImage,
  },
  benefits: {
    title: 'Mdrn-Life DDW Benefits | 5 ppm Deuterium-Depleted Water',
    description:
      'Explore compliance-friendly support language for Mdrn-Life DDW, including hydration, cognitive support, cellular energy, circulation, recovery, and healthy aging routines.',
    canonical: `${siteUrl}/benefits`,
    keywords: 'deuterium depleted water benefits, DDW benefits, cellular hydration benefits',
    ogTitle: 'Mdrn-Life DDW Benefits',
    ogDescription: 'Hydration, cognitive support, cellular energy, circulation, recovery, and healthy aging routines.',
    ogUrl: `${siteUrl}/benefits`,
    ogType: 'article',
    twitterTitle: 'Mdrn-Life DDW Benefits',
    twitterDescription: 'Hydration, cognitive support, cellular energy, circulation, recovery, and healthy aging routines.',
    image: socialImage,
  },
  athletes: {
    title: 'Athletes & Recovery | Mdrn-Life DDW',
    description:
      'Advanced hydration for athletes, recovery, and performance-focused living. Mdrn-Life DDW is produced to deuterium levels as low as 5 PPM.',
    canonical: `${siteUrl}/athletes-recovery`,
    keywords: 'athlete hydration, recovery hydration, deuterium depleted water athletes, performance hydration',
    ogTitle: 'Athletes & Recovery | Mdrn-Life DDW',
    ogDescription: 'Advanced hydration for athletes, recovery, and performance-focused living.',
    ogUrl: `${siteUrl}/athletes-recovery`,
    ogType: 'article',
    twitterTitle: 'Athletes & Recovery | Mdrn-Life DDW',
    twitterDescription: 'Advanced hydration for athletes, recovery, and performance-focused living.',
    image: socialImage,
  },
  healthyAging: {
    title: 'Healthy Aging | Mdrn-Life DDW',
    description:
      'Premium deuterium-depleted water for longevity-focused living. Mdrn-Life DDW is produced to deuterium levels as low as 5 PPM.',
    canonical: `${siteUrl}/healthy-aging`,
    keywords: 'healthy aging hydration, longevity water, deuterium depleted water longevity, premium DDW',
    ogTitle: 'Healthy Aging | Mdrn-Life DDW',
    ogDescription: 'Premium deuterium-depleted water for longevity-focused living.',
    ogUrl: `${siteUrl}/healthy-aging`,
    ogType: 'article',
    twitterTitle: 'Healthy Aging | Mdrn-Life DDW',
    twitterDescription: 'Premium deuterium-depleted water for longevity-focused living.',
    image: socialImage,
  },
  body: {
    title: 'Explore the Body | Mdrn-Life DDW',
    description:
      'Explore how hydration, energy, circulation, recovery, and cellular balance connect across body systems through the Mdrn-Life DDW body experience.',
    canonical: `${siteUrl}/explore-the-body`,
    keywords: 'interactive body hydration, cellular hydration, DDW body systems, Mdrn-Life DDW',
    ogTitle: 'Explore the Body | Mdrn-Life DDW',
    ogDescription: 'Hydration, energy, circulation, recovery, and cellular balance across body systems.',
    ogUrl: `${siteUrl}/explore-the-body`,
    ogType: 'website',
    twitterTitle: 'Explore the Body | Mdrn-Life DDW',
    twitterDescription: 'Hydration, energy, circulation, recovery, and cellular balance across body systems.',
    image: socialImage,
  },
  research: {
    title: 'Research | Mdrn-Life DDW',
    description:
      'Research content focused on DDW verification, lab transparency, search demand, and internal linking.',
    canonical: `${siteUrl}/research`,
    keywords: 'deuterium depleted water research, DDW lab transparency, deuterium water verification',
    ogTitle: 'Research | Mdrn-Life DDW',
    ogDescription: 'DDW verification, lab transparency, search demand, and internal linking.',
    ogUrl: `${siteUrl}/research`,
    ogType: 'article',
    twitterTitle: 'Research | Mdrn-Life DDW',
    twitterDescription: 'DDW verification, lab transparency, search demand, and internal linking.',
    image: socialImage,
  },
  contact: {
    title: 'Contact Mdrn-Life DDW',
    description:
      'Contact Mdrn-Life DDW for product questions, lab-report requests, wholesale inquiries, subscription support, or practitioner conversations.',
    canonical: `${siteUrl}/contact`,
    ogTitle: 'Contact Mdrn-Life DDW',
    ogDescription: 'Send product, lab-report, wholesale, subscription, or practitioner questions to Mdrn-Life DDW.',
    ogUrl: `${siteUrl}/contact`,
    ogType: 'website',
    twitterTitle: 'Contact Mdrn-Life DDW',
    twitterDescription: 'Send product, lab-report, wholesale, subscription, or practitioner questions to Mdrn-Life DDW.',
    image: socialImage,
  },
} satisfies Record<string, SeoConfig>;

export function resolveSeo(pathname: string, hash: string): SeoConfig {
  if (pathname === '/science/lab-testing' || hash === '#science/lab-testing') return SEO_CONFIGS.lab;
  if (pathname === '/products' || pathname === '/shop' || hash === '#products') return SEO_CONFIGS.product;
  if (pathname === '/science') return SEO_CONFIGS.science;
  if (pathname === '/benefits') return SEO_CONFIGS.benefits;
  if (pathname === '/athletes-recovery') return SEO_CONFIGS.athletes;
  if (pathname === '/healthy-aging') return SEO_CONFIGS.healthyAging;
  if (pathname === '/explore-the-body') return SEO_CONFIGS.body;
  if (pathname === '/research') return SEO_CONFIGS.research;
  if (pathname === '/contact') return SEO_CONFIGS.contact;
  return SEO_CONFIGS.home;
}
