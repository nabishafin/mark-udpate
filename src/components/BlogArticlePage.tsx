import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, BookOpen, Loader2 } from 'lucide-react';
import { BlogArticle, FALLBACK_ARTICLES, getBlogArticle, getRecommendedBlogArticles } from '../lib/blog';

type Props = { handle: string };

export function BlogArticlePage({ handle }: Props) {
  const [article, setArticle] = useState<BlogArticle | null>(() =>
    FALLBACK_ARTICLES.find((a) => a.handle === handle) || null,
  );
  const [recommended, setRecommended] = useState<BlogArticle[]>(() =>
    FALLBACK_ARTICLES.filter((a) => a.handle !== handle).slice(0, 3),
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    getBlogArticle(handle, controller.signal)
      .then((a) => { if (a) setArticle(a); })
      .catch(() => undefined)
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [handle]);

  useEffect(() => {
    const controller = new AbortController();
    getRecommendedBlogArticles(handle, controller.signal)
      .then(setRecommended)
      .catch(() => setRecommended(FALLBACK_ARTICLES.filter((a) => a.handle !== handle).slice(0, 3)));
    return () => controller.abort();
  }, [handle]);

  if (!article && loading) {
    return (
      <section className="flex min-h-screen items-center justify-center pt-32">
        <Loader2 className="animate-spin text-cyan-300" size={28} />
      </section>
    );
  }

  if (!article) {
    return (
      <section className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 pt-32 text-center">
        <BookOpen className="text-cyan-300/60" size={36} />
        <h1 className="text-3xl font-medium text-white">Article not found</h1>
        <p className="text-white/55">This article may not be available yet or the link may be incorrect.</p>
        <a href="/blogs/news" className="hpe-btn-primary inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium">
          <ArrowLeft size={14} /> Back to the Journal
        </a>
      </section>
    );
  }

  return (
    <article className="relative min-h-screen overflow-hidden pb-24 pt-36 sm:pt-44">
      <div className="relative z-10 mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <a href="/blogs/news" className="inline-flex items-center gap-2 text-sm text-cyan-200/75 transition hover:text-cyan-100">
            <ArrowLeft size={14} /> The Journal
          </a>
        </motion.div>

        <motion.header
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.06 }}
          className="mt-8"
        >
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-cyan-200/65">
            <BookOpen size={13} /> Mdrn-Life DDW Journal
          </div>
          <h1 className="mt-5 text-3xl font-medium leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
            {article.title}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-4 border-b border-white/10 pb-5">
            <time className="font-mono text-xs uppercase tracking-wider text-white/42" dateTime={article.publishedAt}>
              {formatDate(article.publishedAt)}
            </time>
            {article.authorName && (
              <span className="text-xs text-white/42">By {article.authorName}</span>
            )}
          </div>
        </motion.header>

        {article.image.src && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-8 overflow-hidden rounded-2xl border border-white/10"
          >
            <img
              src={article.image.src}
              alt={article.image.alt}
              className="aspect-[21/9] w-full object-cover"
            />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.18 }}
          className="mt-10"
        >
          {loading && (
            <div className="mb-6 inline-flex items-center gap-2 text-sm text-cyan-100/60">
              <Loader2 className="animate-spin" size={14} /> Loading full article
            </div>
          )}

          {article.content ? (
            <div
              className="hpe-policy-content text-base leading-relaxed sm:text-[17px]"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          ) : (
            <p className="text-lg leading-relaxed text-white/65">{article.excerpt}</p>
          )}
        </motion.div>

        <motion.nav
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.28 }}
          className="mt-10 rounded-2xl border border-white/10 bg-white/[0.025] p-5"
          aria-label="Related DDW resources"
        >
          <div className="hpe-hud-label mb-3">Continue Learning</div>
          <div className="flex flex-wrap gap-3 text-sm">
            <a href="/science/lab-testing" className="text-cyan-200 underline decoration-cyan-300/40 underline-offset-4 hover:text-white">
              independent IRMS lab testing
            </a>
            <a href="/benefits" className="text-cyan-200 underline decoration-cyan-300/40 underline-offset-4 hover:text-white">
              benefits of 5 ppm DDW
            </a>
            <a href="/products" className="text-cyan-200 underline decoration-cyan-300/40 underline-offset-4 hover:text-white">
              shop 5 ppm deuterium depleted water
            </a>
          </div>
        </motion.nav>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-14 border-t border-white/10 pt-8"
        >
          <a href="/blogs/news" className="inline-flex items-center gap-2 text-sm text-cyan-200/75 transition hover:text-cyan-100">
            <ArrowLeft size={14} /> Back to the Journal
          </a>
        </motion.div>

        {recommended.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.42 }}
            className="mt-14"
          >
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <div className="hpe-hud-label">Recommended</div>
                <h2 className="mt-2 text-2xl font-medium text-white">More from the journal</h2>
              </div>
              <a href="/blogs/news" className="hidden items-center gap-2 text-sm text-cyan-200/75 transition hover:text-cyan-100 sm:inline-flex">
                View all <ArrowUpRight size={14} />
              </a>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {recommended.map((item) => (
                <a key={item.id} href={`/blogs/news/${item.handle}`} className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] transition hover:border-cyan-300/30 hover:bg-cyan-300/[0.045]">
                  <div className="aspect-[16/10] overflow-hidden bg-white/[0.03]">
                    <img src={item.image.src} alt={item.image.alt} loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]" />
                  </div>
                  <div className="p-5">
                    <time className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-200/55" dateTime={item.publishedAt}>{formatDate(item.publishedAt)}</time>
                    <h3 className="mt-3 line-clamp-2 text-base font-medium leading-snug text-white">{item.title}</h3>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm text-cyan-100">Read article <ArrowUpRight size={13} /></span>
                  </div>
                </a>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </article>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(value));
}
