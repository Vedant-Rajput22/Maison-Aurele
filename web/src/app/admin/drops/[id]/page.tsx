import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminSection } from "@/components/admin/admin-section";
import { updateDrop, deleteDrop, closeDrop } from "@/lib/admin/actions/drops";
import { prisma } from "@/lib/prisma";

type PageParams = { id: string } | Promise<{ id: string }>;

export default async function EditDropPage({ params }: { params: PageParams }) {
    const resolved = await params;
    const drop = await prisma.limitedDrop.findUnique({
        where: { id: resolved.id },
        include: {
            collection: { include: { translations: { take: 1 } } },
            waitlistEntries: { select: { id: true, email: true, createdAt: true } },
        },
    });

    // Get collections for dropdown
    const collections = await prisma.collection.findMany({
        include: { translations: { take: 1 } },
        orderBy: { releaseDate: "desc" },
        take: 50,
    });

    if (!drop) {
        notFound();
    }

    const isActive = !drop.endsAt || drop.endsAt > new Date();

    return (
        <div className="space-y-10">
            <AdminSection
                eyebrow="Limited"
                title={`Edit ${drop.title}`}
                description="Update drop details and manage waitlist."
                actions={
                    <div className="flex items-center gap-3">
                        {isActive && (
                            <form action={closeDrop}>
                                <input type="hidden" name="id" value={drop.id} />
                                <button
                                    type="submit"
                                    className="rounded-full border border-amber-400/40 px-4 py-2 text-xs uppercase tracking-[0.3em] text-amber-300 hover:bg-amber-500/10"
                                >
                                    Close drop
                                </button>
                            </form>
                        )}
                        <form action={deleteDrop}>
                            <input type="hidden" name="id" value={drop.id} />
                            <button
                                type="submit"
                                className="rounded-full border border-red-400/40 px-4 py-2 text-xs uppercase tracking-[0.3em] text-red-300 hover:bg-red-500/10"
                            >
                                Delete
                            </button>
                        </form>
                        <Link
                            href="/admin/drops"
                            className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70 hover:bg-white/10"
                        >
                            Back
                        </Link>
                    </div>
                }
            >
                <form action={updateDrop} className="space-y-6">
                    <input type="hidden" name="id" value={drop.id} />

                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="space-y-2 text-sm text-white/80">
                            <span className="text-xs uppercase tracking-[0.3em] text-white/60">Title</span>
                            <input
                                name="title"
                                required
                                defaultValue={drop.title}
                                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
                            />
                        </label>
                        <label className="space-y-2 text-sm text-white/80">
                            <span className="text-xs uppercase tracking-[0.3em] text-white/60">Collection</span>
                            <select
                                name="collectionId"
                                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
                                defaultValue={drop.collectionId ?? ""}
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
                                defaultValue={drop.startsAt ? new Date(drop.startsAt).toISOString().slice(0, 16) : ""}
                                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
                            />
                        </label>
                        <label className="space-y-2 text-sm text-white/80">
                            <span className="text-xs uppercase tracking-[0.3em] text-white/60">Ends At</span>
                            <input
                                type="datetime-local"
                                name="endsAt"
                                defaultValue={drop.endsAt ? new Date(drop.endsAt).toISOString().slice(0, 16) : ""}
                                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
                            />
                        </label>
                        <label className="space-y-2 text-sm text-white/80">
                            <span className="text-xs uppercase tracking-[0.3em] text-white/60">Locale</span>
                            <select
                                name="locale"
                                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
                                defaultValue={drop.locale ?? ""}
                            >
                                <option value="" className="bg-black text-white">All locales</option>
                                <option value="EN" className="bg-black text-white">English only</option>
                                <option value="FR" className="bg-black text-white">French only</option>
                            </select>
                        </label>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="flex items-center gap-3 text-sm text-white/80">
                            <input
                                type="checkbox"
                                name="waitlistOpen"
                                defaultChecked={drop.waitlistOpen}
                                className="h-5 w-5 rounded border-white/20 bg-black/20"
                            />
                            <span>Waitlist open</span>
                        </label>
                        <div className="space-y-2 text-sm text-white/80">
                            <span className="text-xs uppercase tracking-[0.3em] text-white/60">Status</span>
                            <p className={`font-medium ${isActive ? "text-emerald-400" : "text-white/50"}`}>
                                {isActive ? "Live" : "Closed"}
                            </p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="rounded-full bg-white px-5 py-2 text-xs uppercase tracking-[0.3em] text-black transition hover:scale-[1.02]"
                    >
                        Save changes
                    </button>
                </form>
            </AdminSection>

            <AdminSection
                eyebrow="Waitlist"
                title={`${drop.waitlistEntries.length} entries`}
                description="Email signups awaiting access."
            >
                {drop.waitlistEntries.length > 0 ? (
                    <div className="overflow-hidden rounded-2xl border border-white/10">
                        <table className="w-full text-sm text-white/80">
                            <thead className="bg-white/5 text-[0.7rem] uppercase tracking-[0.35em] text-white/60">
                                <tr>
                                    <th className="px-4 py-3 text-left">Email</th>
                                    <th className="px-4 py-3 text-left">Signed Up</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {drop.waitlistEntries.map((entry) => (
                                    <tr key={entry.id} className="hover:bg-white/5">
                                        <td className="px-4 py-3 text-white">{entry.email}</td>
                                        <td className="px-4 py-3 text-white/60">
                                            {new Date(entry.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-6 text-center text-white/60">
                        No waitlist signups yet.
                    </div>
                )}
            </AdminSection>
        </div>
    );
}
