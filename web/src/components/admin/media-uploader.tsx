"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, X, Loader2, Image as ImageIcon, Film, Check } from "lucide-react";
import Image from "next/image";

export interface UploadedMedia {
    publicId: string;
    url: string;
    width: number;
    height: number;
    type: "image" | "video";
    format?: string;
}

interface MediaUploaderProps {
    folder?: string;
    onUpload: (media: UploadedMedia) => void;
    onRemove?: (publicId: string) => void;
    existingMedia?: UploadedMedia[];
    maxFiles?: number;
    acceptImages?: boolean;
    acceptVideos?: boolean;
}

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

export function MediaUploader({
    folder = "maison-aurele/media",
    onUpload,
    onRemove,
    existingMedia = [],
    maxFiles = 10,
    acceptImages = true,
    acceptVideos = true,
}: MediaUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const acceptedTypes = [
        ...(acceptImages ? IMAGE_TYPES : []),
        ...(acceptVideos ? VIDEO_TYPES : []),
    ];

    const isVideoFile = (file: File) => VIDEO_TYPES.includes(file.type);

    const handleUpload = useCallback(
        async (files: FileList | File[]) => {
            const fileArray = Array.from(files);

            // Validate file count
            if (existingMedia.length + fileArray.length > maxFiles) {
                setError(`Maximum ${maxFiles} files allowed`);
                return;
            }

            // Validate file types
            const invalidFiles = fileArray.filter(
                (f) => !acceptedTypes.includes(f.type)
            );
            if (invalidFiles.length > 0) {
                const accepted = [];
                if (acceptImages) accepted.push("images");
                if (acceptVideos) accepted.push("videos (MP4, WebM)");
                setError(`Only ${accepted.join(" and ")} are allowed`);
                return;
            }

            // Check video file size (50MB limit for Cloudinary free tier)
            const largeVideos = fileArray.filter(
                (f) => isVideoFile(f) && f.size > 50 * 1024 * 1024
            );
            if (largeVideos.length > 0) {
                setError("Video files must be under 50MB");
                return;
            }

            setUploading(true);
            setError(null);
            setUploadProgress(0);

            try {
                for (let i = 0; i < fileArray.length; i++) {
                    const file = fileArray[i];
                    const isVideo = isVideoFile(file);
                    const resourceType = isVideo ? "video" : "image";

                    // Get signature from our API
                    const signatureRes = await fetch("/api/cloudinary/signature", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ folder, resourceType }),
                    });

                    if (!signatureRes.ok) {
                        throw new Error("Failed to get upload signature");
                    }

                    const { signature, timestamp, apiKey, cloudName } =
                        await signatureRes.json();

                    const formData = new FormData();
                    formData.append("file", file);
                    formData.append("api_key", apiKey);
                    formData.append("timestamp", String(timestamp));
                    formData.append("signature", signature);
                    formData.append("folder", folder);
                    // Note: Not using upload_preset since we're doing signed uploads

                    // Use different endpoint for videos vs images
                    const uploadRes = await fetch(
                        `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
                        { method: "POST", body: formData }
                    );

                    if (!uploadRes.ok) {
                        const errData = await uploadRes.json().catch(() => ({}));
                        throw new Error(errData.error?.message || "Upload failed");
                    }

                    const data = await uploadRes.json();

                    onUpload({
                        publicId: data.public_id,
                        url: data.secure_url,
                        width: data.width,
                        height: data.height,
                        type: isVideo ? "video" : "image",
                        format: data.format,
                    });

                    setUploadProgress(((i + 1) / fileArray.length) * 100);
                }
            } catch (err) {
                console.error("Upload error:", err);
                setError(err instanceof Error ? err.message : "Failed to upload. Please try again.");
            } finally {
                setUploading(false);
                setUploadProgress(0);
            }
        },
        [folder, onUpload, existingMedia.length, maxFiles, acceptedTypes, acceptImages, acceptVideos]
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

    const acceptString = acceptedTypes.join(",");
    const typeLabels = [];
    if (acceptImages) typeLabels.push("Images");
    if (acceptVideos) typeLabels.push("Videos (MP4, WebM)");

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
                        ? "border-[var(--gilded-rose)] bg-[var(--gilded-rose)]/5"
                        : "border-white/20 hover:border-white/40 hover:bg-white/5"
                    }
          ${uploading ? "pointer-events-none opacity-60" : ""}
        `}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept={acceptString}
                    multiple={maxFiles > 1}
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
                        <div className="flex items-center gap-2">
                            <ImageIcon size={20} className="text-white/40" />
                            {acceptVideos && <Film size={20} className="text-white/40" />}
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-white/70">
                                Drop files here or click to upload
                            </p>
                            <p className="text-xs text-white/40 mt-1">
                                {typeLabels.join(" • ")} • Max {maxFiles} file{maxFiles > 1 ? "s" : ""}
                            </p>
                            {acceptVideos && (
                                <p className="text-xs text-white/30 mt-1">
                                    Videos must be under 50MB
                                </p>
                            )}
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

            {/* Media Grid */}
            {existingMedia.length > 0 && (
                <div className="grid grid-cols-4 gap-3">
                    {existingMedia.map((media, index) => (
                        <div
                            key={media.publicId}
                            className="group relative aspect-[3/4] overflow-hidden rounded-xl bg-white/5 border border-white/10"
                        >
                            {media.type === "video" ? (
                                <video
                                    src={media.url}
                                    className="h-full w-full object-cover"
                                    muted
                                    loop
                                    onMouseEnter={(e) => e.currentTarget.play()}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.pause();
                                        e.currentTarget.currentTime = 0;
                                    }}
                                />
                            ) : (
                                <Image
                                    src={media.url}
                                    alt={`Media ${index + 1}`}
                                    fill
                                    sizes="120px"
                                    className="object-cover"
                                />
                            )}

                            {/* Type Badge */}
                            <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[0.5rem] font-medium text-white">
                                {media.type === "video" ? (
                                    <>
                                        <Film size={10} />
                                        Video
                                    </>
                                ) : (
                                    <>
                                        <ImageIcon size={10} />
                                        Image
                                    </>
                                )}
                            </div>

                            {/* Remove Button */}
                            {onRemove && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onRemove(media.publicId);
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
