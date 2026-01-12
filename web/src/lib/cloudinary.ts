import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

export { cloudinary };

/**
 * Check if Cloudinary is configured
 */
export function isCloudinaryConfigured(): boolean {
    return Boolean(
        process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET
    );
}

/**
 * Generate signed upload parameters for client-side uploads
 */
export function generateUploadSignature(folder: string = "maison-aurele") {
    const timestamp = Math.round(Date.now() / 1000);

    // IMPORTANT: These params must EXACTLY match what's sent to Cloudinary
    // The media-uploader only sends: file, api_key, timestamp, signature, folder
    const params = {
        timestamp,
        folder,
    };

    const signature = cloudinary.utils.api_sign_request(
        params,
        process.env.CLOUDINARY_API_SECRET!
    );

    return {
        signature,
        timestamp,
        apiKey: process.env.CLOUDINARY_API_KEY!,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
        folder,
    };
}

/**
 * Delete an image from Cloudinary
 */
export async function deleteImage(publicId: string): Promise<boolean> {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result.result === "ok";
    } catch (error) {
        console.error("[Cloudinary] Delete failed:", error);
        return false;
    }
}

/**
 * Get optimized URL for an image
 */
export function getOptimizedUrl(
    publicId: string,
    options: {
        width?: number;
        height?: number;
        crop?: "fill" | "fit" | "scale" | "thumb";
        quality?: number | "auto";
        format?: "auto" | "webp" | "avif" | "jpg" | "png";
    } = {}
): string {
    const {
        width,
        height,
        crop = "fill",
        quality = "auto",
        format = "auto",
    } = options;

    return cloudinary.url(publicId, {
        width,
        height,
        crop,
        quality,
        fetch_format: format,
        secure: true,
    });
}

/**
 * Transform URL for responsive images
 */
export function getResponsiveUrls(
    publicId: string,
    sizes: number[] = [400, 800, 1200, 1600]
): Record<number, string> {
    const urls: Record<number, string> = {};

    for (const size of sizes) {
        urls[size] = getOptimizedUrl(publicId, {
            width: size,
            quality: "auto",
            format: "auto",
        });
    }

    return urls;
}
