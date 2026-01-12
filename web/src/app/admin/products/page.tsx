import Link from "next/link";
import { ArrowUpRight, Plus, ShieldCheck } from "lucide-react";
import { AdminSection } from "@/components/admin/admin-section";
import { getAdminProducts } from "@/lib/admin/data";
import { deleteProduct } from "@/lib/admin/actions/products";

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  const qc = [
    `${products.filter((p) => p.locales.length < 2).length} products missing a locale`,
    `${products.filter((p) => p.status === "DRAFT").length} drafts awaiting approval`,
    `${products.filter((p) => p.issues.some((i) => i.includes("media"))).length} without media`,
  ];

  return (
    <div className="space-y-10">
      <AdminSection
        eyebrow="Catalog"
        title="Products"
        description="Control statuses, locales, and launch readiness."
        actions={
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs uppercase tracking-[0.3em] text-black transition hover:scale-[1.02]"
          >
            <Plus size={14} /> New product
          </Link>
        }
      >
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <table className="w-full text-sm text-white/80">
            <thead className="bg-white/5 text-[0.7rem] uppercase tracking-[0.35em] text-white/60">
              <tr>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Locales</th>
                <th className="px-4 py-3 text-left">Issues</th>
                <th className="px-4 py-3 text-right">Open</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
                <tr key={item.id} className="hover:bg-white/5">
                  <td className="px-4 py-3 font-medium text-white">{item.name}</td>
                  <td className="px-4 py-3 text-xs uppercase tracking-[0.3em] text-white/70">{item.status}</td>
                  <td className="px-4 py-3 text-white/70">{item.locales.join(" / ")}</td>
                  <td className="px-4 py-3 text-white/60">{item.issues.join(" · ")}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/admin/products/${item.slug}`} className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.3em] text-white/70 hover:text-white">
                        Open <ArrowUpRight size={14} />
                      </Link>
                      <form action={deleteProduct}>
                        <input type="hidden" name="id" value={item.id} />
                        <button
                          type="submit"
                          className="rounded-full border border-white/20 px-3 py-1 text-[0.7rem] uppercase tracking-[0.3em] text-white/70 transition hover:bg-white/10"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-white/60">
                    No products yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </AdminSection>

      <AdminSection
        eyebrow="Quality"
        title="Checklist"
        description="Guardrails before publish."
        actions={
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70">
            <ShieldCheck size={14} /> Auto-validate
          </div>
        }
      >
        <ul className="space-y-2 text-sm text-white/80">
          {qc.map((item) => (
            <li key={item} className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-white/50" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </AdminSection>
    </div>
  );
}
