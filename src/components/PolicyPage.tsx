import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import policyData from '../data/policies.json';
import { sanitizeHtml } from '../lib/sanitizeHtml';

type PolicyRecord = {
  slug: string;
  title: string;
  html: string;
};

const POLICIES = policyData as PolicyRecord[];
const SUPPORT_EMAIL = 'support@orisefinance.com';

function removePolicyTemplateText(html: string) {
  return html
    .replace(/<p>Include any other pertinent information[\s\S]*?<\/p>/gi, '')
    .replace(/<p>Summarize your return policy here[\s\S]*?<\/p>/gi, '')
    .replace(/support@email\.com/gi, SUPPORT_EMAIL)
    .replace(/If you(?:'|’|\u0027)re using calculated shipping rates:\s*/gi, '');
}

export function PolicyPage({ slug }: { slug: string }) {
  const policy = POLICIES.find((item) => item.slug === slug) || POLICIES[0];
  const safePolicyHtml = useMemo(
    () => sanitizeHtml(removePolicyTemplateText(policy.html)),
    [policy.html],
  );

  return (
    <section className="relative min-h-screen overflow-hidden pb-24 pt-36 sm:pt-44">
      <div className="relative z-10 mx-auto max-w-5xl px-6">
        <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
          <div className="hpe-hud-label mb-4 inline-flex items-center gap-2"><FileText size={13} /> Policies & Information</div>
          <h1 className="text-4xl font-medium tracking-tight text-white sm:text-6xl">{policy.title}</h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/52">
            The information below mirrors the current Mdrn-Life DDW store policy supplied for this website.
          </p>
        </motion.header>

        <motion.article
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.08 }}
          className="hpe-glass hpe-policy-content mt-10 rounded-3xl p-6 sm:p-10 lg:p-14"
          dangerouslySetInnerHTML={{ __html: safePolicyHtml }}
        />
      </div>
    </section>
  );
}
