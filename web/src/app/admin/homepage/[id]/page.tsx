import { HomepageModuleForm } from "@/components/admin/homepage-module-form";
import { createHomepageModule, deleteHomepageModule, updateHomepageModule } from "@/lib/admin/actions/homepage";
import { getAdminHomepageModule } from "@/lib/admin/data";

export default async function AdminHomepageEditPage({ params }: { params: { id: string } }) {
  const module = params.id === "new" ? null : await getAdminHomepageModule(params.id);

  return (
    <div className="space-y-10">
      <HomepageModuleForm
        title={module ? "Edit homepage module" : "New homepage module"}
        description="Adjust slug, type, locale, timing, and config payload."
        action={module ? updateHomepageModule : createHomepageModule}
        deleteAction={module ? deleteHomepageModule : undefined}
        defaults={module ?? undefined}
      />
    </div>
  );
}
