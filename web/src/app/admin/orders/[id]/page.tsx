import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminSection } from "@/components/admin/admin-section";
import { addOrderNote, updateOrderState } from "@/lib/admin/actions/orders";
import { getAdminOrderDetail, type AdminOrderAddress } from "@/lib/admin/data";
import { FulfillmentStatus, OrderStatus, PaymentStatus } from "@prisma/client";

function formatMoney(cents: number, currency: string) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function AddressCard({ title, address }: { title: string; address?: AdminOrderAddress | null }) {
  if (!address) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
        No {title.toLowerCase()} address
      </div>
    );
  }

  return (
    <div className="space-y-1 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
      <p className="text-xs uppercase tracking-[0.4em] text-white/60">{title}</p>
      <p>
        {address.firstName} {address.lastName}
      </p>
      <p>{address.line1}</p>
      {address.line2 ? <p>{address.line2}</p> : null}
      <p>
        {address.city} {address.region} {address.postalCode}
      </p>
      <p>{address.country}</p>
      {address.phone ? <p>{address.phone}</p> : null}
    </div>
  );
}

type PageParams = { id: string } | Promise<{ id: string }>;

export default async function AdminOrderDetailPage({ params }: { params: PageParams }) {
  const resolved = await params;
  const order = await getAdminOrderDetail(resolved.id);

  if (!order) {
    notFound();
  }

  const timeline = [...order.events].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  return (
    <div className="space-y-10">
      <AdminSection
        eyebrow="Orders"
        title={`Order ${order.number}`}
        description="Review payment, fulfillment, and operations signals."
        actions={
          <Link
            href="/admin/orders"
            className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70 hover:bg-white/10"
          >
            Back
          </Link>
        }
      >
        <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">Status</p>
            <div className="grid grid-cols-3 gap-3 text-sm text-white/80">
              <div className="rounded-xl border border-white/10 bg-black/30 p-3">
                <p className="text-[0.65rem] uppercase tracking-[0.35em] text-white/50">Order</p>
                <p className="text-lg text-white">{order.status}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/30 p-3">
                <p className="text-[0.65rem] uppercase tracking-[0.35em] text-white/50">Fulfillment</p>
                <p className="text-lg text-white">{order.fulfillmentStatus}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/30 p-3">
                <p className="text-[0.65rem] uppercase tracking-[0.35em] text-white/50">Payment</p>
                <p className="text-lg text-white">{order.paymentStatus}</p>
              </div>
            </div>

            <form action={updateOrderState} className="space-y-3 text-sm text-white/80">
              <input type="hidden" name="orderId" value={order.id} />
              <div className="grid gap-3 md:grid-cols-3">
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.3em] text-white/60">Order status</span>
                  <select
                    name="status"
                    defaultValue={order.status}
                    className="w-full rounded-xl border border-white/15 bg-black/30 px-3 py-2"
                  >
                    {Object.values(OrderStatus).map((status) => (
                      <option key={status} value={status} className="bg-black text-white">
                        {status}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.3em] text-white/60">Fulfillment</span>
                  <select
                    name="fulfillmentStatus"
                    defaultValue={order.fulfillmentStatus}
                    className="w-full rounded-xl border border-white/15 bg-black/30 px-3 py-2"
                  >
                    {Object.values(FulfillmentStatus).map((status) => (
                      <option key={status} value={status} className="bg-black text-white">
                        {status}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.3em] text-white/60">Payment</span>
                  <select
                    name="paymentStatus"
                    defaultValue={order.paymentStatus}
                    className="w-full rounded-xl border border-white/15 bg-black/30 px-3 py-2"
                  >
                    {Object.values(PaymentStatus).map((status) => (
                      <option key={status} value={status} className="bg-black text-white">
                        {status}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="space-y-2">
                <span className="text-xs uppercase tracking-[0.3em] text-white/60">Note (optional, saved)</span>
                <textarea
                  name="note"
                  rows={2}
                  className="w-full rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-white"
                  placeholder="White-glove delivery scheduled Tuesday"
                />
              </label>
              <button
                type="submit"
                className="rounded-full bg-white px-4 py-2 text-xs uppercase tracking-[0.3em] text-black transition hover:scale-[1.02]"
              >
                Save updates
              </button>
            </form>
          </div>

          <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/80">
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">Totals</p>
            <div className="space-y-2 text-white">
              <div className="flex items-center justify-between text-white/80">
                <span>Subtotal</span>
                <span>{formatMoney(order.subtotalCents, order.currency)}</span>
              </div>
              <div className="flex items-center justify-between text-white/80">
                <span>Shipping</span>
                <span>{formatMoney(order.shippingCents, order.currency)}</span>
              </div>
              <div className="flex items-center justify-between text-white/80">
                <span>Tax</span>
                <span>{formatMoney(order.taxCents, order.currency)}</span>
              </div>
              <div className="flex items-center justify-between text-white/80">
                <span>Duties</span>
                <span>{formatMoney(order.dutiesCents, order.currency)}</span>
              </div>
              {order.personalizationFeeCents ? (
                <div className="flex items-center justify-between text-white/80">
                  <span>Personalization</span>
                  <span>{formatMoney(order.personalizationFeeCents, order.currency)}</span>
                </div>
              ) : null}
              <div className="flex items-center justify-between text-lg font-semibold text-white">
                <span>Total</span>
                <span>{formatMoney(order.totalCents, order.currency)}</span>
              </div>
            </div>
            <p className="text-xs uppercase tracking-[0.35em] text-white/60">
              Placed {formatDateTime(order.placedAt)} {order.whiteGlove ? "· White glove" : ""}
            </p>
          </div>
        </div>
      </AdminSection>

      <AdminSection
        eyebrow="Logistics"
        title="Addresses & items"
        description="Shipping, billing, and line items."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <AddressCard title="Shipping" address={order.shippingAddress} />
          <AddressCard title="Billing" address={order.billingAddress} />
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
          <table className="w-full text-sm text-white/80">
            <thead className="bg-white/5 text-[0.7rem] uppercase tracking-[0.35em] text-white/60">
              <tr>
                <th className="px-4 py-3 text-left">Item</th>
                <th className="px-4 py-3 text-left">SKU</th>
                <th className="px-4 py-3 text-left">Qty</th>
                <th className="px-4 py-3 text-left">Unit</th>
                <th className="px-4 py-3 text-left">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {order.items.map((item) => (
                <tr key={item.id} className="hover:bg-white/5">
                  <td className="px-4 py-3 text-white">
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-xs uppercase tracking-[0.35em] text-white/60">
                      {[item.color, item.size].filter(Boolean).join(" / ") || "—"}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-white/70">{item.sku}</td>
                  <td className="px-4 py-3">{item.quantity}</td>
                  <td className="px-4 py-3">{formatMoney(item.unitPriceCents, order.currency)}</td>
                  <td className="px-4 py-3 text-white/60">
                    {item.personalizationNotes || item.monogram || "—"}
                  </td>
                </tr>
              ))}
              {order.items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-4 text-center text-white/60">
                    No items on this order
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </AdminSection>

      <AdminSection
        eyebrow="Operations"
        title="Timeline"
        description="Payments, notes, and milestone history."
        actions={
          <form action={addOrderNote} className="flex items-center gap-3">
            <input type="hidden" name="orderId" value={order.id} />
            <input
              name="note"
              className="w-64 rounded-xl border border-white/20 bg-black/30 px-3 py-2 text-sm text-white"
              placeholder="Add internal note"
            />
            <button
              type="submit"
              className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/80 hover:bg-white/10"
            >
              Save note
            </button>
          </form>
        }
      >
        <div className="space-y-3">
          {timeline.map((event) => (
            <div
              key={event.id}
              className="flex items-start justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80"
            >
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.35em] text-white/60">{event.type}</p>
                <p className="text-white">{event.title}</p>
                {event.detail ? <p className="text-white/70">{event.detail}</p> : null}
              </div>
              <p className="text-xs uppercase tracking-[0.35em] text-white/50">{formatDateTime(event.createdAt)}</p>
            </div>
          ))}
          {timeline.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/60">
              No events yet.
            </div>
          ) : null}
        </div>
      </AdminSection>
    </div>
  );
}
