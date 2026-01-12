import Link from "next/link";
import { ArrowUpRight, Plus, Sparkles } from "lucide-react";
import { AdminSection } from "@/components/admin/admin-section";
import { getAdminCollections } from "@/lib/admin/data";
import { deleteCollection } from "@/lib/admin/actions/collections";

export default async function AdminCollectionsPage() {
  const collections = await getAdminCollections();

  const lookbook = collections.slice(0, 3).map((entry) => ({
    name: entry.title,
    coverage: entry.locales.length < 2 ? "Needs FR" : "Ready",
  }));

  return (
    <div className="space-y-10">
      <AdminSection
        eyebrow="Narratives"
        title="Collections"
        description="Control capsules, narratives, and lookbooks."
        actions={
          <Link
            href="/admin/collections/new"
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs uppercase tracking-[0.3em] text-black transition hover:scale-[1.02]"
          >
            <Plus size={14} /> New collection
          </Link>
        }
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {collections.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
            >
              <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/70">
                <span>{item.status}</span>
                <span className="rounded-full bg-white/10 px-3 py-1">{item.locales.join("/")}</span>
              </div>
              <h3 className="font-display text-xl text-white">{item.title}</h3>
              <p className="mt-1 text-sm text-white/60">
                {item.releaseDate ? `Release ${item.releaseDate.toLocaleDateString()}` : "Release TBD"}
              </p>
              <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/70">
                <Link href={`/admin/collections/${item.slug}`} className="inline-flex items-center gap-1 hover:text-white">
                  Open <ArrowUpRight size={14} />
                </Link>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-white/10 px-3 py-1">{item.dropTitle ? "Drop" : "Story"}</span>
                  <form action={deleteCollection}>
                    <input type="hidden" name="id" value={item.id} />
                    <button
                      type="submit"
                      className="rounded-full border border-white/20 px-3 py-1 text-[0.7rem] text-white/70 transition hover:bg-white/10"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
          {collections.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-white/60">
              No collections yet.
            </div>
          ) : null}
        </div>
      </AdminSection>

      <AdminSection
        eyebrow="Lookbook"
        title="Frame coverage"
        description="Ensure bilingual captions and hotspots are ready."
        actions={
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70">
            <Sparkles size={14} /> Sync captions
          </div>
        }
      >
        <div className="space-y-3">
          {lookbook.map((frame) => (
            <div key={frame.name} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <div>
                <p className="text-sm text-white">{frame.name}</p>
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">{frame.coverage}</p>
              </div>
              <Link href="/admin/collections/lookbook" className="text-xs uppercase tracking-[0.3em] text-white/70 hover:text-white">
                Edit
              </Link>
            </div>
          ))}
          {lookbook.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/60">
              No lookbook frames yet.
            </div>
          ) : null}
        </div>
      </AdminSection>
    </div>
  );
}
