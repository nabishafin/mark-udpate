import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, BookOpen, Loader2 } from 'lucide-react';
import { BlogArticle, FALLBACK_ARTICLES, getBlogArticles } from '../lib/blog';

export function BlogPage() {
  const [articles, setArticles] = useState<BlogArticle[]>(FALLBACK_ARTICLES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    getBlogArticles(controller.signal)
      .then(setArticles)
      .catch(() => setArticles(FALLBACK_ARTICLES))
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const [featured, ...rest] = articles;

  return (
    <section className="relative min-h-screen overflow-hidden pb-24 pt-36 sm:pt-44">
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <motion.header
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <div className="hpe-hud-label mb-4" style={{ color: '#F0D27A' }}>The Journal</div>
          <h1 className="text-4xl font-medium leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Cellular hydration,
            <span className="block hpe-text-chrome">made understandable.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg">
            Evidence-aware guides on deuterium depletion, mitochondrial energy,
            recovery, metabolism, and longevity-focused living.
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/54 sm:text-base">
            New to the category? Explore{' '}
            <a href="/science" className="text-cyan-200 underline decoration-cyan-300/40 underline-offset-4 hover:text-white">
              the science behind DDW
            </a>
            , compare{' '}
            <a href="/athletes-recovery" className="text-cyan-200 underline decoration-cyan-300/40 underline-offset-4 hover:text-white">
              DDW for athlete recovery
            </a>
            , or see{' '}
            <a href="/healthy-aging" className="text-cyan-200 underline decoration-cyan-300/40 underline-offset-4 hover:text-white">
              deuterium depleted water for healthy aging
            </a>
            .
          </p>
        </motion.header>

        {loading && (
          <div className="mt-10 inline-flex items-center gap-2 text-sm text-cyan-100/70">
            <Loader2 className="animate-spin" size={15} /> Syncing the latest Shopify articles
          </div>
        )}

        {featured && (
          <motion.a
            href={`/blogs/news/${featured.handle}`}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08 }}
            className="hpe-glass group mt-14 grid overflow-hidden rounded-3xl lg:grid-cols-[1.35fr_0.65fr]"
          >
            <div className="relative min-h-[320px] overflow-hidden sm:min-h-[460px]">
              <img src={featured.image.src} alt={featured.image.alt} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050608]/75 via-transparent to-transparent" />
            </div>
            <div className="flex flex-col justify-between p-7 sm:p-10">
              <div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-cyan-200/75">
                  <BookOpen size={14} /> Featured insight
                </div>
                <h2 className="mt-6 text-3xl font-medium leading-tight tracking-tight text-white sm:text-4xl">{featured.title}</h2>
                <p className="mt-5 text-base leading-relaxed text-white/58">{featured.excerpt}</p>
              </div>
              <div className="mt-10 flex items-center justify-between gap-4 border-t border-white/10 pt-5">
                <time className="font-mono text-xs uppercase tracking-wider text-white/42" dateTime={featured.publishedAt}>{formatDate(featured.publishedAt)}</time>
                <span className="inline-flex items-center gap-2 text-sm text-cyan-100">Read article <ArrowUpRight size={15} /></span>
              </div>
            </div>
          </motion.a>
        )}

        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((article, index) => (
            <motion.a
              key={article.id}
              href={`/blogs/news/${article.handle}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: index * 0.05 }}
              className="hpe-glass group flex overflow-hidden rounded-2xl flex-col"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img src={article.image.src} alt={article.image.alt} loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050608]/55 via-transparent to-transparent" />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <time className="font-mono text-[11px] uppercase tracking-[0.18em] text-cyan-200/60" dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
                <h2 className="mt-3 text-xl font-medium leading-snug tracking-tight text-white">{article.title}</h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-white/55">{article.excerpt}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm text-cyan-100">Read article <ArrowUpRight size={14} /></span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(value));
}
