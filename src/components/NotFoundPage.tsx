import { ArrowLeft, SearchX } from 'lucide-react';

export function NotFoundPage() {
  return (
    <section className="hpe-section relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-32">
      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-200/20 bg-cyan-300/[0.08] text-cyan-100">
          <SearchX size={24} />
        </div>
        <div className="hpe-hud-label mt-6 justify-center">Page Not Found</div>
        <h1 className="mt-4 text-4xl font-medium tracking-tight text-white sm:text-5xl">
          This page is not available.
        </h1>
        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-white/60 sm:text-base">
          The link may be outdated, or the page may have moved. Return home to continue exploring Mdrn-Life DDW.
        </p>
        <a
          href="/"
          className="hpe-btn-primary mt-8 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium tracking-wide"
        >
          <ArrowLeft size={14} />
          Back to home
        </a>
      </div>
    </section>
  );
}
