import { AdminSection } from "@/components/admin/admin-section";
import type { AdminHomepageModuleDetail } from "@/lib/admin/data";
import { Locale } from "@prisma/client";
import { Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { ConfigEditor } from "@/components/admin/config-editor";

function formatDateInput(value?: Date | null) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 16);
}

function stringifyConfig(config: unknown) {
  if (typeof config === "string") return config;
  try {
    return JSON.stringify(config ?? {}, null, 2);
  } catch {
    return "{}";
  }
}

type Props = {
  defaults?: AdminHomepageModuleDetail;
  action: (formData: FormData) => Promise<void>;
  deleteAction?: (formData: FormData) => Promise<void>;
  title: string;
  description: string;
  primaryCta?: ReactNode;
  defaultSortOrder?: number;
};

export function HomepageModuleForm({
  defaults,
  action,
  deleteAction,
  title,
  description,
  primaryCta,
  defaultSortOrder,
}: Props) {
  const configDefault = stringifyConfig(defaults?.config ?? {});
  const sortDefault = defaults?.sortOrder ?? defaultSortOrder ?? 0;

  return (
    <AdminSection eyebrow="Homepage" title={title} description={description} actions={primaryCta}>
      <form action={action} className="space-y-6">
        {defaults?.id ? <input type="hidden" name="id" value={defaults.id} /> : null}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm text-white/80">
            <span className="block text-xs uppercase tracking-[0.3em] text-white/60">Slug</span>
            <input
              name="slug"
              required
              defaultValue={defaults?.slug}
              placeholder="hero-fr"
              className="w-full rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-white outline-none focus:border-white/50"
            />
          </label>
          <label className="space-y-2 text-sm text-white/80">
            <span className="block text-xs uppercase tracking-[0.3em] text-white/60">Type</span>
            <input
              name="type"
              required
              defaultValue={defaults?.type}
              placeholder="hero|gallery|drop"
              className="w-full rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-white outline-none focus:border-white/50"
            />
          </label>
          <label className="space-y-2 text-sm text-white/80">
            <span className="block text-xs uppercase tracking-[0.3em] text-white/60">Locale</span>
            <select
              name="locale"
              defaultValue={defaults?.locale ?? Locale.EN}
              className="w-full rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-white outline-none focus:border-white/50"
            >
              <option value={Locale.EN}>EN</option>
              <option value={Locale.FR}>FR</option>
            </select>
          </label>
          <label className="space-y-2 text-sm text-white/80">
            <span className="block text-xs uppercase tracking-[0.3em] text-white/60">Sort order</span>
            <input
              type="number"
              name="sortOrder"
              defaultValue={sortDefault}
              min={0}
              className="w-full rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-white outline-none focus:border-white/50"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm text-white/80">
            <span className="block text-xs uppercase tracking-[0.3em] text-white/60">Active from</span>
            <input
              type="datetime-local"
              name="activeFrom"
              defaultValue={formatDateInput(defaults?.activeFrom)}
              className="w-full rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-white outline-none focus:border-white/50"
            />
          </label>
          <label className="space-y-2 text-sm text-white/80">
            <span className="block text-xs uppercase tracking-[0.3em] text-white/60">Active to</span>
            <input
              type="datetime-local"
              name="activeTo"
              defaultValue={formatDateInput(defaults?.activeTo)}
              className="w-full rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-white outline-none focus:border-white/50"
            />
          </label>
        </div>

        <label className="space-y-2 text-sm text-white/80">
          <span className="block text-xs uppercase tracking-[0.3em] text-white/60">Config (JSON)</span>
          <ConfigEditor
            name="config"
            defaultValue={configDefault}
            className="w-full rounded-xl border border-white/15 bg-black/30 px-3 py-3 font-mono text-xs text-white outline-none focus:border-white/50"
          />
        </label>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-xs uppercase tracking-[0.3em] text-black transition hover:scale-[1.02]"
          >
            {defaults ? "Save module" : "Create module"}
          </button>
        </div>
      </form>

      {deleteAction && defaults?.id ? (
        <form action={deleteAction} className="mt-2 inline-flex items-center gap-3">
          <input type="hidden" name="id" value={defaults.id} />
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full border border-red-400/50 bg-red-500/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-red-100 transition hover:border-red-400"
          >
            <Trash2 size={14} /> Delete
          </button>
        </form>
      ) : null}
    </AdminSection>
  );
}
