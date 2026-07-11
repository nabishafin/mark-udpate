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
  noIndex?: boolean;
};

export const siteUrl = 'https://mdrnlifeddw.com';
const socialImage = `${siteUrl}/products/mdrn-life-ddw-glass.webp`;
const defaultKeywords =
  'deuterium depleted water, 5 ppm DDW, IRMS verified DDW, deuterium depleted water USA made, Mdrn-Life DDW';

export const LAB_FAQS = [
  {
    q: 'Is deuterium depleted water the same as hydrogen water?',
    a: 'No. Hydrogen water is regular water infused with dissolved molecular hydrogen (H2). It does not reduce deuterium content. Deuterium depleted water (DDW) is processed to remove the heavy hydrogen isotope, reducing concentration from about 150 ppm to as low as 5 ppm using vacuum rectification distillation.',
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
    a: 'Mdrn-Life DDW is available at mdrnlifeddw.com. It is US-manufactured DDW verified at 5 ppm by two independent international isotope laboratories. Ships to the US, Canada, and Mexico with a 30-day guarantee.',
  },
  {
    q: 'How is deuterium depleted water made?',
    a: 'Mdrn-Life DDW uses proprietary multi-stage vacuum rectification distillation at our Fort Lauderdale facility. Artesian source water at 145-155 ppm deuterium is progressively depleted to 5 ppm through controlled distillation, then processed through reverse osmosis, electrolysis, hydrogen infusion, and ionization.',
  },
  {
    q: 'What is the difference between deuterium depleted water brands?',
    a: 'Key differences are depletion level, verification, and origin. Most DDW brands are produced in Eastern Europe or China at 25-125 ppm with unverified claims. Mdrn-Life DDW is US-made at 5 ppm with batch-specific IRMS verification from both USGS Reston and Hydroisotop GmbH.',
  },
];

const LEARN_SEO_ARTICLES = [
  {
    slug: 'deuterium-mitochondria',
    title: 'Deuterium and Mitochondria',
    description:
      'Learn how deuterium, ATP synthase, and mitochondrial function connect to 5 ppm deuterium depleted water research.',
  },
  {
    slug: 'hydration-recovery',
    title: 'Hydration and Recovery',
    description:
      'Explore how cellular hydration, mitochondria, and DDW may fit into athlete recovery and performance routines.',
  },
  {
    slug: 'hydration-brain-function',
    title: 'Hydration and Brain Function',
    description:
      'Understand the relationship between hydration, brain energy demands, mitochondria, and precisely verified 5 ppm DDW.',
  },
  {
    slug: 'hydration-gut-health',
    title: 'Hydration and Gut Health',
    description:
      'Learn how cellular hydration supports gut function, absorption, microbiome balance, and DDW-focused hydration protocols.',
  },
  {
    slug: 'hydration-healthy-aging',
    title: 'Hydration and Healthy Aging',
    description:
      'Explore hydration quality, mitochondrial efficiency, oxidative balance, and deuterium depleted water for healthy aging.',
  },
  {
    slug: 'cellular-energy-performance',
    title: 'Cellular Energy and Performance',
    description:
      'Learn how ATP synthase, hydrogen isotopes, IRMS verification, and 5 ppm DDW connect to cellular energy research.',
  },
] as const;

const BLOG_SEO_ARTICLES = [
  {
    title: 'Deuterium Depleted Water Immune Support',
    handle: 'deuterium-depleted-water-immune-support',
    excerpt:
      'Deuterium depleted water immune support starts at the cellular level, helping optimize mitochondria, recovery, resilience, and daily vitality.',
    publishedAt: '2026-06-22T00:00:00.000Z',
    image: '/blog/immune-support.webp',
  },
  {
    title: 'Can Deuterium Depleted Water Improve Recovery?',
    handle: 'can-deuterium-depleted-water-improve-recovery',
    excerpt:
      'Can deuterium depleted water improve recovery? See what mitochondrial science, energy demands, and inflammation may reveal about faster repair.',
    publishedAt: '2026-06-21T00:00:00.000Z',
    image: '/blog/recovery.webp',
  },
  {
    title: 'Deuterium Depleted Water Anti Aging Guide',
    handle: 'deuterium-depleted-water-anti-aging',
    excerpt:
      'Deuterium depleted water anti aging claims center on mitochondria, energy, and recovery. Here is what it may do, what science says, and why it matters.',
    publishedAt: '2026-06-20T00:00:00.000Z',
    image: '/blog/anti-aging.webp',
  },
  {
    title: 'Deuterium Depleted Water for Brain Fog?',
    handle: 'deuterium-depleted-water-for-brain-fog',
    excerpt:
      'Can deuterium depleted water for brain fog support clearer thinking and cellular energy? Learn the science, limits, and daily use approach.',
    publishedAt: '2026-06-19T00:00:00.000Z',
    image: '/blog/brain-fog.webp',
  },
  {
    title: 'Does Deuterium Depleted Water Support Metabolism?',
    handle: 'does-deuterium-depleted-water-support-metabolism',
    excerpt:
      'Does deuterium depleted water support metabolism? Learn how DDW may influence mitochondria, cellular energy, fat oxidation, and recovery.',
    publishedAt: '2026-06-18T00:00:00.000Z',
    image: '/blog/metabolism.webp',
  },
  {
    title: 'Deuterium Depleted Water for Mitochondria',
    handle: 'deuterium-depleted-water-for-mitochondria',
    excerpt:
      'Learn how deuterium depleted water for mitochondria may support ATP production, metabolism, recovery, and healthy aging at the cellular level.',
    publishedAt: '2026-06-17T00:00:00.000Z',
    image: '/blog/mitochondria.webp',
  },
] as const;

function absoluteUrl(path: string) {
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

function absoluteImage(path?: string) {
  return path ? absoluteUrl(path) : socialImage;
}

function normalizePathname(pathname: string) {
  const path = pathname.split('?')[0].split('#')[0] || '/';
  return path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
}

function pageSchema(name: string, url: string, description: string) {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name,
      url,
      description,
      isPartOf: {
        '@type': 'WebSite',
        name: 'Mdrn-Life DDW',
        url: `${siteUrl}/`,
      },
      publisher: {
        '@type': 'Organization',
        name: 'Mdrn-Life DDW',
        url: siteUrl,
      },
    },
  ];
}

function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

function buildSeo({
  title,
  description,
  path,
  type = 'website',
  image = socialImage,
  keywords = defaultKeywords,
  schema,
  noIndex,
}: {
  title: string;
  description: string;
  path: string;
  type?: SeoConfig['ogType'];
  image?: string;
  keywords?: string;
  schema?: Record<string, unknown>[];
  noIndex?: boolean;
}): SeoConfig {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    canonical: url,
    keywords,
    ogTitle: title,
    ogDescription: description,
    ogUrl: url,
    ogType: type,
    twitterTitle: title,
    twitterDescription: description,
    image,
    schema,
    noIndex,
  };
}

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
    headline: 'DDW Lab Testing & IRMS Verification | Mdrn-Life',
    description:
      'Every batch verified by Hydroisotop GmbH and the USGS Reston Lab using IRMS. See the independent test results for our 5 ppm DDW.',
    url: `${siteUrl}/science/lab-testing`,
    publisher: {
      '@type': 'Organization',
      name: 'Mdrn-Life DDW',
      url: siteUrl,
    },
    mainEntityOfPage: `${siteUrl}/science/lab-testing`,
  },
  breadcrumbSchema([
    { name: 'Home', url: `${siteUrl}/` },
    { name: 'Science', url: `${siteUrl}/science` },
    { name: 'Lab Testing', url: `${siteUrl}/science/lab-testing` },
  ]),
];

export const SEO_CONFIGS = {
  home: buildSeo({
    title: '5 ppm Deuterium Depleted Water | Mdrn-Life DDW',
    description:
      'The lowest PPM DDW available. IRMS-verified, USA-made, independently tested. Glass and PET. Live better, longer - starting at the cellular level.',
    path: '/',
    schema: pageSchema(
      '5 ppm Deuterium Depleted Water | Mdrn-Life DDW',
      `${siteUrl}/`,
      'The lowest PPM DDW available. IRMS-verified, USA-made, independently tested. Glass and PET.',
    ),
  }),
  science: buildSeo({
    title: 'The Science Behind DDW | Mdrn-Life DDW',
    description:
      'How does deuterium depleted water work? Explore ppm levels, ATP synthase, mitochondria, and IRMS lab verification - explained clearly.',
    path: '/science',
    type: 'article',
    keywords: 'DDW science, deuterium depleted water mitochondria, ATP synthase, IRMS lab verification, 5 ppm DDW',
  }),
  lab: buildSeo({
    title: 'DDW Lab Testing & IRMS Verification | Mdrn-Life',
    description:
      'Every batch verified by Hydroisotop GmbH and the USGS Reston Lab using IRMS. See the independent test results for our 5 ppm DDW.',
    path: '/science/lab-testing',
    type: 'article',
    keywords: 'IRMS verified DDW, DDW lab testing, Hydroisotop GmbH, USGS Reston Lab, 5 ppm DDW',
    schema: labSchema,
  }),
  benefits: buildSeo({
    title: 'Deuterium Depleted Water Benefits | Mdrn-Life DDW',
    description:
      'From cellular energy to recovery and healthy aging - explore why people choose 5 ppm DDW as part of their advanced hydration routine.',
    path: '/benefits',
    type: 'article',
    keywords: 'deuterium depleted water benefits, 5 ppm DDW benefits, cellular energy hydration, healthy aging DDW',
  }),
  athletes: buildSeo({
    title: 'DDW for Athletes & Recovery | Mdrn-Life DDW',
    description:
      'Support performance, reduce oxidative stress, and accelerate recovery with 5 ppm deuterium depleted water. IRMS-verified, USA-made.',
    path: '/athletes-recovery',
    type: 'article',
    keywords: 'DDW for athletes recovery, deuterium depleted water athletes, 5 ppm DDW recovery, USA-made DDW',
  }),
  healthyAging: buildSeo({
    title: 'Deuterium Depleted Water for Healthy Aging | Mdrn-Life',
    description:
      'Support mitochondrial function, cellular balance, and longevity with 5 ppm DDW. Explore how advanced hydration supports healthy aging.',
    path: '/healthy-aging',
    type: 'article',
    keywords: 'deuterium depleted water for healthy aging, 5 ppm DDW, mitochondrial function, longevity hydration',
  }),
  research: buildSeo({
    title: 'DDW Research & Studies | Mdrn-Life DDW',
    description:
      'Explore the peer-reviewed science behind deuterium depleted water - mitochondria, oxidative stress, cellular energy, and longevity research.',
    path: '/research',
    type: 'article',
    keywords: 'DDW research studies, deuterium depleted water research, mitochondria oxidative stress, cellular energy DDW',
  }),
  blog: buildSeo({
    title: 'DDW Blog - Deuterium Depleted Water Insights | Mdrn-Life',
    description:
      'Science, wellness, and performance content from the makers of 5 ppm DDW. Stay current on hydration research, athlete tips, and healthy aging.',
    path: '/blogs/news',
    image: `${siteUrl}/blog/immune-support.webp`,
    keywords: 'DDW blog, deuterium depleted water insights, 5 ppm DDW, athlete recovery, healthy aging',
  }),
  product: buildSeo({
    title: 'Buy 5 ppm Deuterium Depleted Water | Mdrn-Life DDW',
    description:
      'Shop IRMS-verified 5 ppm DDW in glass or BPA-free PET plastic. USA-made, independently tested. The lowest PPM deuterium depleted water available.',
    path: '/products',
    type: 'product',
    keywords: 'buy 5 ppm deuterium depleted water, IRMS verified DDW, deuterium depleted water USA made, DDW glass PET',
  }),
  founder: buildSeo({
    title: 'Our Story - Why We Built Mdrn-Life DDW',
    description:
      "Meet the team behind the USA's lowest PPM deuterium depleted water. Learn what drove us to verify, produce, and bottle 5 ppm DDW.",
    path: '/founder',
    keywords: 'Mdrn-Life DDW story, deuterium depleted water USA made, 5 ppm DDW verification',
  }),
  learn: buildSeo({
    title: 'Learn About Deuterium Depleted Water | Mdrn-Life',
    description:
      "New to DDW? Start here. Understand what deuterium is, why ppm matters, and how 5 ppm water differs from what's in your tap.",
    path: '/learn',
    type: 'article',
    keywords: 'learn deuterium depleted water, what is DDW, 5 ppm water, deuterium ppm',
  }),
  contact: buildSeo({
    title: 'Contact Mdrn-Life DDW | Questions & Support',
    description:
      "Reach the Mdrn-Life DDW team via WhatsApp or email. Questions about our 5 ppm DDW, lab results, orders, or wholesale? We're here.",
    path: '/contact',
  }),
  body: buildSeo({
    title: 'Explore Cellular Hydration and Mitochondrial Function | Mdrn-Life DDW',
    description:
      'Explore how hydration, energy, circulation, recovery, and cellular balance connect across body systems through the Mdrn-Life DDW body experience.',
    path: '/explore-the-body',
    keywords: 'interactive body hydration, cellular hydration, DDW body systems, Mdrn-Life DDW',
  }),
  policy: buildSeo({
    title: 'Policies & Information | Mdrn-Life DDW',
    description: 'Review Mdrn-Life DDW customer policies and store information.',
    path: '/policies/terms-of-service',
    noIndex: true,
  }),
  notFound: buildSeo({
    title: 'Page Not Found | Mdrn-Life DDW',
    description: 'The requested Mdrn-Life DDW page could not be found.',
    path: '/',
    noIndex: true,
  }),
} satisfies Record<string, SeoConfig>;

const POLICY_TITLES: Record<string, string> = {
  '/policies/terms-of-service': 'Terms of Service | Mdrn-Life DDW',
  '/policies/shipping-policy': 'Shipping Policy | Mdrn-Life DDW',
  '/policies/refund-policy': 'Refund Policy | Mdrn-Life DDW',
  '/policies/privacy-policy': 'Privacy Policy | Mdrn-Life DDW',
  '/policies/subscription-policy': 'Subscription Policy | Mdrn-Life DDW',
  '/pages/refund': 'Refund Policy | Mdrn-Life DDW',
};

function learnArticleSeo(slug: string): SeoConfig {
  const article = LEARN_SEO_ARTICLES.find((item) => item.slug === slug);
  if (!article) return SEO_CONFIGS.notFound;

  const path = `/learn/${article.slug}`;
  const title = `${article.title} | Mdrn-Life DDW`;
  return buildSeo({
    title,
    description: article.description,
    path,
    type: 'article',
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        description: article.description,
        url: absoluteUrl(path),
        publisher: {
          '@type': 'Organization',
          name: 'Mdrn-Life DDW',
          url: siteUrl,
        },
        mainEntityOfPage: absoluteUrl(path),
      },
      breadcrumbSchema([
        { name: 'Home', url: `${siteUrl}/` },
        { name: 'Learn', url: `${siteUrl}/learn` },
        { name: article.title, url: absoluteUrl(path) },
      ]),
    ],
  });
}

function blogArticleSeo(handle: string): SeoConfig {
  const article = BLOG_SEO_ARTICLES.find((item) => item.handle === handle);
  if (!article) return SEO_CONFIGS.notFound;

  const path = `/blogs/news/${article.handle}`;
  const image = absoluteImage(article.image);
  const schema: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: article.title,
      description: article.excerpt,
      image,
      datePublished: article.publishedAt,
      publisher: {
        '@type': 'Organization',
        name: 'Mdrn-Life DDW',
        url: siteUrl,
      },
      mainEntityOfPage: absoluteUrl(path),
    },
    breadcrumbSchema([
      { name: 'Home', url: `${siteUrl}/` },
      { name: 'DDW Blog', url: `${siteUrl}/blogs/news` },
      { name: article.title, url: absoluteUrl(path) },
    ]),
  ];

  return buildSeo({
    title: `${article.title} | Mdrn-Life DDW`,
    description: article.excerpt,
    path,
    type: 'article',
    image,
    schema,
    keywords: 'deuterium depleted water blog, DDW research, 5 ppm DDW, mitochondrial hydration',
  });
}

function policySeo(pathname: string): SeoConfig {
  const title = POLICY_TITLES[pathname] ?? SEO_CONFIGS.policy.title;
  return buildSeo({
    title,
    description: 'Review Mdrn-Life DDW customer policies and store information.',
    path: pathname,
    noIndex: true,
  });
}

export function resolveSeo(pathname: string, hash: string): SeoConfig {
  const path = normalizePathname(pathname);

  if (path === '/science/lab-testing' || hash === '#science/lab-testing') return SEO_CONFIGS.lab;
  if (path === '/products' || path === '/shop' || hash === '#products') return SEO_CONFIGS.product;
  if (path === '/science') return SEO_CONFIGS.science;
  if (path === '/benefits') return SEO_CONFIGS.benefits;
  if (path === '/athletes-recovery') return SEO_CONFIGS.athletes;
  if (path === '/healthy-aging') return SEO_CONFIGS.healthyAging;
  if (path === '/explore-the-body') return SEO_CONFIGS.body;
  if (path === '/research') return SEO_CONFIGS.research;
  if (path === '/contact') return SEO_CONFIGS.contact;
  if (path === '/blogs' || path === '/blogs/news') return SEO_CONFIGS.blog;
  if (path.startsWith('/blogs/news/') && path.length > '/blogs/news/'.length) {
    return blogArticleSeo(path.slice('/blogs/news/'.length));
  }
  if (path === '/founder') return SEO_CONFIGS.founder;
  if (path === '/learn') return SEO_CONFIGS.learn;
  if (path.startsWith('/learn/') && path.length > '/learn/'.length) {
    return learnArticleSeo(path.slice('/learn/'.length));
  }
  if (path.startsWith('/policies/') || path === '/pages/refund') return policySeo(path);
  if (path === '/') return SEO_CONFIGS.home;
  return SEO_CONFIGS.notFound;
}
