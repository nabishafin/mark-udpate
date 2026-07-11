import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ExternalLink, ListOrdered, PackageCheck, ReceiptText, Truck } from 'lucide-react';
import {
  CustomerSession,
  ShopifyCustomerOrder,
  ShopifyMailingAddress,
  ShopifyMoney,
  getCustomerDisplayName,
  getCustomerOrder,
  getCustomerOrders,
  getStoredCustomerSession,
  onCustomerSessionChange,
} from '../lib/customer';
import { forceShopifyCheckoutDomain } from '../lib/shopify';

type OrdersPageProps = {
  orderId?: string;
};

export function OrdersPage({ orderId }: OrdersPageProps) {
  const [session, setSession] = useState<CustomerSession | null>(() => getStoredCustomerSession());
  const [orders, setOrders] = useState<ShopifyCustomerOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<ShopifyCustomerOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const decodedOrderId = orderId ? decodeURIComponent(orderId) : '';
  const accessToken = session?.accessToken ?? '';
  const customerName = getCustomerDisplayName(session?.customer);

  useEffect(() => onCustomerSessionChange(() => setSession(getStoredCustomerSession())), []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    setSelectedOrder(null);
    setOrders([]);

    if (!accessToken) {
      setLoading(false);
      return () => {
        active = false;
      };
    }

    const request = decodedOrderId
      ? getCustomerOrder(accessToken, decodedOrderId).then((order) => {
          if (active) setSelectedOrder(order);
        })
      : getCustomerOrders(accessToken).then((nextOrders) => {
          if (active) setOrders(nextOrders);
        });

    request
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : 'Could not load orders.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [accessToken, decodedOrderId]);

  if (!session) {
    return (
      <section className="relative min-h-screen overflow-hidden pb-24 pt-32">
        <div className="relative z-10 mx-auto max-w-xl px-6 text-center">
          <div className="hpe-hud-label">Customer Account</div>
          <h1 className="mt-4 text-4xl font-medium tracking-tight text-white">Login required</h1>
          <p className="mt-4 text-sm leading-relaxed text-white/55">
            Sign in to your account to view order status and account-specific order details.
          </p>
          <a href="/login" className="hpe-btn-primary mt-8 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium">
            Login <ArrowRight size={14} />
          </a>
        </div>
      </section>
    );
  }

  if (decodedOrderId) {
    return (
      <OrderStatusView
        loading={loading}
        error={error}
        order={selectedOrder}
        customerName={customerName}
      />
    );
  }

  return (
    <section className="relative min-h-screen overflow-hidden pb-24 pt-32">
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <PageHeader
          eyebrow="Orders"
          title="All orders"
          body="Every order shown here is loaded securely from your customer account."
          backHref="/account"
          backLabel="Back to account"
        />

        {loading ? (
          <LoadingPanel label="Loading orders..." />
        ) : error ? (
          <ErrorPanel message={error} />
        ) : orders.length ? (
          <div className="mt-10 grid gap-4">
            {orders.map((order) => (
              <OrderSummaryCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <EmptyPanel />
        )}
      </div>
    </section>
  );
}

function OrderStatusView({
  loading,
  error,
  order,
  customerName,
}: {
  loading: boolean;
  error: string;
  order: ShopifyCustomerOrder | null;
  customerName: string;
}) {
  if (loading) {
    return (
      <section className="relative min-h-screen overflow-hidden pb-24 pt-32">
        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <PageHeader eyebrow="Order Status" title="Loading order" body="Pulling the latest order status." backHref="/account/orders" backLabel="All orders" />
          <LoadingPanel label="Loading order status..." />
        </div>
      </section>
    );
  }

  if (error || !order) {
    return (
      <section className="relative min-h-screen overflow-hidden pb-24 pt-32">
        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <PageHeader eyebrow="Order Status" title="Order not found" body="This order is not available for the signed-in customer." backHref="/account/orders" backLabel="All orders" />
          <ErrorPanel message={error || 'This order is not available for the current customer account.'} />
        </div>
      </section>
    );
  }

  const fulfillments = order.successfulFulfillments ?? [];
  const lineItems = order.lineItems?.nodes ?? [];
  const shopifyStatusUrl = getShopifyStatusUrl(order.statusUrl);

  return (
    <section className="relative min-h-screen overflow-hidden pb-24 pt-32">
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <PageHeader
          eyebrow="Order Status"
          title={order.name}
          body={`Latest order details for ${customerName}.`}
          backHref="/account/orders"
          backLabel="All orders"
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="hpe-glass rounded-2xl p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="hpe-hud-label">Status</div>
                <h1 className="mt-3 text-3xl font-medium text-white">{order.name}</h1>
                <p className="mt-2 text-sm text-white/50">
                  Placed {formatDate(order.processedAt)} · Order #{order.orderNumber}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusPill label={formatStatus(order.financialStatus || 'Payment pending')} />
                <StatusPill label={formatStatus(order.fulfillmentStatus || 'Fulfillment pending')} />
              </div>
            </div>

            {order.canceledAt && (
              <div className="mt-5 rounded-xl border border-red-300/20 bg-red-300/[0.06] p-4 text-sm text-red-100">
                Canceled {formatDate(order.canceledAt)}{order.cancelReason ? ` · ${formatStatus(order.cancelReason)}` : ''}
              </div>
            )}

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <Metric icon={ReceiptText} label="Total" value={formatMoney(order.currentTotalPrice || order.totalPrice)} />
              <Metric icon={Truck} label="Shipping" value={formatMoney(order.currentTotalShippingPrice || order.totalShippingPrice)} />
              <Metric icon={PackageCheck} label="Tax" value={formatMoney(order.currentTotalTax || order.totalTax)} />
            </div>

            <div className="mt-8">
              <h2 className="text-sm font-medium uppercase tracking-widest text-white/45">Items</h2>
              <ul className="mt-4 space-y-3">
                {lineItems.map((item) => (
                  <li key={`${item.title}-${item.variant?.id ?? item.quantity}`} className="flex gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="h-16 w-14 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white">
                      {item.variant?.image?.url ? (
                        <img src={item.variant.image.url} alt={item.variant.image.altText || item.title} className="h-full w-full object-contain p-1.5" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[#071017]">
                          <PackageCheck size={18} />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white">{item.title}</p>
                      {item.variant?.title && <p className="mt-1 text-xs text-white/42">{item.variant.title}</p>}
                      <p className="mt-2 text-xs text-white/45">Qty {item.quantity} · Current qty {item.currentQuantity}</p>
                    </div>
                    <div className="shrink-0 font-mono text-sm text-white/75">
                      {formatMoney(item.discountedTotalPrice || item.originalTotalPrice)}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          <motion.aside initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.05 }} className="space-y-6">
            <div className="hpe-glass rounded-2xl p-6">
              <div className="hpe-hud-label">Tracking</div>
              {fulfillments.length ? (
                <div className="mt-4 space-y-4">
                  {fulfillments.map((fulfillment, index) => (
                    <div key={`${fulfillment.trackingCompany || 'fulfillment'}-${index}`} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-sm font-medium text-white">{fulfillment.trackingCompany || 'Order fulfillment'}</p>
                      {fulfillment.trackingInfo.length ? (
                        <div className="mt-3 space-y-2">
                          {fulfillment.trackingInfo.map((tracking) => (
                            <a
                              key={`${tracking.number}-${tracking.url}`}
                              href={getShopifyStatusUrl(tracking.url || order.statusUrl)}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center justify-between gap-3 rounded-lg border border-cyan-300/15 bg-cyan-300/[0.05] px-3 py-2 text-sm text-cyan-100"
                            >
                              <span>{tracking.number || 'Track shipment'}</span>
                              <ExternalLink size={13} />
                            </a>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-2 text-sm text-white/45">Tracking has not been added yet.</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm leading-relaxed text-white/50">
                  No successful fulfillment or tracking number has been added yet.
                </p>
              )}
              {shopifyStatusUrl && (
                <a href={shopifyStatusUrl} target="_blank" rel="noreferrer" className="hpe-btn-primary mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium">
                  Open order status <ExternalLink size={14} />
                </a>
              )}
            </div>

            <TotalsCard order={order} />
            <AddressCard title="Shipping address" address={order.shippingAddress} />
            <AddressCard title="Billing address" address={order.billingAddress} />
          </motion.aside>
        </div>
      </div>
    </section>
  );
}

function PageHeader({ eyebrow, title, body, backHref, backLabel }: { eyebrow: string; title: string; body: string; backHref: string; backLabel: string }) {
  return (
    <div>
      <a href={backHref} className="inline-flex items-center gap-2 text-sm text-cyan-200/70 hover:text-cyan-100">
        <ArrowLeft size={14} /> {backLabel}
      </a>
      <div className="mt-6 hpe-hud-label">{eyebrow}</div>
      <h1 className="mt-4 text-4xl font-medium tracking-tight text-white sm:text-6xl">{title}</h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/55 sm:text-base">{body}</p>
    </div>
  );
}

function OrderSummaryCard({ order }: { order: ShopifyCustomerOrder }) {
  return (
    <motion.article initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="hpe-glass rounded-2xl p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-medium text-white">{order.name}</h2>
          <p className="mt-1 text-sm text-white/45">Placed {formatDate(order.processedAt)} · Order #{order.orderNumber}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <StatusPill label={formatStatus(order.financialStatus || 'Payment pending')} />
            <StatusPill label={formatStatus(order.fulfillmentStatus || 'Fulfillment pending')} />
          </div>
        </div>
        <div className="text-right">
          <p className="font-mono text-lg text-white">{formatMoney(order.currentTotalPrice || order.totalPrice)}</p>
          <a href={`/account/orders/${encodeURIComponent(order.id)}`} className="mt-4 inline-flex items-center gap-2 text-sm text-cyan-200/75 hover:text-cyan-100">
            View order status <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </motion.article>
  );
}

function TotalsCard({ order }: { order: ShopifyCustomerOrder }) {
  const rows = [
    ['Subtotal', order.currentSubtotalPrice],
    ['Shipping', order.currentTotalShippingPrice || order.totalShippingPrice],
    ['Tax', order.currentTotalTax || order.totalTax],
    ['Refunded', order.totalRefunded],
    ['Total', order.currentTotalPrice || order.totalPrice],
  ] as const;

  return (
    <div className="hpe-glass rounded-2xl p-6">
      <div className="hpe-hud-label">Order totals</div>
      <div className="mt-4 space-y-2.5 text-sm">
        {rows.map(([label, money]) => (
          <div key={label} className="flex justify-between gap-4 text-white/55">
            <span>{label}</span>
            <span className="font-mono text-white">{formatMoney(money)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AddressCard({ title, address }: { title: string; address?: ShopifyMailingAddress | null }) {
  return (
    <div className="hpe-glass rounded-2xl p-6">
      <div className="hpe-hud-label">{title}</div>
      {address ? (
        <address className="mt-4 not-italic text-sm leading-relaxed text-white/60">
          {[address.firstName, address.lastName].filter(Boolean).join(' ')}<br />
          {address.address1}<br />
          {address.address2 && <>{address.address2}<br /></>}
          {[address.city, address.province, address.zip].filter(Boolean).join(', ')}<br />
          {address.country}
          {address.phone && <><br />{address.phone}</>}
        </address>
      ) : (
        <p className="mt-4 text-sm text-white/45">No {title.toLowerCase()} available for this order.</p>
      )}
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof ReceiptText; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <Icon className="text-cyan-300" size={16} />
      <p className="mt-3 text-xs uppercase tracking-widest text-white/35">{label}</p>
      <p className="mt-1 font-mono text-sm text-white">{value}</p>
    </div>
  );
}

function StatusPill({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-cyan-300/20 bg-cyan-300/[0.06] px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-cyan-100/80">
      {label}
    </span>
  );
}

function LoadingPanel({ label }: { label: string }) {
  return (
    <div className="hpe-glass mt-10 flex flex-col items-center justify-center gap-4 rounded-2xl p-12 text-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-cyan-300" />
      <p className="text-sm text-white/50">{label}</p>
    </div>
  );
}

function ErrorPanel({ message }: { message: string }) {
  return (
    <div className="mt-10 rounded-xl border border-red-300/25 bg-red-300/[0.06] p-4 text-sm text-red-100">
      {message}
    </div>
  );
}

function EmptyPanel() {
  return (
    <div className="hpe-glass mt-10 rounded-2xl p-10 text-center">
      <ListOrdered className="mx-auto text-cyan-300" size={30} />
      <h2 className="mt-5 text-2xl font-medium text-white">No orders yet</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/50">
        Orders will appear here after checkout is completed.
      </p>
      <a href="/products" className="hpe-btn-primary mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium">
        Shop DDW <ArrowRight size={14} />
      </a>
    </div>
  );
}

function formatMoney(money?: ShopifyMoney | null) {
  if (!money?.amount) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: money.currencyCode || 'USD',
  }).format(Number(money.amount));
}

function formatDate(value?: string | null) {
  if (!value) return 'date unavailable';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

function formatStatus(value: string) {
  return value.replace(/_/g, ' ').toLowerCase();
}

function getShopifyStatusUrl(value?: string | null) {
  if (!value) return undefined;

  try {
    return forceShopifyCheckoutDomain(value, 'order_status');
  } catch {
    return value;
  }
}
