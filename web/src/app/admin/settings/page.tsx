import { Globe2, Shield, Sparkles } from "lucide-react";
import { AdminSection } from "@/components/admin/admin-section";

const settings = [
  { name: "Locales", detail: "EN + FR active", icon: Globe2 },
  { name: "SEO defaults", detail: "OG templates + structured data", icon: Sparkles },
  { name: "Security", detail: "Admin roles + audit logs", icon: Shield },
];

export default function AdminSettingsPage() {
  return (
    <div className="space-y-10">
      <AdminSection
        eyebrow="Control"
        title="Settings"
        description="Locales, SEO, and integrations."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {settings.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.name}
                className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
              >
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/70">
                  <Icon size={16} />
                  <span>{item.name}</span>
                </div>
                <p className="text-sm text-white/80">{item.detail}</p>
                <button className="self-start rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white/70 hover:bg-white/15">
                  Configure
                </button>
              </div>
            );
          })}
        </div>
      </AdminSection>
    </div>
  );
}
