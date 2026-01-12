"use client";

import { useState, useCallback } from "react";
import { MediaUploader, UploadedMedia } from "@/components/admin/media-uploader";
import { Plus } from "lucide-react";

interface AddLookbookSlideFormProps {
    collectionId: string;
    collectionSlug: string;
    nextSortOrder: number;
    onSubmit: (formData: FormData) => Promise<void>;
}

export function AddLookbookSlideForm({
    collectionId,
    collectionSlug,
    nextSortOrder,
    onSubmit,
}: AddLookbookSlideFormProps) {
    const [uploadedMedia, setUploadedMedia] = useState<UploadedMedia | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleUpload = useCallback((media: UploadedMedia) => {
        setUploadedMedia(media);
    }, []);

    const handleRemove = useCallback(() => {
        setUploadedMedia(null);
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!uploadedMedia) return;

        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        formData.set("url", uploadedMedia.url);

        try {
            await onSubmit(formData);
            setUploadedMedia(null);
            (e.target as HTMLFormElement).reset();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-white/60">Add slide</p>

            {/* Media Upload (Images + Videos) */}
            <div className="mb-4">
                <MediaUploader
                    folder="maison-aurele/lookbook"
                    onUpload={handleUpload}
                    onRemove={handleRemove}
                    existingMedia={uploadedMedia ? [uploadedMedia] : []}
                    maxFiles={1}
                    acceptImages={true}
                    acceptVideos={true}
                />
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
                <input type="hidden" name="collectionId" value={collectionId} />
                <input type="hidden" name="slug" value={collectionSlug} />
                <input type="hidden" name="url" value={uploadedMedia?.url ?? ""} />

                <input
                    name="frTitle"
                    placeholder="Titre FR"
                    className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
                    required
                />
                <input
                    name="enTitle"
                    placeholder="Title EN"
                    className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
                    required
                />
                <input
                    name="sortOrder"
                    type="number"
                    defaultValue={nextSortOrder}
                    className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
                />
                <input
                    name="hotspotProductId"
                    placeholder="Product ID"
                    className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
                />
                <button
                    type="submit"
                    disabled={!uploadedMedia || isSubmitting}
                    className="col-span-2 inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-xs uppercase tracking-[0.3em] text-black transition hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Plus size={14} />
                    {isSubmitting ? "Adding..." : "Add slide"}
                </button>
                <textarea
                    name="frBody"
                    placeholder="Body FR"
                    className="col-span-3 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
                    rows={2}
                />
                <textarea
                    name="enBody"
                    placeholder="Body EN"
                    className="col-span-3 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
                    rows={2}
                />
                <textarea
                    name="frCaption"
                    placeholder="Caption FR"
                    className="col-span-3 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
                    rows={2}
                />
                <textarea
                    name="enCaption"
                    placeholder="Caption EN"
                    className="col-span-3 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
                    rows={2}
                />
            </form>

            {!uploadedMedia && (
                <p className="mt-3 text-xs text-white/40">
                    Upload an image or video above to enable the Add slide button
                </p>
            )}
        </div>
    );
}
