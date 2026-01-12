import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminSection } from "@/components/admin/admin-section";
import { ProductMediaSection } from "@/components/admin/product-media-section";
import {
  createProductMedia,
  createVariant,
  deleteProductMedia,
  deleteVariant,
  updateProduct,
  updateProductMedia,
  updateVariant,
} from "@/lib/admin/actions/products";
import { prisma } from "@/lib/prisma";
import { Prisma, ProductStatus, Locale } from "@prisma/client";

type ProductWithAdmin = Prisma.ProductGetPayload<{
  include: {
    translations: true;
    variants: { include: { inventory: true } };
    media: { include: { asset: true } };
  };
}>;

type PageParams = { slug: string } | Promise<{ slug: string }>;

export default async function EditProductPage({ params }: { params: PageParams }) {
  const resolved = await params;
  const product = await prisma.product.findUnique({
    where: { slug: resolved.slug },
    include: {
      translations: true,
      variants: { include: { inventory: true }, orderBy: { sku: "asc" } },
      media: { include: { asset: true }, orderBy: { sortOrder: "asc" } },
    },
  }) as ProductWithAdmin | null;

  if (!product) {
    return notFound();
  }

  const fr = product.translations.find((t) => t.locale === Locale.FR);
  const en = product.translations.find((t) => t.locale === Locale.EN);
  const variants = product.variants;
  const media = product.media;

  return (
    <div className="space-y-10">
      <AdminSection
        eyebrow="Products"
        title={`Edit ${product.slug}`}
        description="Update product shell."
        actions={
          <Link
            href="/admin/products"
            className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70 hover:bg-white/10"
          >
            Back
          </Link>
        }
      >
        <form action={updateProduct} className="space-y-6">
          <input type="hidden" name="id" value={product.id} />
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-white/80">
              <span className="text-xs uppercase tracking-[0.3em] text-white/60">Slug</span>
              <input
                name="slug"
                defaultValue={product.slug}
                required
                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
              />
            </label>
            <label className="space-y-2 text-sm text-white/80">
              <span className="text-xs uppercase tracking-[0.3em] text-white/60">SKU prefix</span>
              <input
                name="skuPrefix"
                defaultValue={product.skuPrefix ?? ""}
                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
                placeholder="MA-SIL"
              />
            </label>
            <label className="space-y-2 text-sm text-white/80">
              <span className="text-xs uppercase tracking-[0.3em] text-white/60">Status</span>
              <select
                name="status"
                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
                defaultValue={product.status}
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
                defaultValue={fr?.name ?? ""}
                required
                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
              />
            </label>
            <label className="space-y-2 text-sm text-white/80">
              <span className="text-xs uppercase tracking-[0.3em] text-white/60">Name (EN)</span>
              <input
                name="nameEn"
                defaultValue={en?.name ?? ""}
                required
                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
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
                defaultValue={fr?.description ?? ""}
              />
            </label>
            <label className="space-y-2 text-sm text-white/80">
              <span className="text-xs uppercase tracking-[0.3em] text-white/60">Description (EN)</span>
              <textarea
                name="descriptionEn"
                rows={3}
                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
                defaultValue={en?.description ?? ""}
              />
            </label>
          </div>

          <button
            type="submit"
            className="rounded-full bg-white px-5 py-2 text-xs uppercase tracking-[0.3em] text-black transition hover:scale-[1.02]"
          >
            Save changes
          </button>
        </form>
      </AdminSection>

      <AdminSection
        eyebrow="Variants"
        title="SKUs"
        description="Manage pricing, inventory, and personalization flags per SKU."
      >
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <table className="w-full text-sm text-white/80">
            <thead className="bg-white/5 text-[0.7rem] uppercase tracking-[0.35em] text-white/60">
              <tr>
                <th className="px-4 py-3 text-left">SKU</th>
                <th className="px-4 py-3 text-left">Color</th>
                <th className="px-4 py-3 text-left">Size</th>
                <th className="px-4 py-3 text-left">Price (€)</th>
                <th className="px-4 py-3 text-left">Compare (€)</th>
                <th className="px-4 py-3 text-left">Qty</th>
                <th className="px-4 py-3 text-left">Personalization</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {variants.map((variant) => (
                <tr key={variant.id} className="border-t border-white/10">
                  <td colSpan={8} className="px-0">
                    <form action={updateVariant} className="grid grid-cols-8 items-center gap-3 px-4 py-3">
                      <input type="hidden" name="id" value={variant.id} />
                      <input type="hidden" name="productId" value={product.id} />
                      <input
                        name="sku"
                        defaultValue={variant.sku}
                        className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
                      />
                      <input
                        name="color"
                        defaultValue={variant.color}
                        className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
                      />
                      <input
                        name="size"
                        defaultValue={variant.size ?? ""}
                        className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
                      />
                      <input
                        name="price"
                        type="number"
                        step="0.01"
                        defaultValue={(variant.priceCents / 100).toFixed(2)}
                        className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
                      />
                      <input
                        name="compareAt"
                        type="number"
                        step="0.01"
                        defaultValue={variant.compareAtCents ? (variant.compareAtCents / 100).toFixed(2) : ""}
                        className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
                      />
                      <input
                        name="quantity"
                        type="number"
                        defaultValue={variant.inventory?.quantity ?? 0}
                        className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
                      />
                      <label className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/70">
                        <input
                          type="checkbox"
                          name="personalizationAllowed"
                          defaultChecked={variant.personalizationAllowed}
                          className="h-4 w-4 rounded border-white/30 bg-black/40"
                        />
                        Allow
                      </label>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="submit"
                          className="rounded-full border border-white/30 px-3 py-1 text-[0.7rem] uppercase tracking-[0.3em] text-white/80 hover:bg-white/10"
                        >
                          Save
                        </button>
                        <button
                          type="submit"
                          form={`delete-${variant.id}`}
                          className="rounded-full border border-red-400/60 px-3 py-1 text-[0.7rem] uppercase tracking-[0.3em] text-red-200 hover:bg-red-500/10"
                        >
                          Delete
                        </button>
                      </div>
                    </form>
                  </td>
                </tr>
              ))}
              {variants.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-4 text-white/60">
                    No variants yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        {variants.map((variant) => (
          <form key={`delete-${variant.id}`} id={`delete-${variant.id}`} action={deleteVariant}>
            <input type="hidden" name="id" value={variant.id} />
          </form>
        ))}

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-white/60">Add variant</p>
          <form action={createVariant} className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
            <input type="hidden" name="productId" value={product.id} />
            <input
              name="sku"
              placeholder={product.skuPrefix ? `${product.skuPrefix}-COLOR-SIZE` : `${product.slug}-COLOR-SIZE`}
              className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
              required
            />
            <input
              name="color"
              placeholder="Color"
              className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
              list="color-options"
              required
            />
            <input
              name="size"
              placeholder="Size"
              className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
              list="size-options"
            />
            <input
              name="price"
              type="number"
              step="0.01"
              placeholder="Price €"
              className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
              required
            />
            <input
              name="compareAt"
              type="number"
              step="0.01"
              placeholder="Compare €"
              className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
            />
            <input
              name="quantity"
              type="number"
              placeholder="Qty"
              className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
              defaultValue={0}
            />
            <label className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/70">
              <input type="checkbox" name="personalizationAllowed" className="h-4 w-4 rounded border-white/30 bg-black/40" />
              Personalize
            </label>
            <button
              type="submit"
              className="rounded-full bg-white px-4 py-2 text-xs uppercase tracking-[0.3em] text-black transition hover:scale-[1.02]"
            >
              Add variant
            </button>
          </form>
          <datalist id="color-options">
            <option value="Noir" />
            <option value="Ivoire" />
            <option value="Marine" />
            <option value="Gold" />
          </datalist>
          <datalist id="size-options">
            <option value="34" />
            <option value="36" />
            <option value="38" />
            <option value="40" />
            <option value="42" />
            <option value="44" />
          </datalist>
        </div>
      </AdminSection>

      <AdminSection eyebrow="Media" title="Product media" description="Upload images or manage existing gallery assets.">
        {/* Cloudinary Uploader */}
        <div className="mb-6">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-white/60">Upload images</p>
          <ProductMediaSection
            productId={product.id}
            existingMedia={media.map((m) => ({
              id: m.id,
              publicId: m.asset.publicId || "",
              url: m.asset.url,
              alt: m.asset.alt || undefined,
              placement: m.placement,
              sortOrder: m.sortOrder,
            }))}
          />
        </div>

        {/* Existing Media Table */}
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <table className="w-full text-sm text-white/80">
            <thead className="bg-white/5 text-[0.7rem] uppercase tracking-[0.35em] text-white/60">
              <tr>
                <th className="px-4 py-3 text-left">URL</th>
                <th className="px-4 py-3 text-left">Alt</th>
                <th className="px-4 py-3 text-left">Placement</th>
                <th className="px-4 py-3 text-left">Sort</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {media.map((item) => (
                <tr key={item.id} className="border-t border-white/10">
                  <td colSpan={6} className="px-0">
                    <form action={updateProductMedia} className="grid grid-cols-6 items-center gap-3 px-4 py-3">
                      <input type="hidden" name="id" value={item.id} />
                      <input
                        name="url"
                        defaultValue={item.asset.url}
                        className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
                      />
                      <input
                        name="alt"
                        defaultValue={item.asset.alt ?? ""}
                        className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
                      />
                      <input
                        name="placement"
                        defaultValue={item.placement}
                        className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
                      />
                      <input
                        name="sortOrder"
                        type="number"
                        defaultValue={item.sortOrder}
                        className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
                      />
                      <select
                        name="type"
                        defaultValue={item.asset.type}
                        className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
                      >
                        <option value="IMAGE">IMAGE</option>
                        <option value="VIDEO">VIDEO</option>
                      </select>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="submit"
                          className="rounded-full border border-white/30 px-3 py-1 text-[0.7rem] uppercase tracking-[0.3em] text-white/80 hover:bg-white/10"
                        >
                          Save
                        </button>
                        <button
                          type="submit"
                          form={`delete-media-${item.id}`}
                          className="rounded-full border border-red-400/60 px-3 py-1 text-[0.7rem] uppercase tracking-[0.3em] text-red-200 hover:bg-red-500/10"
                        >
                          Delete
                        </button>
                      </div>
                    </form>
                  </td>
                </tr>
              ))}
              {media.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-4 text-white/60">
                    No media yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table >
        </div >

        {
          media.map((item) => (
            <form key={`delete-media-${item.id}`} id={`delete-media-${item.id}`} action={deleteProductMedia}>
              <input type="hidden" name="id" value={item.id} />
            </form>
          ))
        }

        < div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4" >
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-white/60">Add media</p>
          <form action={createProductMedia} className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
            <input type="hidden" name="productId" value={product.id} />
            <input
              name="url"
              placeholder="https://..."
              className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
              required
            />
            <input
              name="alt"
              placeholder="Alt text"
              className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
            />
            <input
              name="placement"
              defaultValue="gallery"
              placeholder="Placement"
              className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
            />
            <input
              name="sortOrder"
              type="number"
              defaultValue={media.length + 1}
              className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
            />
            <select
              name="type"
              defaultValue="IMAGE"
              className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
            >
              <option value="IMAGE">IMAGE</option>
              <option value="VIDEO">VIDEO</option>
            </select>
            <button
              type="submit"
              className="rounded-full bg-white px-4 py-2 text-xs uppercase tracking-[0.3em] text-black transition hover:scale-[1.02]"
            >
              Add media
            </button>
          </form>
        </div >
      </AdminSection >
    </div >
  );
}
