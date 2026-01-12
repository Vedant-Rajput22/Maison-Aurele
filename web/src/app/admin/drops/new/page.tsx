import Link from "next/link";
import { AdminSection } from "@/components/admin/admin-section";
import { createDrop } from "@/lib/admin/actions/drops";
import { prisma } from "@/lib/prisma";

export default async function NewDropPage() {
    // Get collections for dropdown
    const collections = await prisma.collection.findMany({
        include: { translations: { take: 1 } },
        orderBy: { releaseDate: "desc" },
        take: 50,
    });

    return (
        <div className="space-y-10">
            <AdminSection
                eyebrow="Limited"
                title="New drop"
                description="Create a new limited edition drop."
                actions={
                    <Link
                        href="/admin/drops"
                        className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70 hover:bg-white/10"
                    >
                        Back
                    </Link>
                }
            >
                <form action={createDrop} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="space-y-2 text-sm text-white/80">
                            <span className="text-xs uppercase tracking-[0.3em] text-white/60">Title</span>
                            <input
                                name="title"
                                required
                                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
                                placeholder="Capsule Noir — Limited Edition"
                            />
                        </label>
                        <label className="space-y-2 text-sm text-white/80">
                            <span className="text-xs uppercase tracking-[0.3em] text-white/60">Collection</span>
                            <select
                                name="collectionId"
                                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
                                required
                            >
                                <option value="" className="bg-black text-white">Select collection...</option>
                                {collections.map((col) => (
                                    <option key={col.id} value={col.id} className="bg-black text-white">
                                        {col.translations[0]?.title ?? col.slug}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        <label className="space-y-2 text-sm text-white/80">
                            <span className="text-xs uppercase tracking-[0.3em] text-white/60">Starts At</span>
                            <input
                                type="datetime-local"
                                name="startsAt"
                                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
                            />
                        </label>
                        <label className="space-y-2 text-sm text-white/80">
                            <span className="text-xs uppercase tracking-[0.3em] text-white/60">Ends At (optional)</span>
                            <input
                                type="datetime-local"
                                name="endsAt"
                                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
                            />
                        </label>
                        <label className="space-y-2 text-sm text-white/80">
                            <span className="text-xs uppercase tracking-[0.3em] text-white/60">Locale</span>
                            <select
                                name="locale"
                                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
                                defaultValue=""
                            >
                                <option value="" className="bg-black text-white">All locales</option>
                                <option value="EN" className="bg-black text-white">English only</option>
                                <option value="FR" className="bg-black text-white">French only</option>
                            </select>
                        </label>
                    </div>

                    <label className="flex items-center gap-3 text-sm text-white/80">
                        <input
                            type="checkbox"
                            name="waitlistOpen"
                            defaultChecked
                            className="h-5 w-5 rounded border-white/20 bg-black/20"
                        />
                        <span>Enable waitlist signups</span>
                    </label>

                    <button
                        type="submit"
                        className="rounded-full bg-white px-5 py-2 text-xs uppercase tracking-[0.3em] text-black transition hover:scale-[1.02]"
                    >
                        Create drop
                    </button>
                </form>
            </AdminSection>
        </div>
    );
}
