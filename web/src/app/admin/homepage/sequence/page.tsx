import { AdminSection } from "@/components/admin/admin-section";
import { HomepageSequence } from "@/components/admin/homepage-sequence";
import { reorderHomepageModules } from "@/lib/admin/actions/homepage";
import { getAdminHomepageModules } from "@/lib/admin/data";

export default async function AdminHomepageSequencePage() {
  const modules = await getAdminHomepageModules();
  const locales = Array.from(new Set(modules.map((m) => m.locale)));

  return (
    <div className="space-y-10">
      <AdminSection
        eyebrow="Homepage"
        title="Sequence"
        description="Drag to reorder scenes per locale; lower numbers render first."
      >
        <form action={reorderHomepageModules} className="space-y-8">
          {locales.map((locale) => (
            <HomepageSequence
              key={locale}
              locale={locale}
              modules={modules
                .filter((m) => m.locale === locale)
                .sort((a, b) => a.sortOrder - b.sortOrder)}
            />
          ))}
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-xs uppercase tracking-[0.3em] text-black transition hover:scale-[1.02]"
          >
            Save ordering
          </button>
        </form>
      </AdminSection>
    </div>
  );
}
