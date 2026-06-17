import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Send } from 'lucide-react';

export function ContactPage() {
  return (
    <section className="hpe-section relative min-h-screen overflow-hidden pt-32">
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <div className="hpe-hud-label">Contact</div>
          <h1 className="mt-4 text-4xl font-medium tracking-tight text-white sm:text-6xl">
            Contact Mdrn-Life DDW
          </h1>
          <p className="mt-5 text-base leading-relaxed text-white/62 sm:text-lg">
            Questions about 5 ppm DDW, lab reports, wholesale, subscriptions,
            or practitioner support? Send the team a message below.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.06 }}
            className="hpe-glass rounded-2xl p-6 sm:p-8"
          >
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-cyan-300" />
              <div className="hpe-hud-label">Support</div>
            </div>
            <h2 className="mt-4 text-2xl font-medium tracking-tight text-white sm:text-3xl">
              Send the Mdrn-Life team a message.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-white/62">
              Use the form for product questions, lab-report requests, wholesale
              inquiries, subscription support, or practitioner conversations.
            </p>
            <div className="mt-8 grid gap-3">
              {[
                ['Product questions', 'Glass, PET, 5 ppm DDW, usage, and product details.'],
                ['Lab report requests', 'Hydroisotop GmbH, USGS Reston, and verification questions.'],
                ['Partnerships', 'Wholesale, practitioner, and performance-focused inquiries.'],
              ].map(([title, body]) => (
                <div key={title} className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                  <h2 className="text-sm font-medium text-white">{title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-white/50">{body}</p>
                </div>
              ))}
            </div>
          </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08 }}
          className="hpe-glass rounded-2xl p-6 sm:p-8 grid gap-4"
          action={import.meta.env.VITE_CONTACT_FORM_ENDPOINT || '/contact'}
          method="post"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm text-white/70">
              Name
              <input
                required
                name="name"
                autoComplete="name"
                className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-cyan-300/60"
                placeholder="Your name"
              />
            </label>
            <label className="grid gap-2 text-sm text-white/70">
              Email
              <input
                required
                type="email"
                name="email"
                autoComplete="email"
                className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-cyan-300/60"
                placeholder="you@example.com"
              />
            </label>
          </div>
          <label className="grid gap-2 text-sm text-white/70">
            Phone number
            <input
              type="tel"
              name="phone"
              autoComplete="tel"
              className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-cyan-300/60"
              placeholder="+1 555 000 0000"
            />
          </label>
          <label className="grid gap-2 text-sm text-white/70">
            Message
            <textarea
              required
              name="message"
              rows={7}
              className="resize-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-cyan-300/60"
              placeholder="How can we help?"
            />
          </label>
          <button
            type="submit"
            className="hpe-btn-primary w-full rounded-xl px-5 py-3 text-sm font-medium tracking-wide inline-flex items-center justify-center gap-2 sm:w-auto"
          >
            Send Message
            <Send size={14} />
          </button>
        </motion.form>
        </div>
      </div>
    </section>
  );
}
