import Link from "next/link";
import { AdminSection } from "@/components/admin/admin-section";
import { createEditorialPost } from "@/lib/admin/actions/editorial";
import { EditorialCategory, ProductStatus } from "@prisma/client";

export default function NewEditorialPage() {
  return (
    <div className="space-y-10">
      <AdminSection
        eyebrow="Editorial"
        title="New story"
        description="Create a bilingual editorial entry."
        actions={
          <Link
            href="/admin/editorial"
            className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70 hover:bg-white/10"
          >
            Back
          </Link>
        }
      >
        <form action={createEditorialPost} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-white/80">
              <span className="text-xs uppercase tracking-[0.3em] text-white/60">Slug</span>
              <input
                name="slug"
                required
                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
                placeholder="nocturne-atelier"
              />
            </label>
            <label className="space-y-2 text-sm text-white/80">
              <span className="text-xs uppercase tracking-[0.3em] text-white/60">Category</span>
              <select
                name="category"
                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
                defaultValue={EditorialCategory.JOURNAL}
              >
                {Object.values(EditorialCategory).map((cat) => (
                  <option key={cat} value={cat} className="bg-black text-white">
                    {cat}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="space-y-2 text-sm text-white/80">
            <span className="text-xs uppercase tracking-[0.3em] text-white/60">Hero media asset ID (optional)</span>
            <input
              name="heroAssetId"
              className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
              placeholder="asset-cuid"
            />
            <p className="text-xs text-white/50">Paste an existing MediaAsset id. Leave blank to skip.</p>
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-white/80">
              <span className="text-xs uppercase tracking-[0.3em] text-white/60">Title (FR)</span>
              <input
                name="titleFr"
                required
                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
                placeholder="Silhouette Nocturne"
              />
            </label>
            <label className="space-y-2 text-sm text-white/80">
              <span className="text-xs uppercase tracking-[0.3em] text-white/60">Title (EN)</span>
              <input
                name="titleEn"
                required
                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
                placeholder="Nocturne Silhouette"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-white/80">
              <span className="text-xs uppercase tracking-[0.3em] text-white/60">Standfirst (FR)</span>
              <textarea
                name="standfirstFr"
                rows={2}
                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
                placeholder="Ligne éditoriale en français"
              />
            </label>
            <label className="space-y-2 text-sm text-white/80">
              <span className="text-xs uppercase tracking-[0.3em] text-white/60">Standfirst (EN)</span>
              <textarea
                name="standfirstEn"
                rows={2}
                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
                placeholder="Editorial lead in English"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-white/80">
              <span className="text-xs uppercase tracking-[0.3em] text-white/60">Body rich text (FR)</span>
              <textarea
                name="bodyFr"
                rows={4}
                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 font-mono text-xs text-white"
                placeholder='[{ "type": "paragraph", "children": [{ "text": "Paragraphe" }] }]'
              />
            </label>
            <label className="space-y-2 text-sm text-white/80">
              <span className="text-xs uppercase tracking-[0.3em] text-white/60">Body rich text (EN)</span>
              <textarea
                name="bodyEn"
                rows={4}
                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 font-mono text-xs text-white"
                placeholder='[{ "type": "paragraph", "children": [{ "text": "Paragraph" }] }]'
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
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
            <label className="space-y-2 text-sm text-white/80">
              <span className="text-xs uppercase tracking-[0.3em] text-white/60">Publish at (optional)</span>
              <input
                type="datetime-local"
                name="publishAt"
                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-white/80">
              <span className="text-xs uppercase tracking-[0.3em] text-white/60">Blocks JSON</span>
              <textarea
                name="blocks"
                rows={6}
                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-3 font-mono text-xs text-white"
                placeholder='[{ "type": "image", "assetId": "asset-id", "headlineFr": "Titre", "headlineEn": "Title", "bodyFr": "Texte", "bodyEn": "Copy" }]'
              />
              <p className="text-xs text-white/50">Paste an array of blocks with optional assetId + per-locale copy.</p>
            </label>
            <label className="space-y-2 text-sm text-white/80">
              <span className="text-xs uppercase tracking-[0.3em] text-white/60">Featured product IDs (comma or newline)</span>
              <textarea
                name="featureProducts"
                rows={6}
                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-3 font-mono text-xs text-white"
                placeholder="prod-id-1, prod-id-2"
              />
              <p className="text-xs text-white/50">Add product IDs to surface as cited silhouettes in order.</p>
            </label>
          </div>

          <button
            type="submit"
            className="rounded-full bg-white px-5 py-2 text-xs uppercase tracking-[0.3em] text-black transition hover:scale-[1.02]"
          >
            Create story
          </button>
        </form>
      </AdminSection>
    </div>
  );
}
