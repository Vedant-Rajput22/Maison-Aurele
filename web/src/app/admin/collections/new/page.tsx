import Link from "next/link";
import { AdminSection } from "@/components/admin/admin-section";
import { createCollection } from "@/lib/admin/actions/collections";
import { ProductStatus } from "@prisma/client";

export default function NewCollectionPage() {
  return (
    <div className="space-y-10">
      <AdminSection
        eyebrow="Collections"
        title="New collection"
        description="Create a bilingual collection shell."
        actions={
          <Link
            href="/admin/collections"
            className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70 hover:bg-white/10"
          >
            Back
          </Link>
        }
      >
        <form action={createCollection} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-white/80">
              <span className="text-xs uppercase tracking-[0.3em] text-white/60">Slug</span>
              <input
                name="slug"
                required
                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
                placeholder="capsule-noir"
              />
            </label>
            <label className="space-y-2 text-sm text-white/80">
              <span className="text-xs uppercase tracking-[0.3em] text-white/60">Status</span>
              <select
                name="status"
                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
                defaultValue={ProductStatus.DRAFT}
              >
                {Object.values(ProductStatus).map((status) => (
                  <option key={status} value={status} className="bg-black text-white">
                    {status}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-white/80">
              <span className="text-xs uppercase tracking-[0.3em] text-white/60">Title (FR)</span>
              <input
                name="titleFr"
                required
                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
                placeholder="Capsule Nuit"
              />
            </label>
            <label className="space-y-2 text-sm text-white/80">
              <span className="text-xs uppercase tracking-[0.3em] text-white/60">Title (EN)</span>
              <input
                name="titleEn"
                required
                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
                placeholder="Night Capsule"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-white/80">
              <span className="text-xs uppercase tracking-[0.3em] text-white/60">Subtitle (FR)</span>
              <input
                name="subtitleFr"
                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
                placeholder="Manifesto en français"
              />
            </label>
            <label className="space-y-2 text-sm text-white/80">
              <span className="text-xs uppercase tracking-[0.3em] text-white/60">Subtitle (EN)</span>
              <input
                name="subtitleEn"
                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
                placeholder="Manifesto in English"
              />
            </label>
          </div>

          <label className="space-y-2 text-sm text-white/80 md:w-1/3">
            <span className="text-xs uppercase tracking-[0.3em] text-white/60">Release date (optional)</span>
            <input
              type="date"
              name="releaseDate"
              className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
            />
          </label>

          <button
            type="submit"
            className="rounded-full bg-white px-5 py-2 text-xs uppercase tracking-[0.3em] text-black transition hover:scale-[1.02]"
          >
            Create collection
          </button>
        </form>
      </AdminSection>
    </div>
  );
}
