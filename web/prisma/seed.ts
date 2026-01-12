/**
 * Maison Aurèle – Main Seed Script
 * 
 * Seeds all database entities in correct dependency order.
 * Run with: npx prisma db seed
 */

import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { Locale, MediaType, ProductStatus } from "@prisma/client";

// Import all seed data
import {
    materials,
    categories,
    allProducts,
    collections,
    editorialPosts,
    promotions,
    limitedDrops,
    sampleAppointments,
} from "./seed-data";

// ═══════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════

function log(emoji: string, message: string) {
    console.log(`${emoji}  ${message}`);
}

function logSection(title: string) {
    console.log("\n" + "═".repeat(60));
    console.log(`   ${title}`);
    console.log("═".repeat(60));
}

// ═══════════════════════════════════════════════════════════════
// CLEAR DATABASE
// ═══════════════════════════════════════════════════════════════

async function clearDatabase() {
    logSection("CLEARING DATABASE");

    // Delete in reverse dependency order
    const tables = [
        "WaitlistEntry",
        "LimitedDrop",
        "Appointment",
        "PersonalizationRequest",
        "CertificateOfAuthenticity",
        "OrderItem",
        "PaymentRecord",
        "Order",
        "CartItem",
        "Cart",
        "Wishlist",
        "WishlistItem",
        "Promotion",
        "EditorialFeature",
        "EditorialBlockTranslation",
        "EditorialBlock",
        "EditorialTranslation",
        "EditorialPost",
        "LookbookSlideTranslation",
        "LookbookSlide",
        "CollectionSectionTranslation",
        "CollectionSection",
        "CollectionItem",
        "CollectionTranslation",
        "Collection",
        "ProductSpotlightModule",
        "HomepageModule",
        "ProductVariantMedia",
        "ProductMedia",
        "Inventory",
        "InventoryAdjustment",
        "ProductVariant",
        "ProductMaterial",
        "ProductTranslation",
        "Product",
        "Material",
        "CategoryTranslation",
        "Category",
        "MediaAsset",
    ];

    for (const table of tables) {
        try {
            await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE`);
        } catch {
            // Table might not exist or be empty
        }
    }

    log("🗑️", "Database cleared");
}

// ═══════════════════════════════════════════════════════════════
// SEED MATERIALS
// ═══════════════════════════════════════════════════════════════

async function seedMaterials() {
    logSection("SEEDING MATERIALS");

    for (const mat of materials) {
        await prisma.material.create({
            data: {
                id: mat.id,
                name: mat.name,
                origin: mat.origin,
                sustainabilityNotes: mat.sustainabilityNotes,
            },
        });
        log("🧵", `Created material: ${mat.name}`);
    }

    log("✓", `Seeded ${materials.length} materials`);
}

// ═══════════════════════════════════════════════════════════════
// SEED CATEGORIES
// ═══════════════════════════════════════════════════════════════

async function seedCategories() {
    logSection("SEEDING CATEGORIES");

    // First pass: create categories without parent references
    for (const cat of categories) {
        await prisma.category.create({
            data: {
                id: cat.id,
                slug: cat.slug,
            },
        });
    }

    // Second pass: set parent references and create translations
    for (const cat of categories) {
        if (cat.parentId) {
            await prisma.category.update({
                where: { id: cat.id },
                data: { parentId: cat.parentId },
            });
        }

        for (const trans of cat.translations) {
            await prisma.categoryTranslation.create({
                data: {
                    categoryId: cat.id,
                    locale: trans.locale,
                    title: trans.title,
                    description: trans.description,
                },
            });
        }

        log("📁", `Created category: ${cat.slug}`);
    }

    log("✓", `Seeded ${categories.length} categories`);
}

// ═══════════════════════════════════════════════════════════════
// SEED PRODUCTS
// ═══════════════════════════════════════════════════════════════

async function seedProducts() {
    logSection("SEEDING PRODUCTS");

    for (const prod of allProducts) {
        // Create media assets for product images
        const mediaAssets = await Promise.all(
            prod.mediaUrls.map(async (url, index) => {
                return prisma.mediaAsset.create({
                    data: {
                        type: MediaType.IMAGE,
                        url,
                        alt: `${prod.slug}-image-${index + 1}`,
                        width: 1200,
                        height: 1600,
                        provider: "unsplash",
                    },
                });
            })
        );

        // Create product
        await prisma.product.create({
            data: {
                id: prod.id,
                slug: prod.slug,
                skuPrefix: prod.skuPrefix,
                status: prod.status,
                categoryId: prod.categoryId,
                originCountry: prod.originCountry,
                heritageTag: prod.heritageTag,
                limitedEdition: prod.limitedEdition,
                weightGrams: prod.weightGrams,
                atelierNotes: prod.atelierNotes,
                careInstructions: prod.careInstructions,
                seoMeta: {
                    title: prod.translations[0].name,
                    description: prod.translations[0].description.substring(0, 160),
                },
            },
        });

        // Create translations
        for (const trans of prod.translations) {
            await prisma.productTranslation.create({
                data: {
                    productId: prod.id,
                    locale: trans.locale,
                    name: trans.name,
                    description: trans.description,
                    craftStory: trans.craftStory,
                    materialsText: trans.materialsText,
                    sizeGuide: trans.sizeGuide,
                    seoTitle: trans.name,
                    seoDescription: trans.description.substring(0, 160),
                },
            });
        }

        // Link materials
        for (const mat of prod.materials) {
            await prisma.productMaterial.create({
                data: {
                    productId: prod.id,
                    materialId: mat.materialId,
                    percentage: mat.percentage,
                },
            });
        }

        // Create product media
        for (let i = 0; i < mediaAssets.length; i++) {
            await prisma.productMedia.create({
                data: {
                    productId: prod.id,
                    assetId: mediaAssets[i].id,
                    placement: i === 0 ? "hero" : i === 1 ? "gallery" : "macro",
                    sortOrder: i,
                },
            });
        }

        // Create variants with inventory
        for (const variant of prod.variants) {
            const createdVariant = await prisma.productVariant.create({
                data: {
                    sku: variant.sku,
                    productId: prod.id,
                    color: variant.color,
                    size: variant.size,
                    priceCents: variant.priceCents,
                    compareAtCents: variant.compareAtCents,
                    personalizationAllowed: variant.personalizationAllowed,
                    weightGrams: prod.weightGrams,
                },
            });

            // Create inventory
            await prisma.inventory.create({
                data: {
                    variantId: createdVariant.id,
                    quantity: variant.inventoryQty,
                    reserved: 0,
                    lowStockThreshold: 2,
                },
            });
        }

        log("👔", `Created product: ${prod.slug} (${prod.variants.length} variants)`);
    }

    log("✓", `Seeded ${allProducts.length} products`);
}

// ═══════════════════════════════════════════════════════════════
// SEED COLLECTIONS
// ═══════════════════════════════════════════════════════════════

async function seedCollections() {
    logSection("SEEDING COLLECTIONS");

    for (const col of collections) {
        // Create hero asset
        const heroAsset = await prisma.mediaAsset.create({
            data: {
                type: MediaType.IMAGE,
                url: col.heroAssetUrl,
                alt: `${col.slug}-hero`,
                width: 1600,
                height: 900,
                provider: "unsplash",
            },
        });

        // Create collection
        await prisma.collection.create({
            data: {
                id: col.id,
                slug: col.slug,
                season: col.season,
                releaseDate: col.releaseDate,
                status: col.status,
                heroAssetId: heroAsset.id,
            },
        });

        // Create translations
        for (const trans of col.translations) {
            await prisma.collectionTranslation.create({
                data: {
                    collectionId: col.id,
                    locale: trans.locale,
                    title: trans.title,
                    subtitle: trans.subtitle,
                    description: trans.description,
                    manifesto: trans.manifesto,
                    seoTitle: trans.seoTitle,
                    seoDescription: trans.seoDescription,
                },
            });
        }

        // Create sections
        for (const section of col.sections) {
            let sectionAsset = null;
            if (section.assetUrl) {
                sectionAsset = await prisma.mediaAsset.create({
                    data: {
                        type: MediaType.IMAGE,
                        url: section.assetUrl,
                        alt: `${col.slug}-section-${section.sortOrder}`,
                        provider: "unsplash",
                    },
                });
            }

            const createdSection = await prisma.collectionSection.create({
                data: {
                    collectionId: col.id,
                    layout: section.layout,
                    sortOrder: section.sortOrder,
                    assetId: sectionAsset?.id,
                },
            });

            for (const trans of section.translations) {
                await prisma.collectionSectionTranslation.create({
                    data: {
                        sectionId: createdSection.id,
                        locale: trans.locale,
                        heading: trans.heading,
                        body: trans.body,
                        caption: trans.caption,
                    },
                });
            }
        }

        // Link products
        for (let i = 0; i < col.productIds.length; i++) {
            const productId = col.productIds[i];
            // Check if product exists
            const product = await prisma.product.findUnique({ where: { id: productId } });
            if (product) {
                await prisma.collectionItem.create({
                    data: {
                        collectionId: col.id,
                        productId: productId,
                        sortOrder: i,
                        highlighted: col.highlightedProductIds.includes(productId),
                    },
                });
            }
        }

        // Create lookbook slides
        for (const slide of col.lookbookSlides) {
            const slideAsset = await prisma.mediaAsset.create({
                data: {
                    type: MediaType.IMAGE,
                    url: slide.assetUrl,
                    alt: `${col.slug}-lookbook-${slide.sortOrder}`,
                    provider: "unsplash",
                },
            });

            const createdSlide = await prisma.lookbookSlide.create({
                data: {
                    collectionId: col.id,
                    assetId: slideAsset.id,
                    sortOrder: slide.sortOrder,
                },
            });

            for (const trans of slide.translations) {
                await prisma.lookbookSlideTranslation.create({
                    data: {
                        slideId: createdSlide.id,
                        locale: trans.locale,
                        title: trans.title,
                        body: trans.body,
                        caption: trans.caption,
                    },
                });
            }
        }

        log("📚", `Created collection: ${col.slug}`);
    }

    log("✓", `Seeded ${collections.length} collections`);
}

// ═══════════════════════════════════════════════════════════════
// SEED EDITORIAL
// ═══════════════════════════════════════════════════════════════

async function seedEditorial() {
    logSection("SEEDING EDITORIAL POSTS");

    for (const post of editorialPosts) {
        // Create hero asset
        const heroAsset = await prisma.mediaAsset.create({
            data: {
                type: MediaType.IMAGE,
                url: post.heroAssetUrl,
                alt: `${post.slug}-hero`,
                width: 1600,
                height: 900,
                provider: "unsplash",
            },
        });

        // Create post
        await prisma.editorialPost.create({
            data: {
                id: post.id,
                slug: post.slug,
                category: post.category,
                publishedAt: post.publishedAt,
                status: post.status,
                heroAssetId: heroAsset.id,
                seoMeta: {
                    title: post.translations[0].seoTitle,
                    description: post.translations[0].seoDescription,
                },
            },
        });

        // Create translations
        for (const trans of post.translations) {
            await prisma.editorialTranslation.create({
                data: {
                    postId: post.id,
                    locale: trans.locale,
                    title: trans.title,
                    standfirst: trans.standfirst,
                    seoTitle: trans.seoTitle,
                    seoDescription: trans.seoDescription,
                },
            });
        }

        // Create blocks
        for (const block of post.blocks) {
            let blockAsset = null;
            if (block.assetUrl) {
                blockAsset = await prisma.mediaAsset.create({
                    data: {
                        type: MediaType.IMAGE,
                        url: block.assetUrl,
                        alt: `${post.slug}-block-${block.sortOrder}`,
                        provider: "unsplash",
                    },
                });
            }

            const createdBlock = await prisma.editorialBlock.create({
                data: {
                    postId: post.id,
                    type: block.type,
                    sortOrder: block.sortOrder,
                    assetId: blockAsset?.id,
                },
            });

            for (const trans of block.translations) {
                await prisma.editorialBlockTranslation.create({
                    data: {
                        blockId: createdBlock.id,
                        locale: trans.locale,
                        headline: trans.headline,
                        body: trans.body,
                        caption: trans.caption,
                    },
                });
            }
        }

        // Link featured products
        for (const feature of post.featuredProducts) {
            const product = await prisma.product.findUnique({ where: { id: feature.productId } });
            if (product) {
                await prisma.editorialFeature.create({
                    data: {
                        postId: post.id,
                        productId: feature.productId,
                        note: feature.note,
                        sortOrder: feature.sortOrder,
                    },
                });
            }
        }

        log("📰", `Created editorial: ${post.slug}`);
    }

    log("✓", `Seeded ${editorialPosts.length} editorial posts`);
}

// ═══════════════════════════════════════════════════════════════
// SEED COMMERCE
// ═══════════════════════════════════════════════════════════════

async function seedCommerce() {
    logSection("SEEDING COMMERCE DATA");

    // Promotions
    for (const promo of promotions) {
        await prisma.promotion.create({
            data: {
                id: promo.id,
                code: promo.code,
                description: promo.description,
                discountType: promo.discountType,
                discountValue: promo.discountValue,
                startsAt: promo.startsAt,
                endsAt: promo.endsAt,
                usageLimit: promo.usageLimit,
                locale: promo.locale,
                limitedEditionOnly: promo.limitedEditionOnly,
            },
        });
        log("🎫", `Created promotion: ${promo.code}`);
    }

    // Limited Drops
    for (const drop of limitedDrops) {
        const collection = await prisma.collection.findUnique({ where: { id: drop.collectionId } });
        if (collection) {
            await prisma.limitedDrop.create({
                data: {
                    id: drop.id,
                    collectionId: drop.collectionId,
                    title: drop.title,
                    startsAt: drop.startsAt,
                    endsAt: drop.endsAt,
                    waitlistOpen: drop.waitlistOpen,
                    locale: drop.locale,
                },
            });
            log("⏰", `Created limited drop: ${drop.title}`);
        }
    }

    // Appointments
    for (const apt of sampleAppointments) {
        await prisma.appointment.create({
            data: {
                id: apt.id,
                locale: apt.locale,
                boutique: apt.boutique,
                appointmentAt: apt.appointmentAt,
                status: apt.status,
                services: apt.services,
                notes: apt.notes,
                concierge: apt.concierge,
            },
        });
    }
    log("📅", `Created ${sampleAppointments.length} sample appointments`);

    log("✓", "Commerce data seeded");
}

// ═══════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════

async function main() {
    console.log("\n");
    console.log("╔════════════════════════════════════════════════════════════╗");
    console.log("║                                                            ║");
    console.log("║   MAISON AURÈLE — DATABASE SEED                           ║");
    console.log("║   Ultra-Luxury French Fashion House                       ║");
    console.log("║                                                            ║");
    console.log("╚════════════════════════════════════════════════════════════╝");

    const startTime = Date.now();

    await clearDatabase();
    await seedMaterials();
    await seedCategories();
    await seedProducts();
    await seedCollections();
    await seedEditorial();
    await seedCommerce();

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    logSection("SEED COMPLETE");
    console.log(`\n   ✨ Database seeded successfully in ${duration}s\n`);
    console.log("   Summary:");
    console.log(`   • ${materials.length} materials`);
    console.log(`   • ${categories.length} categories`);
    console.log(`   • ${allProducts.length} products`);
    console.log(`   • ${collections.length} collections`);
    console.log(`   • ${editorialPosts.length} editorial posts`);
    console.log(`   • ${promotions.length} promotions`);
    console.log(`   • ${limitedDrops.length} limited drops`);
    console.log(`   • ${sampleAppointments.length} appointments\n`);
}

main()
    .catch((err) => {
        console.error("\n❌ Seed failed:", err);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
