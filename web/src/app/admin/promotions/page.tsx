import Link from "next/link";
import { ArrowUpRight, BadgePercent, Plus } from "lucide-react";
import { AdminSection } from "@/components/admin/admin-section";
import { getAdminPromotions } from "@/lib/admin/data";

export default async function AdminPromotionsPage() {
  const promos = await getAdminPromotions();

  return (
    <div className="space-y-10">
      <AdminSection
        eyebrow="Commerce"
        title="Promotions"
        description="Codes, thresholds, and limited-edition rules."
        actions={
          <Link
            href="/admin/promotions/new"
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs uppercase tracking-[0.3em] text-black transition hover:scale-[1.02]"
          >
            <Plus size={14} /> New code
          </Link>
        }
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {promos.map((promo) => (
            <div
              key={promo.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
            >
              <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/70">
                <span>{promo.startsAt && promo.startsAt > new Date() ? "Scheduled" : "Active"}</span>
                <span className="rounded-full bg-white/10 px-3 py-1">{promo.localeLabel}</span>
              </div>
              <h3 className="font-display text-xl text-white">{promo.code}</h3>
              <p className="mt-2 text-xs uppercase tracking-[0.3em] text-white/60">
                {promo.startsAt ? `From ${promo.startsAt.toLocaleDateString()}` : "Live"}
              </p>
              <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/70">
                <Link href={`/admin/promotions/${promo.id}`} className="inline-flex items-center gap-1 hover:text-white">
                  Open <ArrowUpRight size={14} />
                </Link>
                <span className="rounded-full bg-white/10 px-3 py-1">Rules</span>
              </div>
            </div>
          ))}
          {promos.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-white/60">
              No promotions configured.
            </div>
          ) : null}
        </div>
      </AdminSection>

      <AdminSection
        eyebrow="Guardrails"
        title="Eligibility"
        description="Locale constraints and limited-edition exclusions."
        actions={
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70">
            <BadgePercent size={14} /> Configure
          </div>
        }
      >
        <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.3em] text-white/70">
          {["Locale aware", "Limited-only", "Stacking rules", "One-per-client"].map((rule) => (
            <span key={rule} className="rounded-full bg-white/10 px-4 py-2">
              {rule}
            </span>
          ))}
        </div>
      </AdminSection>
    </div>
  );
}
