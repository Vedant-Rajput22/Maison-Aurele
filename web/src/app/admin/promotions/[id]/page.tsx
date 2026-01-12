import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminSection } from "@/components/admin/admin-section";
import { updatePromotion, deletePromotion } from "@/lib/admin/actions/promotions";
import { prisma } from "@/lib/prisma";

type PageParams = { id: string } | Promise<{ id: string }>;

export default async function EditPromotionPage({ params }: { params: PageParams }) {
    const resolved = await params;
    const promo = await prisma.promotion.findUnique({
        where: { id: resolved.id },
    });

    if (!promo) {
        notFound();
    }

    return (
        <div className="space-y-10">
            <AdminSection
                eyebrow="Commerce"
                title={`Edit ${promo.code}`}
                description="Update promotion details."
                actions={
                    <div className="flex items-center gap-3">
                        <form action={deletePromotion}>
                            <input type="hidden" name="id" value={promo.id} />
                            <button
                                type="submit"
                                className="rounded-full border border-red-400/40 px-4 py-2 text-xs uppercase tracking-[0.3em] text-red-300 hover:bg-red-500/10"
                            >
                                Delete
                            </button>
                        </form>
                        <Link
                            href="/admin/promotions"
                            className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70 hover:bg-white/10"
                        >
                            Back
                        </Link>
                    </div>
                }
            >
                <form action={updatePromotion} className="space-y-6">
                    <input type="hidden" name="id" value={promo.id} />

                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="space-y-2 text-sm text-white/80">
                            <span className="text-xs uppercase tracking-[0.3em] text-white/60">Code</span>
                            <input
                                name="code"
                                required
                                defaultValue={promo.code}
                                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white uppercase"
                            />
                        </label>
                        <label className="space-y-2 text-sm text-white/80">
                            <span className="text-xs uppercase tracking-[0.3em] text-white/60">Description</span>
                            <input
                                name="description"
                                defaultValue={promo.description ?? ""}
                                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
                            />
                        </label>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="space-y-2 text-sm text-white/80">
                            <span className="text-xs uppercase tracking-[0.3em] text-white/60">Discount Type</span>
                            <select
                                name="discountType"
                                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
                                defaultValue={promo.discountType}
                            >
                                <option value="percentage" className="bg-black text-white">Percentage (%)</option>
                                <option value="amount" className="bg-black text-white">Fixed amount (cents)</option>
                                <option value="shipping" className="bg-black text-white">Free shipping</option>
                            </select>
                        </label>
                        <label className="space-y-2 text-sm text-white/80">
                            <span className="text-xs uppercase tracking-[0.3em] text-white/60">Discount Value</span>
                            <input
                                name="discountValue"
                                type="number"
                                required
                                defaultValue={promo.discountValue}
                                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
                            />
                        </label>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        <label className="space-y-2 text-sm text-white/80">
                            <span className="text-xs uppercase tracking-[0.3em] text-white/60">Starts At</span>
                            <input
                                type="datetime-local"
                                name="startsAt"
                                defaultValue={promo.startsAt ? new Date(promo.startsAt).toISOString().slice(0, 16) : ""}
                                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
                            />
                        </label>
                        <label className="space-y-2 text-sm text-white/80">
                            <span className="text-xs uppercase tracking-[0.3em] text-white/60">Ends At (optional)</span>
                            <input
                                type="datetime-local"
                                name="endsAt"
                                defaultValue={promo.endsAt ? new Date(promo.endsAt).toISOString().slice(0, 16) : ""}
                                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
                            />
                        </label>
                        <label className="space-y-2 text-sm text-white/80">
                            <span className="text-xs uppercase tracking-[0.3em] text-white/60">Usage Limit</span>
                            <input
                                name="usageLimit"
                                type="number"
                                defaultValue={promo.usageLimit ?? ""}
                                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
                            />
                        </label>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        <label className="space-y-2 text-sm text-white/80">
                            <span className="text-xs uppercase tracking-[0.3em] text-white/60">Locale</span>
                            <select
                                name="locale"
                                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
                                defaultValue={promo.locale ?? ""}
                            >
                                <option value="" className="bg-black text-white">All locales</option>
                                <option value="EN" className="bg-black text-white">English only</option>
                                <option value="FR" className="bg-black text-white">French only</option>
                            </select>
                        </label>
                        <label className="flex items-center gap-3 text-sm text-white/80 pt-6">
                            <input
                                type="checkbox"
                                name="limitedEditionOnly"
                                className="h-5 w-5 rounded border-white/20 bg-black/20"
                                defaultChecked={promo.limitedEditionOnly}
                            />
                            <span>Limited Edition only</span>
                        </label>
                        <div className="space-y-2 text-sm text-white/80">
                            <span className="text-xs uppercase tracking-[0.3em] text-white/60">Stats</span>
                            <p className="text-white/70">Used: {promo.timesUsed ?? 0} times</p>
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
        </div>
    );
}
