import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminSection } from "@/components/admin/admin-section";
import {
  createLookbookSlide,
  deleteLookbookSlide,
  updateCollection,
  updateLookbookSlide,
  createCollectionSection,
  updateCollectionSection,
  deleteCollectionSection,
  addProductToCollection,
  removeProductFromCollection,
  toggleProductHighlight,
  updateProductSortOrder,
} from "@/lib/admin/actions/collections";
import { prisma } from "@/lib/prisma";
import { ProductStatus, Locale } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import { Star, Trash2, Plus } from "lucide-react";
import { AddLookbookSlideForm } from "@/components/admin/add-lookbook-slide-form";
import { EditLookbookSlideForm } from "@/components/admin/edit-lookbook-slide-form";

type CollectionWithLookbook = Prisma.CollectionGetPayload<{
  include: {
    translations: true;
    lookbookSlides: { include: { translations: true; asset: true } };
    sections: { include: { translations: true; asset: true } };
    items: { include: { product: { include: { translations: true } } } };
  };
}>;

type PageParams = { slug: string } | Promise<{ slug: string }>;

export default async function EditCollectionPage({ params }: { params: PageParams }) {
  const resolved = await params;

  // Get collection with items
  const collection = await prisma.collection.findUnique({
    where: { slug: resolved.slug },
    include: {
      translations: true,
      lookbookSlides: { include: { translations: true, asset: true }, orderBy: { sortOrder: "asc" } },
      sections: { include: { translations: true, asset: true }, orderBy: { sortOrder: "asc" } },
      items: {
        include: { product: { include: { translations: true } } },
        orderBy: { sortOrder: "asc" },
      },
    },
  }) as CollectionWithLookbook | null;

  // Get all products for the dropdown
  const allProducts = await prisma.product.findMany({
    where: { status: ProductStatus.ACTIVE },
    include: { translations: { where: { locale: Locale.EN } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  if (!collection) {
    notFound();
  }

  const fr = collection.translations.find((t) => t.locale === Locale.FR);
  const en = collection.translations.find((t) => t.locale === Locale.EN);
  const slides = collection.lookbookSlides;
  const sections = collection.sections;
  const collectionProducts = collection.items;
  const linkedProductIds = new Set(collectionProducts.map((item) => item.productId));
  const availableProducts = allProducts.filter((p) => !linkedProductIds.has(p.id));

  return (
    <div className="space-y-10">
      <AdminSection
        eyebrow="Collections"
        title={`Edit ${collection.slug}`}
        description="Update bilingual collection shell."
        actions={
          <Link
            href="/admin/collections"
            className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70 hover:bg-white/10"
          >
            Back
          </Link>
        }
      >
        <form action={updateCollection} className="space-y-6">
          <input type="hidden" name="id" value={collection.id} />
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-white/80">
              <span className="text-xs uppercase tracking-[0.3em] text-white/60">Slug</span>
              <input
                name="slug"
                defaultValue={collection.slug}
                required
                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
              />
            </label>
            <label className="space-y-2 text-sm text-white/80">
              <span className="text-xs uppercase tracking-[0.3em] text-white/60">Status</span>
              <select
                name="status"
                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
                defaultValue={collection.status}
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
                defaultValue={fr?.title ?? ""}
                required
                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
              />
            </label>
            <label className="space-y-2 text-sm text-white/80">
              <span className="text-xs uppercase tracking-[0.3em] text-white/60">Title (EN)
              </span>
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
              <span className="text-xs uppercase tracking-[0.3em] text-white/60">Subtitle (FR)</span>
              <input
                name="subtitleFr"
                defaultValue={fr?.subtitle ?? ""}
                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
              />
            </label>
            <label className="space-y-2 text-sm text-white/80">
              <span className="text-xs uppercase tracking-[0.3em] text-white/60">Subtitle (EN)</span>
              <input
                name="subtitleEn"
                defaultValue={en?.subtitle ?? ""}
                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
              />
            </label>
          </div>

          <label className="space-y-2 text-sm text-white/80 md:w-1/3">
            <span className="text-xs uppercase tracking-[0.3em] text-white/60">Release date (optional)</span>
            <input
              type="date"
              name="releaseDate"
              defaultValue={collection.releaseDate ? collection.releaseDate.toISOString().slice(0, 10) : ""}
              className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
            />
          </label>

          <button
            type="submit"
            className="rounded-full bg-white px-5 py-2 text-xs uppercase tracking-[0.3em] text-black transition hover:scale-[1.02]"
          >
            Save changes
          </button>
        </form>
      </AdminSection>

      <AdminSection
        eyebrow="Lookbook"
        title="Slides"
        description="Update bilingual captions and ordering."
      >
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <table className="w-full text-sm text-white/80">
            <thead className="bg-white/5 text-[0.7rem] uppercase tracking-[0.35em] text-white/60">
              <tr>
                <th className="px-4 py-3 text-left">Image URL</th>
                <th className="px-4 py-3 text-left">FR Title</th>
                <th className="px-4 py-3 text-left">EN Title</th>
                <th className="px-4 py-3 text-left">Sort</th>
                <th className="px-4 py-3 text-left">Hotspot</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {slides.map((slide) => (
                <EditLookbookSlideForm
                  key={slide.id}
                  slide={slide}
                  collectionSlug={collection.slug}
                  onUpdate={updateLookbookSlide}
                  onDelete={deleteLookbookSlide}
                />
              ))}
              {slides.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-4 text-white/60">
                    No slides yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <AddLookbookSlideForm
          collectionId={collection.id}
          collectionSlug={collection.slug}
          nextSortOrder={slides.length + 1}
          onSubmit={createLookbookSlide}
        />
      </AdminSection>

      <AdminSection
        eyebrow="Story"
        title="Sections"
        description="Long-form frames per collection."
      >
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <table className="w-full text-sm text-white/80">
            <thead className="bg-white/5 text-[0.7rem] uppercase tracking-[0.35em] text-white/60">
              <tr>
                <th className="px-4 py-3 text-left">Layout</th>
                <th className="px-4 py-3 text-left">FR Heading</th>
                <th className="px-4 py-3 text-left">EN Heading</th>
                <th className="px-4 py-3 text-left">Image</th>
                <th className="px-4 py-3 text-left">Sort</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sections.map((section) => {
                const frSection = section.translations.find((t) => t.locale === Locale.FR);
                const enSection = section.translations.find((t) => t.locale === Locale.EN);
                return (
                  <tr key={section.id} className="border-t border-white/10">
                    <td colSpan={6} className="px-0">
                      <form action={updateCollectionSection} className="grid grid-cols-6 items-center gap-3 px-4 py-3">
                        <input type="hidden" name="id" value={section.id} />
                        <input type="hidden" name="slug" value={collection.slug} />
                        <select
                          name="layout"
                          defaultValue={section.layout}
                          className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
                        >
                          <option value="text">Text</option>
                          <option value="image-right">Image right</option>
                          <option value="image-left">Image left</option>
                          <option value="quote">Quote</option>
                        </select>
                        <input
                          name="frTitle"
                          defaultValue={frSection?.heading ?? ""}
                          className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
                          placeholder="Titre FR"
                        />
                        <input
                          name="enTitle"
                          defaultValue={enSection?.heading ?? ""}
                          className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
                          placeholder="Title EN"
                        />
                        <input
                          name="url"
                          defaultValue={section.asset?.url ?? ""}
                          className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
                          placeholder="https://..."
                        />
                        <input
                          name="sortOrder"
                          type="number"
                          defaultValue={section.sortOrder}
                          className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
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
                            form={`delete-section-${section.id}`}
                            className="rounded-full border border-red-400/60 px-3 py-1 text-[0.7rem] uppercase tracking-[0.3em] text-red-200 hover:bg-red-500/10"
                          >
                            Delete
                          </button>
                        </div>
                        <textarea
                          name="frBody"
                          defaultValue={frSection?.body ?? ""}
                          className="col-span-3 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
                          placeholder="Body FR"
                          rows={2}
                        />
                        <textarea
                          name="enBody"
                          defaultValue={enSection?.body ?? ""}
                          className="col-span-3 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
                          placeholder="Body EN"
                          rows={2}
                        />
                        <textarea
                          name="frCaption"
                          defaultValue={frSection?.caption ?? ""}
                          className="col-span-3 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
                          placeholder="Caption FR"
                          rows={2}
                        />
                        <textarea
                          name="enCaption"
                          defaultValue={enSection?.caption ?? ""}
                          className="col-span-3 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
                          placeholder="Caption EN"
                          rows={2}
                        />
                      </form>
                    </td>
                  </tr>
                );
              })}
              {sections.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-4 text-white/60">
                    No sections yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        {sections.map((section) => (
          <form key={`delete-section-${section.id}`} id={`delete-section-${section.id}`} action={deleteCollectionSection}>
            <input type="hidden" name="id" value={section.id} />
            <input type="hidden" name="slug" value={collection.slug} />
          </form>
        ))}

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-white/60">Add section</p>
          <form action={createCollectionSection} className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
            <input type="hidden" name="collectionId" value={collection.id} />
            <input type="hidden" name="slug" value={collection.slug} />
            <select
              name="layout"
              defaultValue="text"
              className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
            >
              <option value="text">Text</option>
              <option value="image-right">Image right</option>
              <option value="image-left">Image left</option>
              <option value="quote">Quote</option>
            </select>
            <input
              name="frTitle"
              placeholder="Titre FR"
              className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
              required
            />
            <input
              name="enTitle"
              placeholder="Title EN"
              className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
              required
            />
            <input
              name="url"
              placeholder="Image URL (optional)"
              className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
            />
            <input
              name="sortOrder"
              type="number"
              defaultValue={sections.length + 1}
              className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
            />
            <button
              type="submit"
              className="rounded-full bg-white px-4 py-2 text-xs uppercase tracking-[0.3em] text-black transition hover:scale-[1.02]"
            >
              Add section
            </button>
            <textarea
              name="frBody"
              placeholder="Body FR"
              className="col-span-3 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
              rows={2}
            />
            <textarea
              name="enBody"
              placeholder="Body EN"
              className="col-span-3 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
              rows={2}
            />
            <textarea
              name="frCaption"
              placeholder="Caption FR"
              className="col-span-3 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
              rows={2}
            />
            <textarea
              name="enCaption"
              placeholder="Caption EN"
              className="col-span-3 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
              rows={2}
            />
          </form>
        </div>
      </AdminSection>

      <AdminSection
        eyebrow="Catalog"
        title="Products"
        description="Link products to this collection. Highlighted products appear prominently."
      >
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <table className="w-full text-sm text-white/80">
            <thead className="bg-white/5 text-[0.7rem] uppercase tracking-[0.35em] text-white/60">
              <tr>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-center">Sort</th>
                <th className="px-4 py-3 text-center">Highlighted</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {collectionProducts.map((item) => {
                const productName = item.product.translations[0]?.name ?? item.product.slug;
                return (
                  <tr key={item.id} className="hover:bg-white/5">
                    <td className="px-4 py-3 font-medium text-white">{productName}</td>
                    <td className="px-4 py-3 text-xs uppercase tracking-[0.3em] text-white/70">
                      {item.product.status}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <form action={updateProductSortOrder} className="inline-flex items-center gap-2">
                        <input type="hidden" name="itemId" value={item.id} />
                        <input type="hidden" name="slug" value={collection.slug} />
                        <input
                          name="sortOrder"
                          type="number"
                          defaultValue={item.sortOrder}
                          className="w-16 rounded-lg border border-white/15 bg-black/30 px-2 py-1 text-center text-white"
                        />
                        <button
                          type="submit"
                          className="rounded-full border border-white/30 px-2 py-1 text-[0.6rem] uppercase tracking-[0.1em] text-white/70 hover:bg-white/10"
                        >
                          ✓
                        </button>
                      </form>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <form action={toggleProductHighlight}>
                        <input type="hidden" name="collectionId" value={collection.id} />
                        <input type="hidden" name="productId" value={item.productId} />
                        <input type="hidden" name="slug" value={collection.slug} />
                        <button
                          type="submit"
                          className={`rounded-full p-2 transition ${item.highlighted
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-white/10 text-white/50 hover:text-white"
                            }`}
                          title={item.highlighted ? "Remove highlight" : "Add highlight"}
                        >
                          <Star size={16} fill={item.highlighted ? "currentColor" : "none"} />
                        </button>
                      </form>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <form action={removeProductFromCollection}>
                        <input type="hidden" name="collectionId" value={collection.id} />
                        <input type="hidden" name="productId" value={item.productId} />
                        <input type="hidden" name="slug" value={collection.slug} />
                        <button
                          type="submit"
                          className="rounded-full border border-red-400/40 p-2 text-red-300 transition hover:bg-red-500/10"
                          title="Remove from collection"
                        >
                          <Trash2 size={14} />
                        </button>
                      </form>
                    </td>
                  </tr>
                );
              })}
              {collectionProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-white/60">
                    No products linked yet. Add products below.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-white/60">Add product</p>
          <form action={addProductToCollection} className="flex items-center gap-3">
            <input type="hidden" name="collectionId" value={collection.id} />
            <input type="hidden" name="slug" value={collection.slug} />
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
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs uppercase tracking-[0.3em] text-black transition hover:scale-[1.02]"
            >
              <Plus size={14} /> Add
            </button>
          </form>
          {availableProducts.length === 0 && (
            <p className="mt-3 text-xs text-white/50">
              All active products are already linked to this collection.
            </p>
          )}
        </div>
      </AdminSection>
    </div>
  );
}
