import Link from "next/link";
import { AlarmClock, ArrowUpRight, Plus } from "lucide-react";
import { AdminSection } from "@/components/admin/admin-section";
import { getAdminDrops } from "@/lib/admin/data";

export default async function AdminDropsPage() {
  const drops = await getAdminDrops();

  return (
    <div className="space-y-10">
      <AdminSection
        eyebrow="Limited"
        title="Drops"
        description="Schedule capsules, manage waitlists, and publish windows."
        actions={
          <Link
            href="/admin/drops/new"
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs uppercase tracking-[0.3em] text-black transition hover:scale-[1.02]"
          >
            <Plus size={14} /> New drop
          </Link>
        }
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {drops.map((drop) => (
            <div
              key={drop.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
            >
              <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/70">
                <span>{drop.status}</span>
                <span className="rounded-full bg-white/10 px-3 py-1">{drop.locale ?? "All"}</span>
              </div>
              <h3 className="font-display text-xl text-white">{drop.title}</h3>
              <p className="text-sm text-white/70">{drop.window}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.3em] text-white/60">Waitlist {drop.waitlist}</p>
              <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/70">
                <Link href={`/admin/drops/${drop.id}`} className="inline-flex items-center gap-1 hover:text-white">
                  Open <ArrowUpRight size={14} />
                </Link>
                <span className="rounded-full bg-white/10 px-3 py-1">Window</span>
              </div>
            </div>
          ))}
          {drops.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-white/60">
              No drops scheduled.
            </div>
          ) : null}
        </div>
      </AdminSection>

      <AdminSection
        eyebrow="Cadence"
        title="Clock"
        description="Ensure countdowns and embargoes align."
        actions={
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70">
            <AlarmClock size={14} /> Sync timers
          </div>
        }
      >
        <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.3em] text-white/70">
          {["Prelaunch", "Live", "Embargo", "Recap"].map((state) => (
            <span key={state} className="rounded-full bg-white/10 px-4 py-2">
              {state}
            </span>
          ))}
        </div>
      </AdminSection>
    </div>
  );
}
