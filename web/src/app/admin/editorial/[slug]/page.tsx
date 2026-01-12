import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminSection } from "@/components/admin/admin-section";
import {
  updateEditorialPost,
  createEditorialBlock,
  updateEditorialBlock,
  deleteEditorialBlock,
  addFeaturedProduct,
  removeFeaturedProduct,
  updateFeaturedProductNote,
} from "@/lib/admin/actions/editorial";
import { prisma } from "@/lib/prisma";
import { defaultLocale } from "@/lib/i18n/config";
import { EditorialCategory, ProductStatus, Locale } from "@prisma/client";
import { Plus, Trash2 } from "lucide-react";

type PageParams = { slug: string } | Promise<{ slug: string }>;

export default async function EditEditorialPage({ params }: { params: PageParams }) {
  const resolved = await params;
  const post = await prisma.editorialPost.findUnique({
    where: { slug: resolved.slug },
    include: {
      translations: true,
      heroAsset: true,
      blocks: {
        orderBy: { sortOrder: "asc" },
        include: {
          translations: true,
          asset: true,
        },
      },
      featuredProducts: {
        orderBy: { sortOrder: "asc" },
        include: {
          product: { include: { translations: true } },
        },
      },
    },
  });

  // Get all products for the dropdown
  const allProducts = await prisma.product.findMany({
    where: { status: ProductStatus.ACTIVE },
    include: { translations: { where: { locale: Locale.EN } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  if (!post) {
    notFound();
  }

  const fr = post.translations.find((t) => t.locale === Locale.FR);
  const en = post.translations.find((t) => t.locale === Locale.EN);
  const bodyFr = JSON.stringify(fr?.bodyRichText ?? [], null, 2);
  const bodyEn = JSON.stringify(en?.bodyRichText ?? [], null, 2);

  const blocks = post.blocks;
  const featuredProducts = post.featuredProducts;
  const linkedProductIds = new Set(featuredProducts.map((f) => f.productId));
  const availableProducts = allProducts.filter((p) => !linkedProductIds.has(p.id));

  return (
    <div className="space-y-10">
      <AdminSection
        eyebrow="Editorial"
        title={`Edit ${post.slug}`}
        description="Update bilingual editorial entry."
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/${defaultLocale}/journal/${post.slug}`}
              className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70 hover:bg-white/10"
            >
              Preview EN
            </Link>
            <Link
              href={`/fr/journal/${post.slug}`}
              className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70 hover:bg-white/10"
            >
              Preview FR
            </Link>
            <Link
              href="/admin/editorial"
              className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70 hover:bg-white/10"
            >
              Back
            </Link>
          </div>
        }
      >
        <form action={updateEditorialPost} className="space-y-6">
          <input type="hidden" name="id" value={post.id} />
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-white/80">
              <span className="text-xs uppercase tracking-[0.3em] text-white/60">Slug</span>
              <input
                name="slug"
                defaultValue={post.slug}
                required
                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
              />
            </label>
            <label className="space-y-2 text-sm text-white/80">
              <span className="text-xs uppercase tracking-[0.3em] text-white/60">Category</span>
              <select
                name="category"
                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
                defaultValue={post.category}
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
              defaultValue={post.heroAssetId ?? ""}
              className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
              placeholder="asset-cuid"
            />
            {post.heroAsset?.url ? <p className="text-xs text-white/50">Current: {post.heroAsset.url}</p> : null}
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-white/80">
              <span className="text-xs uppercase tracking-[0.3em] text-white/60">Title (FR)</span>
              <input
                name="titleFr"
                defaultValue={fr?.title ?? ""}
                required
                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
              />
            </label>
            <label className="space-y-2 text-sm text-white/80">
              <span className="text-xs uppercase tracking-[0.3em] text-white/60">Title (EN)</span>
              <input
                name="titleEn"
                defaultValue={en?.title ?? ""}
                required
                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
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
                defaultValue={fr?.standfirst ?? ""}
              />
            </label>
            <label className="space-y-2 text-sm text-white/80">
              <span className="text-xs uppercase tracking-[0.3em] text-white/60">Standfirst (EN)</span>
              <textarea
                name="standfirstEn"
                rows={2}
                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
                defaultValue={en?.standfirst ?? ""}
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
                defaultValue={bodyFr}
              />
            </label>
            <label className="space-y-2 text-sm text-white/80">
              <span className="text-xs uppercase tracking-[0.3em] text-white/60">Body rich text (EN)</span>
              <textarea
                name="bodyEn"
                rows={4}
                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 font-mono text-xs text-white"
                defaultValue={bodyEn}
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-2 text-sm text-white/80">
              <span className="text-xs uppercase tracking-[0.3em] text-white/60">Status</span>
              <select
                name="status"
                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
                defaultValue={post.status}
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
                defaultValue={post.publishedAt ? new Date(post.publishedAt).toISOString().slice(0, 16) : ""}
                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
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
        eyebrow="Content"
        title="Blocks"
        description="Story blocks with bilingual content. Types: text, quote, media, carousel."
      >
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <table className="w-full text-sm text-white/80">
            <thead className="bg-white/5 text-[0.7rem] uppercase tracking-[0.35em] text-white/60">
              <tr>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Headline FR</th>
                <th className="px-4 py-3 text-left">Headline EN</th>
                <th className="px-4 py-3 text-left">Image</th>
                <th className="px-4 py-3 text-center">Sort</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {blocks.map((block) => {
                const frBlock = block.translations.find((t) => t.locale === Locale.FR);
                const enBlock = block.translations.find((t) => t.locale === Locale.EN);
                return (
                  <tr key={block.id}>
                    <td colSpan={6} className="px-0">
                      <form action={updateEditorialBlock} className="grid grid-cols-6 items-center gap-3 px-4 py-3">
                        <input type="hidden" name="id" value={block.id} />
                        <input type="hidden" name="slug" value={post.slug} />
                        <select
                          name="type"
                          defaultValue={block.type}
                          className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
                        >
                          <option value="text">Text</option>
                          <option value="quote">Quote</option>
                          <option value="media">Media</option>
                          <option value="carousel">Carousel</option>
                        </select>
                        <input
                          name="headlineFr"
                          defaultValue={frBlock?.headline ?? ""}
                          className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
                          placeholder="Titre FR"
                        />
                        <input
                          name="headlineEn"
                          defaultValue={enBlock?.headline ?? ""}
                          className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
                          placeholder="Title EN"
                        />
                        <input
                          name="assetUrl"
                          defaultValue={block.asset?.url ?? ""}
                          className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
                          placeholder="https://..."
                        />
                        <input
                          name="sortOrder"
                          type="number"
                          defaultValue={block.sortOrder}
                          className="w-full rounded-lg border border-white/15 bg-black/30 px-2 py-2 text-center text-white"
                        />
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="submit"
                            className="rounded-full border border-white/30 px-3 py-1 text-[0.7rem] uppercase tracking-[0.3em] text-white/80 hover:bg-white/10"
                          >
                            Save
                          </button>
                          <button
                            type="submit"
                            form={`delete-block-${block.id}`}
                            className="rounded-full border border-red-400/40 p-2 text-red-300 transition hover:bg-red-500/10"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <textarea
                          name="bodyFr"
                          defaultValue={frBlock?.body ?? ""}
                          className="col-span-3 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
                          placeholder="Body FR"
                          rows={2}
                        />
                        <textarea
                          name="bodyEn"
                          defaultValue={enBlock?.body ?? ""}
                          className="col-span-3 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
                          placeholder="Body EN"
                          rows={2}
                        />
                      </form>
                    </td>
                  </tr>
                );
              })}
              {blocks.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-white/60">
                    No blocks yet. Add blocks below.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {blocks.map((block) => (
          <form key={`delete-block-${block.id}`} id={`delete-block-${block.id}`} action={deleteEditorialBlock}>
            <input type="hidden" name="id" value={block.id} />
            <input type="hidden" name="slug" value={post.slug} />
          </form>
        ))}

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-white/60">Add block</p>
          <form action={createEditorialBlock} className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
            <input type="hidden" name="postId" value={post.id} />
            <input type="hidden" name="slug" value={post.slug} />
            <select
              name="type"
              defaultValue="text"
              className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
            >
              <option value="text">Text</option>
              <option value="quote">Quote</option>
              <option value="media">Media</option>
              <option value="carousel">Carousel</option>
            </select>
            <input
              name="headlineFr"
              placeholder="Titre FR"
              className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
            />
            <input
              name="headlineEn"
              placeholder="Title EN"
              className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
            />
            <input
              name="assetUrl"
              placeholder="Image URL (optional)"
              className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
            />
            <button
              type="submit"
              className="col-span-2 inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-xs uppercase tracking-[0.3em] text-black transition hover:scale-[1.02]"
            >
              <Plus size={14} /> Add block
            </button>
            <textarea
              name="bodyFr"
              placeholder="Body FR"
              className="col-span-3 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
              rows={2}
            />
            <textarea
              name="bodyEn"
              placeholder="Body EN"
              className="col-span-3 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
              rows={2}
            />
          </form>
        </div>
      </AdminSection>

      <AdminSection
        eyebrow="Catalog"
        title="Featured Products"
        description="Products to feature in this editorial. Add notes for context."
      >
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <table className="w-full text-sm text-white/80">
            <thead className="bg-white/5 text-[0.7rem] uppercase tracking-[0.35em] text-white/60">
              <tr>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left">Note</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {featuredProducts.map((feature) => {
                const productName = feature.product.translations[0]?.name ?? feature.product.slug;
                return (
                  <tr key={feature.id} className="hover:bg-white/5">
                    <td className="px-4 py-3 font-medium text-white">{productName}</td>
                    <td className="px-4 py-3">
                      <form action={updateFeaturedProductNote} className="flex items-center gap-2">
                        <input type="hidden" name="id" value={feature.id} />
                        <input type="hidden" name="slug" value={post.slug} />
                        <input
                          name="note"
                          defaultValue={feature.note ?? ""}
                          className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-1 text-white"
                          placeholder="e.g. Featured in this story"
                        />
                        <button
                          type="submit"
                          className="rounded-full border border-white/30 px-3 py-1 text-[0.6rem] uppercase tracking-[0.2em] text-white/70 hover:bg-white/10"
                        >
                          Save
                        </button>
                      </form>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <form action={removeFeaturedProduct}>
                        <input type="hidden" name="postId" value={post.id} />
                        <input type="hidden" name="productId" value={feature.productId} />
                        <input type="hidden" name="slug" value={post.slug} />
                        <button
                          type="submit"
                          className="rounded-full border border-red-400/40 p-2 text-red-300 transition hover:bg-red-500/10"
                          title="Remove"
                        >
                          <Trash2 size={14} />
                        </button>
                      </form>
                    </td>
                  </tr>
                );
              })}
              {featuredProducts.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-white/60">
                    No featured products yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-white/60">Add featured product</p>
          <form action={addFeaturedProduct} className="flex items-center gap-3">
            <input type="hidden" name="postId" value={post.id} />
            <input type="hidden" name="slug" value={post.slug} />
            <select
              name="productId"
              required
              className="flex-1 rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
            >
              <option value="">Select a product...</option>
              {availableProducts.map((product) => (
                <option key={product.id} value={product.id} className="bg-black text-white">
                  {product.translations[0]?.name ?? product.slug}
                </option>
              ))}
            </select>
            <input
              name="note"
              placeholder="Note (optional)"
              className="w-48 rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs uppercase tracking-[0.3em] text-black transition hover:scale-[1.02]"
            >
              <Plus size={14} /> Add
            </button>
          </form>
          {availableProducts.length === 0 && (
            <p className="mt-3 text-xs text-white/50">
              All active products are already featured.
            </p>
          )}
        </div>
      </AdminSection>
    </div>
  );
}
