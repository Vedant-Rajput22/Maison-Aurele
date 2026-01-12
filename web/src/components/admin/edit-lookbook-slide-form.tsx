"use client";

import { useState, useCallback } from "react";
import { MediaUploader, UploadedMedia } from "@/components/admin/media-uploader";
import { Trash2, Image as ImageIcon, Film } from "lucide-react";
import Image from "next/image";

interface LookbookSlideTranslation {
    locale: string;
    title?: string | null;
    body?: string | null;
    caption?: string | null;
}

interface LookbookSlide {
    id: string;
    sortOrder: number;
    hotspotProductId?: string | null;
    asset: {
        url: string;
    };
    translations: LookbookSlideTranslation[];
}

interface EditLookbookSlideFormProps {
    slide: LookbookSlide;
    collectionSlug: string;
    onUpdate: (formData: FormData) => Promise<void>;
    onDelete: (formData: FormData) => Promise<void>;
}

function isVideoUrl(url: string): boolean {
    return /\.(mp4|webm|mov|avi)$/i.test(url) || url.includes('/video/');
}

export function EditLookbookSlideForm({
    slide,
    collectionSlug,
    onUpdate,
    onDelete,
}: EditLookbookSlideFormProps) {
    const [uploadedMedia, setUploadedMedia] = useState<UploadedMedia | null>(null);
    const [showUploader, setShowUploader] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const frSlide = slide.translations.find((t) => t.locale === "FR");
    const enSlide = slide.translations.find((t) => t.locale === "EN");

    const handleUpload = useCallback((media: UploadedMedia) => {
        setUploadedMedia(media);
    }, []);

    const handleRemove = useCallback(() => {
        setUploadedMedia(null);
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        // Use new media if uploaded, otherwise keep existing
        formData.set("url", uploadedMedia?.url ?? slide.asset.url);

        try {
            await onUpdate(formData);
            setShowUploader(false);
            setUploadedMedia(null);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        const formData = new FormData();
        formData.set("id", slide.id);
        formData.set("slug", collectionSlug);
        await onDelete(formData);
    };

    const currentMediaUrl = uploadedMedia?.url ?? slide.asset.url;
    const currentIsVideo = uploadedMedia ? uploadedMedia.type === "video" : isVideoUrl(slide.asset.url);

    return (
        <tr className="border-t border-white/10">
            <td colSpan={6} className="px-0">
                <form onSubmit={handleSubmit} className="space-y-4 px-4 py-4">
                    <input type="hidden" name="id" value={slide.id} />
                    <input type="hidden" name="slug" value={collectionSlug} />
                    <input type="hidden" name="url" value={currentMediaUrl} />

                    {/* Current Media + Upload Toggle */}
                    <div className="flex items-start gap-4">
                        {/* Media Preview */}
                        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-white/20">
                            {currentIsVideo ? (
                                <video
                                    src={currentMediaUrl}
                                    className="h-full w-full object-cover"
                                    muted
                                    loop
                                    onMouseEnter={(e) => e.currentTarget.play()}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.pause();
                                        e.currentTarget.currentTime = 0;
                                    }}
                                />
                            ) : currentMediaUrl ? (
                                <Image
                                    src={currentMediaUrl}
                                    alt="Slide preview"
                                    fill
                                    sizes="96px"
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-white/5">
                                    <ImageIcon size={24} className="text-white/30" />
                                </div>
                            )}

                            {/* Type Badge */}
                            <div className="absolute left-1 top-1 flex items-center gap-0.5 rounded-full bg-black/60 px-1.5 py-0.5 text-[0.45rem] font-medium text-white">
                                {currentIsVideo ? <Film size={8} /> : <ImageIcon size={8} />}
                                {currentIsVideo ? "Video" : "Image"}
                            </div>

                            {uploadedMedia && (
                                <div className="absolute inset-0 flex items-center justify-center bg-green-500/20">
                                    <span className="rounded-full bg-green-500 px-2 py-0.5 text-[0.5rem] uppercase text-white">
                                        New
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Upload Area (conditional) */}
                        <div className="flex-1">
                            {showUploader ? (
                                <div className="space-y-2">
                                    <MediaUploader
                                        folder="maison-aurele/lookbook"
                                        onUpload={handleUpload}
                                        onRemove={handleRemove}
                                        existingMedia={uploadedMedia ? [uploadedMedia] : []}
                                        maxFiles={1}
                                        acceptImages={true}
                                        acceptVideos={true}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowUploader(false);
                                            setUploadedMedia(null);
                                        }}
                                        className="text-xs text-white/50 hover:text-white/80"
                                    >
                                        Cancel upload
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setShowUploader(true)}
                                    className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/60 hover:bg-white/10 hover:text-white"
                                >
                                    Replace Media
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-6 items-center gap-3">
                        <input
                            name="frTitle"
                            defaultValue={frSlide?.title ?? ""}
                            className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
                            placeholder="Titre FR"
                        />
                        <input
                            name="enTitle"
                            defaultValue={enSlide?.title ?? ""}
                            className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
                            placeholder="Title EN"
                        />
                        <input
                            name="sortOrder"
                            type="number"
                            defaultValue={slide.sortOrder}
                            className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
                        />
                        <input
                            name="hotspotProductId"
                            defaultValue={slide.hotspotProductId ?? ""}
                            className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
                            placeholder="Product ID"
                        />
                        <div className="col-span-2 flex items-center justify-end gap-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="rounded-full border border-white/30 px-4 py-1.5 text-[0.7rem] uppercase tracking-[0.3em] text-white/80 hover:bg-white/10 disabled:opacity-50"
                            >
                                {isSubmitting ? "Saving..." : "Save"}
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="rounded-full border border-red-400/60 p-2 text-red-300 hover:bg-red-500/10"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Body/Caption Fields */}
                    <div className="grid grid-cols-6 gap-3">
                        <textarea
                            name="frBody"
                            defaultValue={frSlide?.body ?? ""}
                            className="col-span-3 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
                            placeholder="Body FR"
                            rows={2}
                        />
                        <textarea
                            name="enBody"
                            defaultValue={enSlide?.body ?? ""}
                            className="col-span-3 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
                            placeholder="Body EN"
                            rows={2}
                        />
                        <textarea
                            name="frCaption"
                            defaultValue={frSlide?.caption ?? ""}
                            className="col-span-3 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
                            placeholder="Caption FR"
                            rows={2}
                        />
                        <textarea
                            name="enCaption"
                            defaultValue={enSlide?.caption ?? ""}
                            className="col-span-3 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
                            placeholder="Caption EN"
                            rows={2}
                        />
                    </div>
                </form>
            </td>
        </tr>
    );
}
