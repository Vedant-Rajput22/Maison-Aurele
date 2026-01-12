import Link from "next/link";
import { ArrowUpRight, Layers, Plus } from "lucide-react";
import { AdminSection } from "@/components/admin/admin-section";
import { getAdminHomepageModules } from "@/lib/admin/data";

export default async function AdminHomepagePage() {
  const modules = await getAdminHomepageModules();

  return (
    <div className="space-y-10">
      <AdminSection
        eyebrow="Homepage"
        title="Modules"
        description="Sequence the cinematic homepage per locale."
        actions={
          <Link
            href="/admin/homepage/new"
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs uppercase tracking-[0.3em] text-black transition hover:scale-[1.02]"
          >
            <Plus size={14} /> New module
          </Link>
        }
      >
        <div className="space-y-3">
          {modules.map((mod) => (
            <div
              key={mod.id}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
            >
              <div>
                <Link href={`/admin/homepage/${mod.id}`} className="text-sm text-white hover:underline">
                  {mod.slug}
                </Link>
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                  {mod.type} · {mod.locale}
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/70">
                <span className="rounded-full bg-white/10 px-3 py-1">{mod.status}</span>
                <Link href="/admin/homepage/sequence" className="inline-flex items-center gap-1 hover:text-white">
                  Open <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          ))}
          {modules.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/60">
              No homepage modules yet.
            </div>
          ) : null}
        </div>
      </AdminSection>

      <AdminSection
        eyebrow="Scene order"
        title="Sequencer"
        description="Drag to reorder; changes staged until publish."
        actions={
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70">
            <Layers size={14} /> Preview
          </div>
        }
      >
        <div className="flex items-center gap-3 overflow-x-auto py-2 text-xs uppercase tracking-[0.3em] text-white/70">
          {["Hero", "Triptych", "Gallery", "Drop", "Journal", "Services"].map((item) => (
            <span key={item} className="rounded-full bg-white/10 px-4 py-2">
              {item}
            </span>
          ))}
        </div>
      </AdminSection>
    </div>
  );
}
