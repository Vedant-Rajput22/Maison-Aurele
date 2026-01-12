import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
    // Check authentication
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const productId = formData.get("productId") as string;
        const url = formData.get("url") as string;
        const alt = formData.get("alt") as string;
        const placement = formData.get("placement") as string;
        const sortOrder = parseInt(formData.get("sortOrder") as string) || 1;
        const type = (formData.get("type") as string) || "IMAGE";
        const publicId = formData.get("publicId") as string;

        if (!productId || !url) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Create media asset
        const asset = await prisma.mediaAsset.create({
            data: {
                type: type === "VIDEO" ? "VIDEO" : "IMAGE",
                url,
                alt: alt || null,
                publicId: publicId || null,
                provider: "cloudinary",
            },
        });

        // Link to product
        await prisma.productMedia.create({
            data: {
                productId,
                assetId: asset.id,
                placement: placement || "gallery",
                sortOrder,
            },
        });

        // Revalidate admin page
        revalidatePath("/admin/products");

        // Get product slug for revalidation
        const product = await prisma.product.findUnique({
            where: { id: productId },
            select: { slug: true },
        });

        if (product) {
            revalidatePath(`/admin/products/${product.slug}`);
        }

        return NextResponse.json({ success: true, assetId: asset.id });
    } catch (error) {
        console.error("[API] Product media upload error:", error);
        return NextResponse.json({ error: "Failed to save media" }, { status: 500 });
    }
}
