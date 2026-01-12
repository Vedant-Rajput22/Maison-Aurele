"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, X, Loader2, GripVertical } from "lucide-react";
import Image from "next/image";

interface UploadedMedia {
    id?: string;
    publicId: string;
    url: string;
    alt?: string;
    placement?: string;
    sortOrder?: number;
}

interface ProductMediaUploaderProps {
    productId: string;
    existingMedia: UploadedMedia[];
    onUploadComplete: (media: UploadedMedia) => Promise<void>;
}

export function ProductMediaUploader({
    productId,
    existingMedia,
    onUploadComplete,
}: ProductMediaUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleUpload = useCallback(
        async (files: FileList | File[]) => {
            const fileArray = Array.from(files);

            // Validate file types
            const acceptedTypes = ["image/jpeg", "image/png", "image/webp"];
            const invalidFiles = fileArray.filter(
                (f) => !acceptedTypes.includes(f.type)
            );
            if (invalidFiles.length > 0) {
                setError("Only JPEG, PNG, and WebP images are allowed");
                return;
            }

            setUploading(true);
            setError(null);
            setUploadProgress(0);

            try {
                // Get signature from our API
                const signatureRes = await fetch("/api/cloudinary/signature", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ folder: `maison-aurele/products/${productId}` }),
                });

                if (!signatureRes.ok) {
                    throw new Error("Failed to get upload signature");
                }

                const { signature, timestamp, apiKey, cloudName } =
                    await signatureRes.json();

                // Upload each file
                for (let i = 0; i < fileArray.length; i++) {
                    const file = fileArray[i];
                    const formData = new FormData();
                    formData.append("file", file);
                    formData.append("api_key", apiKey);
                    formData.append("timestamp", String(timestamp));
                    formData.append("signature", signature);
                    formData.append("folder", `maison-aurele/products/${productId}`);

                    const uploadRes = await fetch(
                        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                        { method: "POST", body: formData }
                    );

                    if (!uploadRes.ok) {
                        const errorData = await uploadRes.json();
                        throw new Error(errorData.error?.message || "Upload failed");
                    }

                    const data = await uploadRes.json();

                    // Call the server action to save to database
                    await onUploadComplete({
                        publicId: data.public_id,
                        url: data.secure_url,
                        alt: file.name.replace(/\.[^/.]+$/, ""),
                        placement: "gallery",
                        sortOrder: existingMedia.length + i + 1,
                    });

                    setUploadProgress(((i + 1) / fileArray.length) * 100);
                }
            } catch (err) {
                console.error("Upload error:", err);
                setError(err instanceof Error ? err.message : "Failed to upload image");
            } finally {
                setUploading(false);
                setUploadProgress(0);
            }
        },
        [productId, onUploadComplete, existingMedia.length]
    );

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                handleUpload(e.dataTransfer.files);
            }
        },
        [handleUpload]
    );

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files && e.target.files.length > 0) {
                handleUpload(e.target.files);
            }
        },
        [handleUpload]
    );

    return (
        <div className="space-y-4">
            {/* Upload Area */}
            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className={`
          relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-6 cursor-pointer transition-all
          ${dragActive
                        ? "border-[var(--gilded-rose)] bg-[var(--gilded-rose)]/10"
                        : "border-white/20 hover:border-white/40 hover:bg-white/5"
                    }
          ${uploading ? "pointer-events-none opacity-60" : ""}
        `}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={handleInputChange}
                    className="hidden"
                />

                {uploading ? (
                    <>
                        <Loader2 size={24} className="animate-spin text-white/50" />
                        <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                            Uploading... {Math.round(uploadProgress)}%
                        </p>
                    </>
                ) : (
                    <>
                        <Upload size={24} className="text-white/40" />
                        <div className="text-center">
                            <p className="text-sm text-white/70">
                                Drop images here or click to upload
                            </p>
                            <p className="text-xs text-white/40 mt-1">
                                JPEG, PNG, WebP • Uploads directly to Cloudinary
                            </p>
                        </div>
                    </>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <p className="text-xs text-red-400 bg-red-500/10 px-4 py-2 rounded-lg">
                    {error}
                </p>
            )}

            {/* Uploaded Images Preview */}
            {existingMedia.length > 0 && (
                <div className="grid grid-cols-6 gap-3">
                    {existingMedia.map((media, index) => (
                        <div
                            key={media.id || media.publicId}
                            className="group relative aspect-[3/4] overflow-hidden rounded-xl bg-white/5 border border-white/10"
                        >
                            <Image
                                src={media.url}
                                alt={media.alt || `Image ${index + 1}`}
                                fill
                                sizes="100px"
                                className="object-cover"
                            />

                            {/* Index Badge */}
                            <div className="absolute left-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-[0.5rem] font-medium text-white">
                                {index + 1}
                            </div>

                            {/* Placement Badge */}
                            {media.placement && (
                                <div className="absolute bottom-2 left-2 right-2 text-center">
                                    <span className="text-[0.5rem] uppercase tracking-wider bg-black/60 text-white/80 px-2 py-0.5 rounded">
                                        {media.placement}
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
