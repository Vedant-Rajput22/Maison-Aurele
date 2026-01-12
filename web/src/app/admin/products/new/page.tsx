import Link from "next/link";
import { AdminSection } from "@/components/admin/admin-section";
import { createProduct } from "@/lib/admin/actions/products";
import { ProductStatus } from "@prisma/client";

export default function NewProductPage() {
  return (
    <div className="space-y-10">
      <AdminSection
        eyebrow="Products"
        title="New product"
        description="Create product shell with bilingual names."
        actions={
          <Link
            href="/admin/products"
            className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70 hover:bg-white/10"
          >
            Back
          </Link>
        }
      >
        <form action={createProduct} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-white/80">
              <span className="text-xs uppercase tracking-[0.3em] text-white/60">Slug</span>
              <input
                name="slug"
                required
                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
                placeholder="silhouette-noir"
              />
            </label>
            <label className="space-y-2 text-sm text-white/80">
              <span className="text-xs uppercase tracking-[0.3em] text-white/60">SKU prefix</span>
              <input
                name="skuPrefix"
                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
                placeholder="MA-SIL"
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
              <span className="text-xs uppercase tracking-[0.3em] text-white/60">Name (FR)</span>
              <input
                name="nameFr"
                required
                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
                placeholder="Silhouette Noire"
              />
            </label>
            <label className="space-y-2 text-sm text-white/80">
              <span className="text-xs uppercase tracking-[0.3em] text-white/60">Name (EN)</span>
              <input
                name="nameEn"
                required
                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
                placeholder="Noir Silhouette"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-white/80">
              <span className="text-xs uppercase tracking-[0.3em] text-white/60">Description (FR)</span>
              <textarea
                name="descriptionFr"
                rows={3}
                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
                placeholder="Description en français"
              />
            </label>
            <label className="space-y-2 text-sm text-white/80">
              <span className="text-xs uppercase tracking-[0.3em] text-white/60">Description (EN)</span>
              <textarea
                name="descriptionEn"
                rows={3}
                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
                placeholder="Description in English"
              />
            </label>
          </div>

          <button
            type="submit"
            className="rounded-full bg-white px-5 py-2 text-xs uppercase tracking-[0.3em] text-black transition hover:scale-[1.02]"
          >
            Create product
          </button>
        </form>
      </AdminSection>
    </div>
  );
}
