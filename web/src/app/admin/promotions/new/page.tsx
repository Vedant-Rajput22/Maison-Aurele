import Link from "next/link";
import { AdminSection } from "@/components/admin/admin-section";
import { createPromotion } from "@/lib/admin/actions/promotions";

export default function NewPromotionPage() {
    return (
        <div className="space-y-10">
            <AdminSection
                eyebrow="Commerce"
                title="New promotion"
                description="Create a new discount code."
                actions={
                    <Link
                        href="/admin/promotions"
                        className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70 hover:bg-white/10"
                    >
                        Back
                    </Link>
                }
            >
                <form action={createPromotion} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="space-y-2 text-sm text-white/80">
                            <span className="text-xs uppercase tracking-[0.3em] text-white/60">Code</span>
                            <input
                                name="code"
                                required
                                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white uppercase"
                                placeholder="BIENVENUE"
                            />
                            <p className="text-xs text-white/50">Will be auto-uppercased. Letters, numbers, dashes only.</p>
                        </label>
                        <label className="space-y-2 text-sm text-white/80">
                            <span className="text-xs uppercase tracking-[0.3em] text-white/60">Description</span>
                            <input
                                name="description"
                                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
                                placeholder="Welcome discount — 10% off first order"
                            />
                        </label>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="space-y-2 text-sm text-white/80">
                            <span className="text-xs uppercase tracking-[0.3em] text-white/60">Discount Type</span>
                            <select
                                name="discountType"
                                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
                                defaultValue="percentage"
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
                                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
                                placeholder="10 (for 10% or 1000 for €10)"
                            />
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
                            <span className="text-xs uppercase tracking-[0.3em] text-white/60">Usage Limit</span>
                            <input
                                name="usageLimit"
                                type="number"
                                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
                                placeholder="Unlimited if empty"
                            />
                        </label>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
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
                        <label className="flex items-center gap-3 text-sm text-white/80 pt-6">
                            <input
                                type="checkbox"
                                name="limitedEditionOnly"
                                className="h-5 w-5 rounded border-white/20 bg-black/20"
                            />
                            <span>Limited Edition only</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="rounded-full bg-white px-5 py-2 text-xs uppercase tracking-[0.3em] text-black transition hover:scale-[1.02]"
                    >
                        Create promotion
                    </button>
                </form>
            </AdminSection>
        </div>
    );
}
