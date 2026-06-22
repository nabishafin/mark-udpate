export type BlogArticle = {
  id: string;
  title: string;
  handle: string;
  excerpt: string;
  publishedAt: string;
  image: { src: string; alt: string };
  url: string;
  content?: string;
  authorName?: string;
};

export const FALLBACK_ARTICLES: BlogArticle[] = [
  {
    id: 'immune-support',
    title: 'Deuterium Depleted Water Immune Support',
    handle: 'deuterium-depleted-water-immune-support',
    excerpt: 'Deuterium depleted water immune support starts at the cellular level, helping optimize mitochondria, recovery, resilience, and daily vitality.',
    publishedAt: '2026-06-22T00:00:00.000Z',
    image: { src: '/blog/immune-support.webp', alt: 'Deuterium depleted water immune support' },
    url: '/blogs/news/deuterium-depleted-water-immune-support',
    content: `<p>Deuterium depleted water immune support starts at the cellular level. Your immune system is metabolically intensive — when mounting a defense, immune cells demand rapid ATP synthesis. This reliance on mitochondrial output means any factor that improves mitochondrial efficiency can meaningfully support immune capacity.</p>
<h2>The Mitochondrial Link</h2>
<p>Deuterium, the heavy hydrogen isotope found at approximately 150 ppm in ordinary water, can interfere with the precise mechanics of ATP synthase — the mitochondrial nanomotor responsible for energy production. When deuterium-containing water enters the mitochondrial matrix, it slows the molecular machinery that generates ATP, reducing the energy available for cellular defense.</p>
<p>By consuming Mdrn-Life DDW at 5 ppm, you substantially reduce the deuterium substrate available to these critical molecular machines, potentially allowing ATP synthase to operate with greater fidelity and output.</p>
<h2>What Research Suggests</h2>
<p>Research by investigators including László Boros has explored how deuterium depletion supports mitochondrial function and may enhance cellular resilience. For the immune system, which depends on high-output mitochondria in NK cells, T-cells, and macrophages, this efficiency gain may translate to more robust and sustained immune responses.</p>
<p>Many Mdrn-Life DDW users report improved resilience during seasonal challenges as one of the first changes they notice — consistent with the mechanistic case for DDW and immune support.</p>
<h2>Daily Use</h2>
<p>Most protocols involve replacing a portion of daily water intake with DDW over a sustained period, allowing the body's cellular water pools to gradually shift toward lower deuterium concentrations. The 5 ppm concentration in Mdrn-Life DDW is among the most depleted commercially available.</p>`,
  },
  {
    id: 'recovery',
    title: 'Can Deuterium Depleted Water Improve Recovery?',
    handle: 'can-deuterium-depleted-water-improve-recovery',
    excerpt: 'Can deuterium depleted water improve recovery? See what mitochondrial science, energy demands, and inflammation may reveal about faster repair.',
    publishedAt: '2026-06-21T00:00:00.000Z',
    image: { src: '/blog/recovery.webp', alt: 'Athlete considering recovery after training' },
    url: '/blogs/news/can-deuterium-depleted-water-improve-recovery',
    content: `<p>Recovery is not merely the absence of exertion — it is an active biological process that depends heavily on mitochondrial efficiency and cellular energy availability. This is why deuterium depleted water has attracted growing interest among athletes and performance-focused individuals.</p>
<h2>What Happens During Recovery</h2>
<p>After intense physical effort, your body initiates complex repair processes. Muscle protein synthesis accelerates, inflammation is managed, and cellular debris is cleared. Each of these processes requires substantial ATP. The mitochondria are at the center of this metabolic storm — and the quality of the water substrate those mitochondria receive matters.</p>
<h2>Where DDW Fits In</h2>
<p>Deuterium, present in ordinary water at ~150 ppm, can interfere with the precise mechanical rotation of ATP synthase — the nanomotor inside mitochondria that produces ATP. Studies suggest that reducing deuterium intake may allow this critical enzyme to operate with greater fidelity, potentially improving ATP yield per cycle.</p>
<p>For recovery purposes, this means faster restoration of cellular energy reserves, potentially shorter recovery windows, and improved readiness for the next training session.</p>
<h2>The Athlete's Perspective</h2>
<p>Competitive athletes and serious recreational exercisers have increasingly explored DDW as part of recovery protocols. The appeal is straightforward: if mitochondrial efficiency drives recovery speed, and deuterium reduction supports mitochondrial efficiency, then DDW represents a logical intervention point. Mdrn-Life DDW at 5 ppm delivers meaningful deuterium reduction in a convenient glass or PET format.</p>`,
  },
  {
    id: 'anti-aging',
    title: 'Deuterium Depleted Water Anti Aging Guide',
    handle: 'deuterium-depleted-water-anti-aging',
    excerpt: 'Deuterium depleted water anti aging claims center on mitochondria, energy, and recovery. Here is what it may do, what science says, and why it matters.',
    publishedAt: '2026-06-20T00:00:00.000Z',
    image: { src: '/blog/anti-aging.webp', alt: 'Wellness and healthy aging with water' },
    url: '/blogs/news/deuterium-depleted-water-anti-aging',
    content: `<p>The science of anti-aging increasingly points to the mitochondria. Cellular aging is characterized by declining mitochondrial function, accumulating oxidative damage, and reduced energy production — all areas where deuterium depleted water may have meaningful influence.</p>
<h2>Deuterium and Cellular Age</h2>
<p>Research by László Boros and other investigators has explored the connection between deuterium metabolism and aging. The central hypothesis: as organisms age, their ability to internally deplete deuterium via mitochondrial processes may decline. This creates a feedback loop where elevated intracellular deuterium further impairs the very machinery that would otherwise help manage it.</p>
<p>By providing cells with dramatically lower-deuterium water from the outside, DDW may help interrupt this cycle and support the mitochondrial function that underlies vitality, tissue repair, and metabolic health.</p>
<h2>Longevity Research Context</h2>
<p>Studies in model organisms have shown links between deuterium concentration and lifespan. While direct human longevity studies are limited, the mechanistic pathway — mitochondrial efficiency → reduced oxidative stress → improved cellular maintenance — is increasingly well-understood and consistent with broader longevity science.</p>
<h2>The Case for External DDW</h2>
<p>Mdrn-Life DDW at 5 ppm is among the most depleted formats commercially available, offering a 97% reduction from the ~150 ppm found in ordinary water. While no product can halt aging, supporting mitochondrial efficiency through reduced deuterium exposure represents a scientifically coherent approach to healthy longevity.</p>`,
  },
  {
    id: 'brain-fog',
    title: 'Deuterium Depleted Water for Brain Fog?',
    handle: 'deuterium-depleted-water-for-brain-fog',
    excerpt: 'Can deuterium depleted water for brain fog support clearer thinking and cellular energy? Learn the science, limits, and daily use approach.',
    publishedAt: '2026-06-19T00:00:00.000Z',
    image: { src: '/blog/brain-fog.webp', alt: 'Clear thinking and cellular energy concept' },
    url: '/blogs/news/deuterium-depleted-water-for-brain-fog',
    content: `<p>Brain fog is not a medical diagnosis, but it is a very real experience — characterized by difficulty concentrating, mental fatigue, and a sense of cognitive cloudiness. One emerging perspective links these symptoms to mitochondrial inefficiency in neurons and glial cells.</p>
<h2>The Energy Cost of Thinking</h2>
<p>The brain consumes approximately 20% of the body's energy despite comprising only about 2% of body weight. Neurons are exceptionally metabolically active cells, and even small inefficiencies in mitochondrial ATP production can manifest as noticeable cognitive symptoms. This is why conditions that impair mitochondrial function — including some metabolic disorders and aging — often have cognitive components.</p>
<h2>Deuterium's Role</h2>
<p>Deuterium at physiological concentrations can interfere with enzymatic processes and the nanoscale mechanics of ATP synthase. The brain's high energy demands make it particularly sensitive to changes in mitochondrial efficiency. Some researchers hypothesize that chronic elevated deuterium may contribute to the low-grade mitochondrial dysfunction that underlies certain cognitive complaints.</p>
<h2>What Users Report</h2>
<p>Many Mdrn-Life DDW users cite improvements in mental clarity and focus as among the first changes they notice — often within the first two to three weeks of consistent use. This anecdotal pattern aligns with the mechanistic case: as cellular deuterium levels gradually decrease with DDW consumption, mitochondrial function in energy-hungry neurons may improve.</p>
<p>Mdrn-Life DDW at 5 ppm provides a meaningful, sustained reduction in dietary deuterium load, potentially supporting cleaner mitochondrial function throughout the central nervous system.</p>`,
  },
  {
    id: 'metabolism',
    title: 'Does Deuterium Depleted Water Support Metabolism?',
    handle: 'does-deuterium-depleted-water-support-metabolism',
    excerpt: 'Does deuterium depleted water support metabolism? Learn how DDW may influence mitochondria, cellular energy, fat oxidation, and recovery.',
    publishedAt: '2026-06-18T00:00:00.000Z',
    image: { src: '/blog/metabolism.webp', alt: 'Metabolism and hydration concept' },
    url: '/blogs/news/does-deuterium-depleted-water-support-metabolism',
    content: `<p>Metabolism is, at its most fundamental level, a story about mitochondria. Every calorie you burn passes through the mitochondrial machinery in some form, and the efficiency of this process shapes everything from body composition to energy levels to longevity. Deuterium depleted water intersects with metabolism at precisely this point.</p>
<h2>Where Deuterium Intersects</h2>
<p>Deuterium's influence on metabolism is an active area of research. The heavy isotope has higher mass and different bonding properties compared to ordinary hydrogen. In metabolic pathways, these differences can slow enzymatic reactions and alter the kinetics of key metabolic steps.</p>
<p>Of particular interest is deuterium's interaction with NADH and FADH2 — the electron carriers that shuttle energy from food oxidation to the mitochondrial electron transport chain. Research suggests that elevated deuterium may reduce the efficiency of these transfers, lowering metabolic yield from a given amount of substrate.</p>
<h2>Fat Oxidation</h2>
<p>Some investigators have noted connections between DDW consumption and fat oxidation rates, though this remains preliminary. The mechanistic pathway would involve improved mitochondrial efficiency allowing for higher rates of fatty acid beta-oxidation — particularly relevant for those pursuing metabolic health or body composition goals.</p>
<h2>Practical Considerations</h2>
<p>DDW is not a metabolic "hack" — it works by supporting the cellular machinery that metabolism depends on. The most consistent reports from DDW users involve improved energy levels and better recovery, which are consistent with metabolic improvements at the mitochondrial level. Mdrn-Life DDW at 5 ppm provides this substrate support in independently verified form.</p>`,
  },
  {
    id: 'mitochondria',
    title: 'Deuterium Depleted Water for Mitochondria',
    handle: 'deuterium-depleted-water-for-mitochondria',
    excerpt: 'Learn how deuterium depleted water for mitochondria may support ATP production, metabolism, recovery, and healthy aging at the cellular level.',
    publishedAt: '2026-06-17T00:00:00.000Z',
    image: { src: '/blog/mitochondria.webp', alt: 'Mitochondrial energy and hydration concept' },
    url: '/blogs/news/deuterium-depleted-water-for-mitochondria',
    content: `<p>The mitochondria are the power plants of the cell — but they are far more sophisticated than any industrial power plant. These organelles evolved from ancient bacteria and retain many bacterial characteristics, including extreme sensitivity to their chemical environment.</p>
<h2>ATP Synthase: The Nanomotor</h2>
<p>At the heart of mitochondrial function is ATP synthase, a remarkable molecular machine that spins at roughly 100-150 rotations per second to produce ATP. This nanomotor has extraordinarily tight tolerances — its rotating gamma subunit has a diameter measured in atoms.</p>
<p>Deuterium, with its extra neutron, is approximately twice the mass of ordinary hydrogen. When deuterium-containing water enters the mitochondrial matrix, it can interfere with the precision mechanics of ATP synthase, slowing the nanomotor and reducing ATP output. The effect is subtle but, over millions of mitochondria performing billions of rotations per second, potentially significant at the whole-organism level.</p>
<h2>The Case for 5 PPM</h2>
<p>Ordinary water contains approximately 150 ppm deuterium. Mdrn-Life DDW at 5 ppm reduces this by 97%, providing the mitochondria with dramatically lighter water substrate. The goal is to support the nanomotor's mechanical efficiency and, by extension, the cell's capacity for energy production, repair, and function.</p>
<h2>Research Foundation</h2>
<p>Research by László Boros, Anatoly Degtyarenko, and others in the deuterium depletion field has contributed substantially to this mechanistic understanding. Mdrn-Life DDW is produced to the 5 ppm standard with independent laboratory verification, making it one of the most rigorously tested DDW products available. Explore our lab testing documentation to see the verification data.</p>`,
  },
];

type ShopifyArticleNode = {
  id: string;
  title: string;
  handle: string;
  excerpt?: string;
  contentHtml?: string;
  publishedAt: string;
  onlineStoreUrl?: string;
  image?: { url: string; altText?: string };
  author?: { name: string };
};

async function shopifyFetch(body: object, signal?: AbortSignal) {
  const endpoint = import.meta.env.VITE_SHOPIFY_STOREFRONT_API_URL;
  const token = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;
  if (!endpoint || !token) return null;

  const response = await fetch(endpoint, {
    method: 'POST',
    signal,
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) throw new Error(`Shopify request failed: ${response.status}`);
  return response.json();
}

function mapNode(article: ShopifyArticleNode): BlogArticle {
  return {
    id: article.id,
    title: article.title,
    handle: article.handle,
    excerpt: article.excerpt || '',
    publishedAt: article.publishedAt,
    image: {
      src: article.image?.url || '/blog/immune-support.webp',
      alt: article.image?.altText || article.title,
    },
    url: `/blogs/news/${article.handle}`,
    content: article.contentHtml,
    authorName: article.author?.name,
  };
}

export async function getBlogArticles(signal?: AbortSignal): Promise<BlogArticle[]> {
  const payload = await shopifyFetch({
    query: `query BlogArticles($first: Int!) {
      blog(handle: "news") {
        articles(first: $first, sortKey: PUBLISHED_AT, reverse: true) {
          nodes { id title handle excerpt contentHtml publishedAt onlineStoreUrl image { url altText } author { name } }
        }
      }
    }`,
    variables: { first: 24 },
  }, signal);

  if (!payload) return FALLBACK_ARTICLES;
  const nodes: ShopifyArticleNode[] = payload?.data?.blog?.articles?.nodes || [];
  if (!nodes.length) return FALLBACK_ARTICLES;
  return nodes.map(mapNode);
}

export async function getBlogArticle(handle: string, signal?: AbortSignal): Promise<BlogArticle | null> {
  const fallback = FALLBACK_ARTICLES.find((a) => a.handle === handle) || null;

  const payload = await shopifyFetch({
    query: `query BlogArticle($handle: String!) {
      blog(handle: "news") {
        articleByHandle(handle: $handle) {
          id title handle excerpt contentHtml publishedAt onlineStoreUrl image { url altText } author { name }
        }
      }
    }`,
    variables: { handle },
  }, signal).catch(() => null);

  const node: ShopifyArticleNode | null = payload?.data?.blog?.articleByHandle || null;
  return node ? mapNode(node) : fallback;
}
