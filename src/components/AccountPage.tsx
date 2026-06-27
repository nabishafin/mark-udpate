import { FormEvent, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Lock, LogOut, Mail, MessageCircle, ShieldCheck, UserPlus } from 'lucide-react';
import {
  CustomerSession,
  clearCustomerSession,
  getCustomer,
  getCustomerDisplayName,
  getStoredCustomerSession,
  loginCustomer,
  recoverCustomerPassword,
  registerCustomer,
  saveCustomerSession,
} from '../lib/customer';

type AuthMode = 'login' | 'register' | 'recover' | 'account';

type Props = {
  mode: AuthMode;
};

const SUPPORT_EMAIL = 'support@orisefinance.com';

export function AccountPage({ mode }: Props) {
  const [session, setSession] = useState<CustomerSession | null>(() => getStoredCustomerSession());
  const isAccount = mode === 'account';

  useEffect(() => {
    const active = getStoredCustomerSession();
    setSession(active);
    if (!active || active.customer) return;

    getCustomer(active.accessToken)
      .then((customer) => {
        const updated = { ...active, customer };
        saveCustomerSession(updated);
        setSession(updated);
      })
      .catch(() => undefined);
  }, [mode]);

  if (isAccount && session) {
    return <CustomerDashboard session={session} onLogout={() => { clearCustomerSession(); setSession(null); }} />;
  }

  return (
    <section className="relative min-h-screen overflow-hidden pb-24 pt-32">
      <div className="relative z-10 mx-auto grid max-w-6xl gap-8 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="pt-4"
        >
          <div className="hpe-hud-label">Shopify Customer Account</div>
          <h1 className="mt-4 text-4xl font-medium tracking-tight text-white sm:text-6xl">
            Secure account access.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/62 sm:text-lg">
            Register, sign in, recover your password, and contact the store team
            through the same Shopify customer backend used for orders.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              ['Customer creation', 'Creates a Shopify customer record.'],
              ['Secure login', 'Uses Shopify customer access tokens.'],
              ['Password recovery', 'Sends the Shopify reset flow by email.'],
              ['Admin support', 'Routes messages to store support.'],
            ].map(([title, body]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <ShieldCheck className="text-cyan-300" size={16} />
                <h2 className="mt-3 text-sm font-medium text-white">{title}</h2>
                <p className="mt-1.5 text-xs leading-relaxed text-white/50">{body}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.06 }}
          className="hpe-glass rounded-2xl p-5 sm:p-7"
        >
          {mode === 'register' ? <RegisterForm onSession={setSession} /> : mode === 'recover' ? <RecoverForm /> : <LoginForm onSession={setSession} />}
        </motion.div>
      </div>
    </section>
  );
}

function LoginForm({ onSession }: { onSession: (session: CustomerSession) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setStatus('');
    try {
      const session = await loginCustomer({ email, password });
      onSession(session);
      setStatus('Signed in through Shopify. Opening your account...');
      navigate('/account');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign in.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-4">
      <FormHeader icon={Lock} title="Login" body="Access your Shopify customer account." />
      <TextField label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" required />
      <TextField label="Password" type="password" value={password} onChange={setPassword} autoComplete="current-password" required />
      <Feedback error={error} status={status} />
      <button type="submit" disabled={submitting} className="hpe-btn-primary inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium disabled:opacity-50">
        {submitting ? 'Signing in...' : 'Login with Shopify'} <ArrowRight size={14} />
      </button>
      <div className="flex flex-wrap gap-3 text-sm text-white/55">
        <a href="/forgot-password" className="text-cyan-200/75 hover:text-cyan-100">Forgot password?</a>
        <span>Need an account?</span>
        <a href="/register" className="text-cyan-200/75 hover:text-cyan-100">Register</a>
      </div>
    </form>
  );
}

function RegisterForm({ onSession }: { onSession: (session: CustomerSession) => void }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [acceptsMarketing, setAcceptsMarketing] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setStatus('');
    try {
      await registerCustomer({ firstName, lastName, email, password, phone, acceptsMarketing });
      const session = await loginCustomer({ email, password });
      onSession(session);
      setStatus('Account created in Shopify. Opening your account...');
      navigate('/account');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create account.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-4">
      <FormHeader icon={UserPlus} title="Register" body="Create a Shopify customer account." />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="First name" value={firstName} onChange={setFirstName} autoComplete="given-name" required />
        <TextField label="Last name" value={lastName} onChange={setLastName} autoComplete="family-name" required />
      </div>
      <TextField label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" required />
      <TextField label="Phone" type="tel" value={phone} onChange={setPhone} autoComplete="tel" />
      <TextField label="Password" type="password" value={password} onChange={setPassword} autoComplete="new-password" required minLength={5} />
      <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white/58">
        <input
          type="checkbox"
          checked={acceptsMarketing}
          onChange={(event) => setAcceptsMarketing(event.target.checked)}
          className="mt-1"
        />
        Send me product education, subscription updates, and store news.
      </label>
      <Feedback error={error} status={status} />
      <button type="submit" disabled={submitting} className="hpe-btn-primary inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium disabled:opacity-50">
        {submitting ? 'Creating account...' : 'Register with Shopify'} <ArrowRight size={14} />
      </button>
      <div className="text-sm text-white/55">
        Already registered? <a href="/login" className="text-cyan-200/75 hover:text-cyan-100">Login</a>
      </div>
    </form>
  );
}

function RecoverForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setStatus('');
    try {
      await recoverCustomerPassword(email);
      setStatus('If that email belongs to a Shopify customer account, Shopify will send password reset instructions.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not start password recovery.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-4">
      <FormHeader icon={Mail} title="Forgot password" body="Send a Shopify password reset email." />
      <TextField label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" required />
      <Feedback error={error} status={status} />
      <button type="submit" disabled={submitting} className="hpe-btn-primary inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium disabled:opacity-50">
        {submitting ? 'Sending...' : 'Send reset email'} <ArrowRight size={14} />
      </button>
      <a href="/login" className="text-sm text-cyan-200/75 hover:text-cyan-100">Back to login</a>
    </form>
  );
}

function CustomerDashboard({ session, onLogout }: { session: CustomerSession; onLogout: () => void }) {
  const customer = session.customer;
  const displayName = getCustomerDisplayName(customer);
  const messageSubject = `Support request from ${displayName}`;

  return (
    <section className="relative min-h-screen overflow-hidden pb-24 pt-32">
      <div className="relative z-10 mx-auto grid max-w-6xl gap-8 px-6 lg:grid-cols-[0.9fr_1.1fr]">
        <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }} className="hpe-glass rounded-2xl p-6 sm:p-8">
          <div className="hpe-hud-label">Logged in</div>
          <h1 className="mt-4 text-4xl font-medium tracking-tight text-white sm:text-5xl">
            Welcome, {displayName}.
          </h1>
          <div className="mt-6 space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm text-white/58">
            <p><span className="text-white/35">Email:</span> {customer?.email ?? 'Connected customer'}</p>
            {customer?.phone && <p><span className="text-white/35">Phone:</span> {customer.phone}</p>}
            <p><span className="text-white/35">Session expires:</span> {new Date(session.expiresAt).toLocaleDateString()}</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="/products" className="hpe-btn-primary inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium">
              Shop DDW <ArrowRight size={14} />
            </a>
            <button type="button" onClick={onLogout} className="hpe-btn-ghost inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium">
              <LogOut size={14} /> Logout
            </button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.06 }} className="hpe-glass rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <MessageCircle className="text-cyan-300" size={18} />
            <div className="hpe-hud-label">Message Shopify Admin</div>
          </div>
          <h2 className="mt-4 text-2xl font-medium text-white">Talk with the store team.</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/55">
            This sends your logged-in customer details with the message so the store admin
            can match the request to the Shopify customer record.
          </p>

          <form action={import.meta.env.VITE_CONTACT_FORM_ENDPOINT || `mailto:${SUPPORT_EMAIL}`} method="post" className="mt-6 grid gap-4">
            <input type="hidden" name="customer_id" value={customer?.id ?? ''} />
            <input type="hidden" name="email" value={customer?.email ?? ''} />
            <input type="hidden" name="subject" value={messageSubject} />
            <label className="grid gap-2 text-sm text-white/70">
              Message
              <textarea
                required
                name="message"
                rows={6}
                className="resize-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-cyan-300/60"
                placeholder="Tell the Shopify admin what you need help with."
              />
            </label>
            <button type="submit" className="hpe-btn-primary inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium">
              Message admin <MessageCircle size={14} />
            </button>
            <a href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(messageSubject)}`} className="text-sm text-cyan-200/75 hover:text-cyan-100">
              Or open email directly
            </a>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

function FormHeader({ icon: Icon, title, body }: { icon: typeof Lock; title: string; body: string }) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/[0.07] text-cyan-200">
          <Icon size={17} />
        </span>
        <div>
          <h2 className="text-2xl font-medium text-white">{title}</h2>
          <p className="mt-1 text-sm text-white/52">{body}</p>
        </div>
      </div>
    </div>
  );
}

function TextField({
  label,
  type = 'text',
  value,
  onChange,
  required,
  autoComplete,
  minLength,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  autoComplete?: string;
  minLength?: number;
}) {
  return (
    <label className="grid gap-2 text-sm text-white/70">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        minLength={minLength}
        autoComplete={autoComplete}
        className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-cyan-300/60"
      />
    </label>
  );
}

function Feedback({ error, status }: { error: string; status: string }) {
  if (!error && !status) return null;
  return (
    <div className={`rounded-xl border p-3 text-sm ${error ? 'border-red-300/20 bg-red-300/[0.06] text-red-100' : 'border-cyan-300/20 bg-cyan-300/[0.06] text-cyan-100'}`}>
      {error || status}
    </div>
  );
}

function navigate(path: string) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}
