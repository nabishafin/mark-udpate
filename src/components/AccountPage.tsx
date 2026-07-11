import { FormEvent, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Eye, EyeOff, KeyRound, ListOrdered, Lock, LogOut, Mail, ShieldCheck, UserPlus } from 'lucide-react';
import {
  CustomerSession,
  ShopifyCustomerOrder,
  clearCustomerSession,
  getCustomer,
  getCustomerDisplayName,
  getCustomerOrders,
  getStoredCustomerSession,
  loginCustomer,
  normalizeCustomerResetUrl,
  onCustomerSessionChange,
  recoverCustomerPassword,
  registerCustomer,
  resetCustomerPasswordByUrl,
  saveCustomerSession,
  updateCustomerPassword,
  updateCustomerProfile,
} from '../lib/customer';

type AuthMode = 'login' | 'register' | 'recover' | 'reset' | 'account';

type Props = {
  mode: AuthMode;
};

export function AccountPage({ mode }: Props) {
  const [session, setSession] = useState<CustomerSession | null>(() => getStoredCustomerSession());
  const isAccount = mode === 'account';

  useEffect(() => {
    let mounted = true;

    const syncSession = () => {
      const active = getStoredCustomerSession();
      if (!mounted) return;
      setSession(active);
      if (!active || active.customer) return;

      getCustomer(active.accessToken)
        .then((customer) => {
          const current = getStoredCustomerSession();
          if (!mounted || !current || current.accessToken !== active.accessToken) return;
          const updated = { ...current, customer };
          saveCustomerSession(updated);
          setSession(updated);
        })
        .catch(() => undefined);
    };

    syncSession();
    const unsubscribe = onCustomerSessionChange(syncSession);

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [mode]);

  if (isAccount && session) {
    return <CustomerDashboard session={session} onSessionChange={setSession} onLogout={() => { clearCustomerSession(); setSession(null); }} />;
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
          {mode === 'register'
            ? <RegisterForm onSession={setSession} />
            : mode === 'recover'
              ? <RecoverForm />
              : mode === 'reset'
                ? <ResetPasswordForm onSession={setSession} />
                : <LoginForm onSession={setSession} />}
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
      <TextField label="Password" type="password" value={password} onChange={setPassword} autoComplete="current-password" required revealable />
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
      <TextField label="Password" type="password" value={password} onChange={setPassword} autoComplete="new-password" required minLength={5} revealable />
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
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const timer = window.setInterval(() => {
      setCooldown((current) => Math.max(0, current - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [cooldown]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (cooldown > 0) return;
    setSubmitting(true);
    setError('');
    setStatus('');
    try {
      await recoverCustomerPassword(email);
      setCooldown(50);
      setStatus('If that email belongs to a Shopify customer account, Shopify will send a password reset link.');
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
      <button type="submit" disabled={submitting || cooldown > 0} className="hpe-btn-primary inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium disabled:opacity-50">
        {submitting ? 'Sending...' : cooldown > 0 ? `Send again in ${cooldown}s` : 'Send reset email'} <ArrowRight size={14} />
      </button>
      <div className="flex flex-wrap gap-3 text-sm text-white/55">
        <a href="/login" className="text-cyan-200/75 hover:text-cyan-100">Back to login</a>
      </div>
    </form>
  );
}

function getResetUrlFromLocation() {
  const params = new URLSearchParams(window.location.search);
  const resetUrlParam = params.get('reset_url') || params.get('resetUrl') || params.get('url');
  if (resetUrlParam) return normalizeCustomerResetUrl(resetUrlParam);
  if (/\/account\/reset\//.test(window.location.pathname)) return normalizeCustomerResetUrl(window.location.href);
  return '';
}

function ResetPasswordForm({ onSession }: { onSession: (session: CustomerSession) => void }) {
  const [resetUrl, setResetUrl] = useState(() => {
    try {
      return getResetUrlFromLocation();
    } catch {
      return '';
    }
  });
  const [email, setEmail] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState('');
  const [resendError, setResendError] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!resetUrl) return;
    window.history.replaceState({}, '', '/reset-password');
  }, [resetUrl]);

  useEffect(() => {
    if (resendCooldown <= 0) return undefined;
    const timer = window.setInterval(() => {
      setResendCooldown((current) => Math.max(0, current - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [resendCooldown]);

  const resend = async (event: FormEvent) => {
    event.preventDefault();
    if (resendCooldown > 0) return;
    setResending(true);
    setResendStatus('');
    setResendError('');

    try {
      await recoverCustomerPassword(email);
      setResendCooldown(50);
      setResendStatus('If that email belongs to a Shopify customer account, Shopify will send a new reset link.');
    } catch (err) {
      setResendError(err instanceof Error ? err.message : 'Could not send a new Shopify reset link.');
    } finally {
      setResending(false);
    }
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setStatus('');
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      const session = await resetCustomerPasswordByUrl(resetUrl, password);
      onSession(session);
      setResetUrl('');
      setPassword('');
      setConfirmPassword('');
      setStatus('Password changed successfully. Your account is now signed in.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not reset password with this Shopify reset link.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid gap-4">
      <FormHeader icon={KeyRound} title="Reset password" body="Set a new password from the secure link sent to your email." />
      {resetUrl ? (
        <form onSubmit={submit} className="grid gap-4">
          <div className="rounded-xl border border-cyan-300/20 bg-cyan-300/[0.06] p-3 text-sm leading-relaxed text-cyan-100">
            Secure reset link verified. The token was removed from the address bar.
          </div>
          <TextField label="New password" type="password" value={password} onChange={setPassword} autoComplete="new-password" required minLength={5} revealable />
          <TextField label="Confirm new password" type="password" value={confirmPassword} onChange={setConfirmPassword} autoComplete="new-password" required minLength={5} revealable />
          <Feedback error={error} status={status} />
          {status ? (
            <a href="/account" className="hpe-btn-primary inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium">
              Open account <ArrowRight size={14} />
            </a>
          ) : (
            <button type="submit" disabled={submitting} className="hpe-btn-primary inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium disabled:opacity-50">
              {submitting ? 'Saving...' : 'Set new password'} <ArrowRight size={14} />
            </button>
          )}
        </form>
      ) : (
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-relaxed text-white/58">
          Open the reset link from your email to continue. For security, this page does not accept pasted reset links.
        </div>
      )}
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <p className="text-sm font-medium text-white">Need a new Shopify reset link?</p>
        <form onSubmit={resend} className="mt-3 grid gap-3">
          <TextField label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" required />
          <button type="submit" disabled={resending || resendCooldown > 0} className="hpe-btn-ghost inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium disabled:opacity-50">
            {resending ? 'Sending...' : resendCooldown > 0 ? `Send again in ${resendCooldown}s` : 'Send new reset link'} <ArrowRight size={14} />
          </button>
        </form>
        <Feedback error={resendError} status={resendStatus} />
      </div>
    </div>
  );
}

function CustomerDashboard({
  session,
  onSessionChange,
  onLogout,
}: {
  session: CustomerSession;
  onSessionChange: (session: CustomerSession) => void;
  onLogout: () => void;
}) {
  const customer = session.customer;
  const displayName = getCustomerDisplayName(customer);
  const [orders, setOrders] = useState<ShopifyCustomerOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getCustomerOrders(session.accessToken)
      .then((nextOrders) => {
        if (active) setOrders(nextOrders);
      })
      .catch(() => {
        if (active) setOrders([]);
      })
      .finally(() => {
        if (active) setOrdersLoading(false);
      });

    return () => {
      active = false;
    };
  }, [session.accessToken]);

  return (
    <section className="relative min-h-screen overflow-hidden pb-24 pt-32">
      <div className="relative z-10 mx-auto grid max-w-6xl gap-8 px-6 lg:grid-cols-[0.95fr_1.05fr]">
        <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }} className="hpe-glass rounded-2xl p-6 sm:p-8">
          <div className="hpe-hud-label">Logged in</div>
          <h1 className="mt-4 text-4xl font-medium tracking-tight text-white sm:text-5xl">
            Welcome, {displayName}.
          </h1>
          <div className="mt-6 space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm text-white/58">
            <p><span className="text-white/35">Email:</span> {customer?.email ?? 'Connected customer'}</p>
            {customer?.phone && <p><span className="text-white/35">Phone:</span> {customer.phone}</p>}
            {customer?.numberOfOrders && <p><span className="text-white/35">Shopify orders:</span> {customer.numberOfOrders}</p>}
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

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-sm font-medium uppercase tracking-widest text-white/45">Recent Shopify orders</h2>
              <a href="/account/orders" className="inline-flex items-center gap-2 text-sm text-cyan-200/75 hover:text-cyan-100">
                Check all orders <ListOrdered size={14} />
              </a>
            </div>
            {ordersLoading ? (
              <p className="mt-4 text-sm text-white/45">Loading order history...</p>
            ) : orders.length ? (
              <ul className="mt-4 space-y-3">
                {orders.slice(0, 3).map((order) => (
                  <li key={order.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-white">{order.name || `Order #${order.orderNumber}`}</p>
                        {order.processedAt && (
                          <p className="mt-1 text-xs text-white/42">{new Date(order.processedAt).toLocaleDateString()}</p>
                        )}
                      </div>
                      {order.totalPrice && (
                        <p className="font-mono text-sm text-white/75">
                          {formatShopifyMoney(order.totalPrice)}
                        </p>
                      )}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 text-[11px] uppercase tracking-wider text-white/38">
                      {order.financialStatus && <span>{order.financialStatus.replace(/_/g, ' ')}</span>}
                      {order.fulfillmentStatus && <span>{order.fulfillmentStatus.replace(/_/g, ' ')}</span>}
                    </div>
                    <a href={`/account/orders/${encodeURIComponent(order.id)}`} className="mt-3 inline-block text-sm text-cyan-200/75 hover:text-cyan-100">
                      View order status
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-white/45">No Shopify orders found for this account yet.</p>
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.06 }} className="space-y-6">
          <ProfileForm session={session} onSessionChange={onSessionChange} />
          <PasswordForm session={session} onSessionChange={onSessionChange} />
        </motion.div>
      </div>
    </section>
  );
}

function ProfileForm({ session, onSessionChange }: { session: CustomerSession; onSessionChange: (session: CustomerSession) => void }) {
  const customer = session.customer;
  const [firstName, setFirstName] = useState(customer?.firstName ?? '');
  const [lastName, setLastName] = useState(customer?.lastName ?? '');
  const [email, setEmail] = useState(customer?.email ?? '');
  const [phone, setPhone] = useState(customer?.phone ?? '');
  const [acceptsMarketing, setAcceptsMarketing] = useState(Boolean(customer?.acceptsMarketing));
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus('');
    setError('');

    try {
      const updated = await updateCustomerProfile(session.accessToken, {
        firstName,
        lastName,
        email,
        phone: phone || undefined,
        acceptsMarketing,
      }, session.expiresAt);
      onSessionChange(updated);
      setStatus('Your Shopify account information was updated.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update your account information.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="hpe-glass grid gap-4 rounded-2xl p-6 sm:p-8">
      <FormHeader icon={UserPlus} title="Account information" body="Update your Shopify customer profile." />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="First name" value={firstName} onChange={setFirstName} autoComplete="given-name" required />
        <TextField label="Last name" value={lastName} onChange={setLastName} autoComplete="family-name" required />
      </div>
      <TextField label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" required />
      <TextField label="Phone" type="tel" value={phone} onChange={setPhone} autoComplete="tel" />
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
        {submitting ? 'Saving...' : 'Save account information'} <ArrowRight size={14} />
      </button>
    </form>
  );
}

function PasswordForm({ session, onSessionChange }: { session: CustomerSession; onSessionChange: (session: CustomerSession) => void }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setStatus('');
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      const updated = await updateCustomerPassword(session.accessToken, password);
      onSessionChange(updated);
      setPassword('');
      setConfirmPassword('');
      setStatus('Password changed in Shopify. Your session was refreshed.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not change password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="hpe-glass grid gap-4 rounded-2xl p-6 sm:p-8">
      <FormHeader icon={KeyRound} title="Change password" body="Update your Shopify customer password." />
      <TextField label="New password" type="password" value={password} onChange={setPassword} autoComplete="new-password" required minLength={5} revealable />
      <TextField label="Confirm new password" type="password" value={confirmPassword} onChange={setConfirmPassword} autoComplete="new-password" required minLength={5} revealable />
      <Feedback error={error} status={status} />
      <button type="submit" disabled={submitting} className="hpe-btn-primary inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium disabled:opacity-50">
        {submitting ? 'Changing...' : 'Change password'} <ArrowRight size={14} />
      </button>
    </form>
  );
}

function formatShopifyMoney(money: { amount: string; currencyCode: string }) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: money.currencyCode || 'USD',
  }).format(Number(money.amount));
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
  revealable,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  autoComplete?: string;
  minLength?: number;
  revealable?: boolean;
}) {
  const [visible, setVisible] = useState(false);
  const inputType = revealable && type === 'password' && visible ? 'text' : type;

  return (
    <label className="grid gap-2 text-sm text-white/70">
      {label}
      <span className="relative">
        <input
          type={inputType}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required={required}
          minLength={minLength}
          autoComplete={autoComplete}
          className={`w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-cyan-300/60 ${revealable ? 'pr-12' : ''}`}
        />
        {revealable && type === 'password' && (
          <button
            type="button"
            aria-label={visible ? 'Hide password' : 'Show password'}
            onClick={() => setVisible((current) => !current)}
            className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-white/45 transition hover:bg-white/[0.06] hover:text-white"
          >
            {visible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </span>
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
