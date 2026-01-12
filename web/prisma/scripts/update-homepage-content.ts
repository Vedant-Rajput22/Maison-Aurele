import "dotenv/config";
import { prisma } from "../../src/lib/prisma";
import { Locale } from "@prisma/client";

/**
 * Update Homepage Modules Script
 * 
 * This script updates the story_panels and lookbook_carousel modules
 * to link to existing collections with content, without reseeding all data.
 */

async function main() {
    console.log("🔄 Updating homepage modules...\n");

    // Find collections with sections (for story panels) and lookbook slides
    const collections = await prisma.collection.findMany({
        include: {
            sections: { take: 1 },
            lookbookSlides: { take: 1 },
        },
    });

    const collectionWithSections = collections.find(c => c.sections.length > 0);
    const collectionWithLookbook = collections.find(c => c.lookbookSlides.length > 0);

    console.log(`Found collection with sections: ${collectionWithSections?.slug || "none"}`);
    console.log(`Found collection with lookbook: ${collectionWithLookbook?.slug || "none"}\n`);

    // Update story_panels modules for both locales
    for (const locale of [Locale.FR, Locale.EN]) {
        const slug = `story-panels-${locale.toLowerCase()}`;

        const module = await prisma.homepageModule.findUnique({
            where: { slug },
        });

        if (module && collectionWithSections) {
            const currentConfig = module.config as Record<string, unknown>;
            await prisma.homepageModule.update({
                where: { slug },
                data: {
                    config: {
                        ...currentConfig,
                        collectionSlug: collectionWithSections.slug,
                    },
                },
            });
            console.log(`✅ Updated ${slug} → collectionSlug: ${collectionWithSections.slug}`);
        }
    }

    // Update lookbook_carousel modules for both locales
    for (const locale of [Locale.FR, Locale.EN]) {
        const slug = `lookbook-carousel-${locale.toLowerCase()}`;

        const module = await prisma.homepageModule.findUnique({
            where: { slug },
        });

        if (module && collectionWithLookbook) {
            const currentConfig = module.config as Record<string, unknown>;
            await prisma.homepageModule.update({
                where: { slug },
                data: {
                    config: {
                        ...currentConfig,
                        collectionSlug: collectionWithLookbook.slug,
                    },
                },
            });
            console.log(`✅ Updated ${slug} → collectionSlug: ${collectionWithLookbook.slug}`);
        }
    }

    console.log("\n✨ Homepage modules updated successfully!");
}

main()
    .catch((err) => {
        console.error("❌ Update failed:", err);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
