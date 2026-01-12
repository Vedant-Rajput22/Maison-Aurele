import Link from "next/link";
import { ArrowUpRight, Feather, Plus } from "lucide-react";
import { AdminSection } from "@/components/admin/admin-section";
import { deleteEditorialPost } from "@/lib/admin/actions/editorial";
import { getAdminEditorialPosts } from "@/lib/admin/data";
import { defaultLocale } from "@/lib/i18n/config";

export default async function AdminEditorialPage() {
  const posts = await getAdminEditorialPosts();

  return (
    <div className="space-y-10">
      <AdminSection
        eyebrow="Editorial"
        title="Stories"
        description="Journal, campaigns, and lookbooks."
        actions={
          <Link
            href="/admin/editorial/new"
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs uppercase tracking-[0.3em] text-black transition hover:scale-[1.02]"
          >
            <Plus size={14} /> New story
          </Link>
        }
      >
        <div className="space-y-3">
          {posts.map((post) => (
            <div key={post.title} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <div className="space-y-1">
                <p className="text-sm text-white">{post.title}</p>
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                  {post.status} · {post.locales.join("/")} · {post.scheduled ? post.scheduled.toLocaleDateString() : "Pending"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href={`/${defaultLocale}/journal/${post.slug}`}
                  className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.3em] text-white/70 hover:text-white"
                >
                  Preview <ArrowUpRight size={14} />
                </Link>
                <Link
                  href={`/admin/editorial/${post.slug}`}
                  className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.3em] text-white/70 hover:text-white"
                >
                  Open <ArrowUpRight size={14} />
                </Link>
                <form action={deleteEditorialPost}>
                  <input type="hidden" name="id" value={post.id} />
                  <button
                    type="submit"
                    className="rounded-full border border-white/20 px-3 py-1 text-[0.7rem] uppercase tracking-[0.3em] text-white/70 transition hover:bg-white/10"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
          {posts.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/60">
              No editorial entries yet.
            </div>
          ) : null}
        </div>
      </AdminSection>

      <AdminSection
        eyebrow="Voice"
        title="Guidelines"
        description="Keep maison tone aligned across locales."
        actions={
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70">
            <Feather size={14} /> Style sheet
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {["Bilingual parity checks", "Citations + credits", "Alt text standards", "Video captioning"].map((item) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
              {item}
            </div>
          ))}
        </div>
      </AdminSection>
    </div>
  );
}
