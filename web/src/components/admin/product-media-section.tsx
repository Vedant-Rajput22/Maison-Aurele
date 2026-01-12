"use client";

import { useRouter } from "next/navigation";
import { ProductMediaUploader } from "./product-media-uploader";

interface UploadedMedia {
    id?: string;
    publicId: string;
    url: string;
    alt?: string;
    placement?: string;
    sortOrder?: number;
}

interface ProductMediaSectionProps {
    productId: string;
    existingMedia: UploadedMedia[];
}

export function ProductMediaSection({
    productId,
    existingMedia,
}: ProductMediaSectionProps) {
    const router = useRouter();

    const handleUploadComplete = async (media: UploadedMedia) => {
        // Call server action via form submission
        const formData = new FormData();
        formData.append("productId", productId);
        formData.append("url", media.url);
        formData.append("alt", media.alt || "");
        formData.append("placement", media.placement || "gallery");
        formData.append("sortOrder", String(media.sortOrder || 1));
        formData.append("type", "IMAGE");
        formData.append("publicId", media.publicId);

        // Submit to server action
        await fetch("/api/admin/product-media", {
            method: "POST",
            body: formData,
        });

        // Refresh the page to show new media
        router.refresh();
    };

    return (
        <ProductMediaUploader
            productId={productId}
            existingMedia={existingMedia}
            onUploadComplete={handleUploadComplete}
        />
    );
}
