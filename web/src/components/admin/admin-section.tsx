import { ReactNode } from "react";

export function AdminSection({
  eyebrow,
  title,
  description,
  actions,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          {eyebrow ? (
            <p className="text-xs uppercase tracking-[0.35em] text-white/60">{eyebrow}</p>
          ) : null}
          <div className="space-y-1">
            <h2 className="font-display text-2xl text-white">{title}</h2>
            {description ? <p className="text-sm text-white/70">{description}</p> : null}
          </div>
        </div>
        {actions ? <div className="flex gap-3">{actions}</div> : null}
      </div>
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
        {children}
      </div>
    </section>
  );
}
