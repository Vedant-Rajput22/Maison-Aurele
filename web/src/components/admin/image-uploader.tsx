"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, X, Loader2, Image as ImageIcon, Check } from "lucide-react";
import Image from "next/image";

interface UploadedImage {
    publicId: string;
    url: string;
    width: number;
    height: number;
}

interface ImageUploaderProps {
    folder?: string;
    onUpload: (image: UploadedImage) => void;
    onRemove?: (publicId: string) => void;
    existingImages?: UploadedImage[];
    maxFiles?: number;
    acceptedTypes?: string[];
}

export function ImageUploader({
    folder = "maison-aurele/products",
    onUpload,
    onRemove,
    existingImages = [],
    maxFiles = 10,
    acceptedTypes = ["image/jpeg", "image/png", "image/webp"],
}: ImageUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleUpload = useCallback(
        async (files: FileList | File[]) => {
            const fileArray = Array.from(files);

            // Validate file count
            if (existingImages.length + fileArray.length > maxFiles) {
                setError(`Maximum ${maxFiles} images allowed`);
                return;
            }

            // Validate file types
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
                    body: JSON.stringify({ folder }),
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
                    formData.append("folder", folder);
                    // Note: Not using upload_preset since we're doing signed uploads

                    const uploadRes = await fetch(
                        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                        { method: "POST", body: formData }
                    );

                    if (!uploadRes.ok) {
                        throw new Error("Upload failed");
                    }

                    const data = await uploadRes.json();

                    onUpload({
                        publicId: data.public_id,
                        url: data.secure_url,
                        width: data.width,
                        height: data.height,
                    });

                    setUploadProgress(((i + 1) / fileArray.length) * 100);
                }
            } catch (err) {
                console.error("Upload error:", err);
                setError("Failed to upload image. Please try again.");
            } finally {
                setUploading(false);
                setUploadProgress(0);
            }
        },
        [folder, onUpload, existingImages.length, maxFiles, acceptedTypes]
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
          relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 cursor-pointer transition-all
          ${dragActive
                        ? "border-[var(--gilded-rose)] bg-[var(--gilded-rose)]/5"
                        : "border-ink/20 hover:border-ink/40 hover:bg-ink/5"
                    }
          ${uploading ? "pointer-events-none opacity-60" : ""}
        `}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept={acceptedTypes.join(",")}
                    multiple
                    onChange={handleInputChange}
                    className="hidden"
                />

                {uploading ? (
                    <>
                        <Loader2 size={24} className="animate-spin text-ink/50" />
                        <p className="text-xs uppercase tracking-[0.3em] text-ink/50">
                            Uploading... {Math.round(uploadProgress)}%
                        </p>
                    </>
                ) : (
                    <>
                        <Upload size={24} className="text-ink/40" />
                        <div className="text-center">
                            <p className="text-sm text-ink/70">
                                Drop images here or click to upload
                            </p>
                            <p className="text-xs text-ink/40 mt-1">
                                JPEG, PNG, WebP • Max {maxFiles} images
                            </p>
                        </div>
                    </>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <p className="text-xs text-red-600 bg-red-50 px-4 py-2 rounded-lg">
                    {error}
                </p>
            )}

            {/* Image Grid */}
            {existingImages.length > 0 && (
                <div className="grid grid-cols-4 gap-3">
                    {existingImages.map((image, index) => (
                        <div
                            key={image.publicId}
                            className="group relative aspect-[3/4] overflow-hidden rounded-xl bg-ink/5"
                        >
                            <Image
                                src={image.url}
                                alt={`Image ${index + 1}`}
                                fill
                                sizes="120px"
                                className="object-cover"
                            />

                            {/* Index Badge */}
                            <div className="absolute left-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-ink/80 text-[0.5rem] font-medium text-white">
                                {index + 1}
                            </div>

                            {/* Remove Button */}
                            {onRemove && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onRemove(image.publicId);
                                    }}
                                    className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
                                >
                                    <X size={12} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
