import Link from "next/link";
import { ArrowUpRight, CreditCard, Truck } from "lucide-react";
import { AdminSection } from "@/components/admin/admin-section";
import { getAdminOrders } from "@/lib/admin/data";

function formatEur(cents: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  return (
    <div className="space-y-10">
      <AdminSection
        eyebrow="Commerce"
        title="Orders"
        description="Track payments, fulfillment, and white-glove appointments."
        actions={
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70">
            <CreditCard size={14} /> Stripe Console
          </div>
        }
      >
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <table className="w-full text-sm text-white/80">
            <thead className="bg-white/5 text-[0.7rem] uppercase tracking-[0.35em] text-white/60">
              <tr>
                <th className="px-4 py-3 text-left">Order</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Fulfillment</th>
                <th className="px-4 py-3 text-left">Client</th>
                <th className="px-4 py-3 text-left">Total</th>
                <th className="px-4 py-3 text-right">Open</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-white/5">
                  <td className="px-4 py-3 font-medium text-white">{order.number}</td>
                  <td className="px-4 py-3 text-xs uppercase tracking-[0.3em] text-white/70">{order.status}</td>
                  <td className="px-4 py-3 text-white/70">{order.fulfillmentStatus}</td>
                  <td className="px-4 py-3 text-white/60">{order.customer ?? "Guest"}</td>
                  <td className="px-4 py-3 text-white">{formatEur(order.totalCents)}</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/orders/${order.id}`} className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.3em] text-white/70 hover:text-white">
                      Open <ArrowUpRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-white/60">
                    No orders yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </AdminSection>

      <AdminSection
        eyebrow="Logistics"
        title="Fulfillment signals"
        description="Watch low stock and delivery milestones."
        actions={
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70">
            <Truck size={14} /> Export CSV
          </div>
        }
      >
        <ul className="space-y-2 text-sm text-white/80">
          {orders.slice(0, 3).map((order) => (
            <li key={order.id} className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-white/50" />
              <span>
                {order.fulfillmentStatus === "NOT_STARTED" ? "Start" : "Track"} {order.number} · {order.status}
              </span>
            </li>
          ))}
          {orders.length === 0 ? (
            <li className="text-white/60">No fulfillment signals yet.</li>
          ) : null}
        </ul>
      </AdminSection>
    </div>
  );
}
