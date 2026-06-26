import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Loader2 } from 'lucide-react';
import { BlogArticle, FALLBACK_ARTICLES, getBlogArticle } from '../lib/blog';

type Props = { handle: string };

export function BlogArticlePage({ handle }: Props) {
  const [article, setArticle] = useState<BlogArticle | null>(() =>
    FALLBACK_ARTICLES.find((a) => a.handle === handle) || null,
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
              <Loader2 className="animate-spin" size={14} /> Loading full article from Shopify
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
      </div>
    </article>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(value));
}
