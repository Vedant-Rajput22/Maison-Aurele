"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, GripVertical } from "lucide-react";
import type { AdminHomepageModuleRow } from "@/lib/admin/data";

type Props = {
  locale: string;
  modules: AdminHomepageModuleRow[];
};

type ModuleRow = AdminHomepageModuleRow & { key: string };

function reorder(list: ModuleRow[], fromId: string, toId: string) {
  const next = [...list];
  const fromIndex = next.findIndex((item) => item.id === fromId);
  const toIndex = next.findIndex((item) => item.id === toId);
  if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return list;
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}

function moveBy(list: ModuleRow[], id: string, delta: number) {
  const next = [...list];
  const index = next.findIndex((item) => item.id === id);
  if (index === -1) return list;
  const target = Math.min(next.length - 1, Math.max(0, index + delta));
  if (target === index) return list;
  const [item] = next.splice(index, 1);
  next.splice(target, 0, item);
  return next;
}

export function HomepageSequence({ locale, modules }: Props) {
  const initial = useMemo(
    () => modules.map((m) => ({ ...m, key: `${locale}-${m.id}` })),
    [modules, locale],
  );
  const [rows, setRows] = useState<ModuleRow[]>(initial);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  useEffect(() => {
    setRows(initial);
  }, [initial]);

  const hasModules = rows.length > 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/70">
        <span className="rounded-full bg-white/10 px-3 py-1">{locale}</span>
        <span>{rows.length} modules</span>
      </div>
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        {hasModules ? (
          <table className="min-w-full text-sm text-white">
            <thead className="bg-white/5 text-xs uppercase tracking-[0.3em] text-white/60">
              <tr>
                <th className="px-4 py-3 text-left">Order</th>
                <th className="px-4 py-3 text-left">Slug</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((mod, index) => (
                <tr
                  key={mod.key}
                  draggable
                  onDragStart={() => setDraggingId(mod.id)}
                  onDragOver={(event) => {
                    event.preventDefault();
                    if (!draggingId || draggingId === mod.id) return;
                    setRows((prev) => reorder(prev, draggingId, mod.id));
                  }}
                  onDragEnd={() => setDraggingId(null)}
                  onDrop={(event) => event.preventDefault()}
                  className={`border-t border-white/10 transition ${
                    draggingId === mod.id ? "bg-white/10" : "hover:bg-white/5"
                  }`}
                >
                  <td className="px-4 py-3 align-middle">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-white/70">
                      <button
                        type="button"
                        aria-label="Drag to reorder"
                        className="rounded-md border border-white/10 bg-white/10 p-2 text-white/70 transition hover:text-white"
                        onDragStart={() => setDraggingId(mod.id)}
                        draggable
                      >
                        <GripVertical size={14} />
                      </button>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          aria-label="Move up"
                          className="rounded-md border border-white/10 bg-white/10 p-1 text-white/70 transition hover:text-white"
                          onClick={() => setRows((prev) => moveBy(prev, mod.id, -1))}
                        >
                          <ArrowUp size={12} />
                        </button>
                        <button
                          type="button"
                          aria-label="Move down"
                          className="rounded-md border border-white/10 bg-white/10 p-1 text-white/70 transition hover:text-white"
                          onClick={() => setRows((prev) => moveBy(prev, mod.id, 1))}
                        >
                          <ArrowDown size={12} />
                        </button>
                      </div>
                      <span className="rounded-full bg-white/10 px-3 py-1">{index + 1}</span>
                    </div>
                    <input type="hidden" name={`order-${mod.id}`} value={index + 1} />
                  </td>
                  <td className="px-4 py-3 align-middle text-white">{mod.slug}</td>
                  <td className="px-4 py-3 align-middle text-white/80">{mod.type}</td>
                  <td className="px-4 py-3 align-middle">
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white/70">
                      {mod.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="px-4 py-3 text-sm text-white/60">No modules for this locale yet.</div>
        )}
      </div>
    </div>
  );
}
