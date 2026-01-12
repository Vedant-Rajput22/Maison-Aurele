import { HomepageModuleForm } from "@/components/admin/homepage-module-form";
import { createHomepageModule } from "@/lib/admin/actions/homepage";
import { getAdminHomepageModules } from "@/lib/admin/data";

export default async function AdminHomepageNewPage() {
  const modules = await getAdminHomepageModules();
  const nextOrder = modules.length + 1;

  return (
    <div className="space-y-10">
      <HomepageModuleForm
        title="New homepage module"
        description="Define slug, type, locale, timing, and config payload."
        action={createHomepageModule}
        defaultSortOrder={nextOrder}
      />
    </div>
  );
}
