import { NextResponse } from "next/server";
import { generateUploadSignature, isCloudinaryConfigured } from "@/lib/cloudinary";
import { getCurrentUser } from "@/lib/auth/session";

export async function POST(request: Request) {
    // Check authentication
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    // Check if Cloudinary is configured
    if (!isCloudinaryConfigured()) {
        return NextResponse.json(
            { error: "Cloudinary is not configured" },
            { status: 500 }
        );
    }

    try {
        const body = await request.json();
        const folder = body.folder || "maison-aurele";

        const signatureData = generateUploadSignature(folder);

        return NextResponse.json(signatureData);
    } catch (error) {
        console.error("[API] Cloudinary signature error:", error);
        return NextResponse.json(
            { error: "Failed to generate upload signature" },
            { status: 500 }
        );
    }
}
