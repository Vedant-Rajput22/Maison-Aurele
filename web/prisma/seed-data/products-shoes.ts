/**
 * Maison Aurèle – Shoes Seed Data
 */

import { Locale, ProductStatus } from "@prisma/client";
import { ProductSeed } from "./products-outerwear";

// Curated luxury footwear imagery - verified working URLs
const SHOE_IMAGES = {
    escarpin: [
        "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1518049362265-d5b2a6467637?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1596703263926-eb0762ee17e4?auto=format&fit=crop&w=1200&q=80",
    ],
    mule: [
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1518049362265-d5b2a6467637?auto=format&fit=crop&w=1200&q=80",
    ],
    bottine: [
        "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1605812860427-4024433a70fd?auto=format&fit=crop&w=1200&q=80",
    ],
};

// Verified working shoe images
const IMG = {
    heel1: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=80",
    heel2: "https://images.unsplash.com/photo-1518049362265-d5b2a6467637?auto=format&fit=crop&w=1200&q=80",
    heel3: "https://images.unsplash.com/photo-1596703263926-eb0762ee17e4?auto=format&fit=crop&w=1200&q=80",
    loafer1: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1200&q=80",
    loafer2: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=1200&q=80",
    boot1: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=1200&q=80",
    boot2: "https://images.unsplash.com/photo-1605812860427-4024433a70fd?auto=format&fit=crop&w=1200&q=80",
    boot3: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=80",
};

export const productsShoes: ProductSeed[] = [
    {
        id: "prod-escarpin-lumiere",
        slug: "lescarpin-lumiere",
        skuPrefix: "EL",
        status: ProductStatus.ACTIVE,
        categoryId: "cat-shoes",
        originCountry: "IT",
        heritageTag: "Italie",
        limitedEdition: false,
        weightGrams: 380,
        atelierNotes: "Handcrafted in the Marche region using Blake construction. The 75mm heel is calibrated for all-day comfort. Leather soles include rubber injections for grip.",
        careInstructions: {
            en: ["Use shoe trees when not worn", "Condition leather monthly", "Protect soles with rubber tips"],
            fr: ["Utiliser des embauchoirs", "Conditionner le cuir mensuellement", "Protéger les semelles avec patins"],
        },
        materials: [{ materialId: "mat-nappa-leather", percentage: 100 }],
        translations: [
            {
                locale: Locale.EN,
                name: "L'Escarpin Lumière",
                description: "The pump that flatters. A timeless pointed-toe silhouette with a 75mm heel calibrated for elegance and comfort. Padded insole and leather lining ensure all-day wearability.",
                craftStory: "Blake construction allows a closer last fit. Each pair is hand-lasted and finished by a single artisan in Italy's Marche region.",
                materialsText: "100% Nappa Leather upper and lining / Leather sole",
                sizeGuide: "True to size. Half sizes available. We recommend trying with the hosiery you intend to wear.",
            },
            {
                locale: Locale.FR,
                name: "L'Escarpin Lumière",
                description: "L'escarpin qui sublime. Une silhouette pointue intemporelle avec un talon de 75mm calibré pour l'élégance et le confort. Semelle intérieure rembourrée et doublure cuir assurent le confort toute la journée.",
                craftStory: "La construction Blake permet un ajustement plus proche de la forme. Chaque paire est montée et finie à la main par un seul artisan.",
                materialsText: "100% Cuir Nappa dessus et doublure / Semelle cuir",
                sizeGuide: "Taille standard. Demi-tailles disponibles. Nous recommandons d'essayer avec les bas prévus.",
            },
        ],
        variants: [
            { sku: "EL-NR-36", color: "Noir", colorHex: "#1a1a1a", size: "36", priceCents: 89000, inventoryQty: 8, personalizationAllowed: false },
            { sku: "EL-NR-37", color: "Noir", colorHex: "#1a1a1a", size: "37", priceCents: 89000, inventoryQty: 12, personalizationAllowed: false },
            { sku: "EL-NR-38", color: "Noir", colorHex: "#1a1a1a", size: "38", priceCents: 89000, inventoryQty: 14, personalizationAllowed: false },
            { sku: "EL-NR-39", color: "Noir", colorHex: "#1a1a1a", size: "39", priceCents: 89000, inventoryQty: 10, personalizationAllowed: false },
            { sku: "EL-NR-40", color: "Noir", colorHex: "#1a1a1a", size: "40", priceCents: 89000, inventoryQty: 6, personalizationAllowed: false },
            { sku: "EL-ND-37", color: "Nude", colorHex: "#e3bc9a", size: "37", priceCents: 89000, inventoryQty: 8, personalizationAllowed: false },
            { sku: "EL-ND-38", color: "Nude", colorHex: "#e3bc9a", size: "38", priceCents: 89000, inventoryQty: 10, personalizationAllowed: false },
        ],
        mediaUrls: [IMG.heel1, IMG.heel2, IMG.heel3],
    },
    {
        id: "prod-mocassin-aurele",
        slug: "le-mocassin-aurele",
        skuPrefix: "MA",
        status: ProductStatus.ACTIVE,
        categoryId: "cat-shoes",
        originCountry: "IT",
        heritageTag: "Signature",
        limitedEdition: false,
        weightGrams: 320,
        atelierNotes: "Our signature loafer features a hand-stitched apron and a subtly elongated toe. The stacked leather heel adds 20mm of lift without sacrificing comfort.",
        careInstructions: {
            en: ["Brush to remove dust", "Condition with neutral cream", "Rotate wear for longevity"],
            fr: ["Brosser pour enlever la poussière", "Conditionner avec crème neutre", "Alterner les jours de port"],
        },
        materials: [{ materialId: "mat-nappa-leather", percentage: 100 }],
        translations: [
            {
                locale: Locale.EN,
                name: "Le Mocassin Aurèle",
                description: "The loafer, elevated. A subtly elongated silhouette with hand-stitched apron construction. The stacked leather heel adds 20mm of lift. Unlined for barefoot summer wear.",
                craftStory: "The apron is stitched by hand—a technique that takes twice as long but creates the distinctive gathered detail.",
                materialsText: "100% Nappa Leather / Leather sole with rubber heel",
                sizeGuide: "Runs slightly narrow. Consider sizing up for wider feet.",
            },
            {
                locale: Locale.FR,
                name: "Le Mocassin Aurèle",
                description: "Le mocassin, sublimé. Une silhouette subtilement allongée avec construction tablier cousue main. Le talon cuir empilé ajoute 20mm de hauteur. Non doublé pour l'été pieds nus.",
                craftStory: "Le tablier est cousu à la main—une technique qui prend deux fois plus de temps mais crée le détail froncé distinctif.",
                materialsText: "100% Cuir Nappa / Semelle cuir avec talon caoutchouc",
                sizeGuide: "Chausse légèrement étroit. Envisagez une taille au-dessus pour les pieds larges.",
            },
        ],
        variants: [
            { sku: "MA-NR-36", color: "Noir", colorHex: "#1a1a1a", size: "36", priceCents: 75000, inventoryQty: 10, personalizationAllowed: false },
            { sku: "MA-NR-37", color: "Noir", colorHex: "#1a1a1a", size: "37", priceCents: 75000, inventoryQty: 15, personalizationAllowed: false },
            { sku: "MA-NR-38", color: "Noir", colorHex: "#1a1a1a", size: "38", priceCents: 75000, inventoryQty: 14, personalizationAllowed: false },
            { sku: "MA-NR-39", color: "Noir", colorHex: "#1a1a1a", size: "39", priceCents: 75000, inventoryQty: 12, personalizationAllowed: false },
            { sku: "MA-CG-37", color: "Cognac", colorHex: "#8b4513", size: "37", priceCents: 75000, inventoryQty: 8, personalizationAllowed: false },
            { sku: "MA-CG-38", color: "Cognac", colorHex: "#8b4513", size: "38", priceCents: 75000, inventoryQty: 10, personalizationAllowed: false },
        ],
        mediaUrls: [IMG.loafer1, IMG.loafer2, IMG.heel1],
    },
    {
        id: "prod-botte-sculptee",
        slug: "la-botte-sculptee",
        skuPrefix: "BS",
        status: ProductStatus.ACTIVE,
        categoryId: "cat-shoes",
        originCountry: "IT",
        heritageTag: "Artisan",
        limitedEdition: false,
        weightGrams: 680,
        atelierNotes: "Knee-high boots constructed using Goodyear welt for durability and resoling. The sculptural 60mm block heel provides stability on cobblestones.",
        careInstructions: {
            en: ["Store with boot shapers", "Condition leather before and after season", "Resole when needed"],
            fr: ["Ranger avec embauchoirs pour bottes", "Conditionner le cuir avant et après la saison", "Ressemeler si nécessaire"],
        },
        materials: [{ materialId: "mat-nappa-leather", percentage: 100 }],
        translations: [
            {
                locale: Locale.EN,
                name: "La Botte Sculptée",
                description: "The boot for modern Paris. Knee-high with a sculptural 60mm block heel. Goodyear welt construction means these boots can be resoled for decades of wear.",
                craftStory: "Built to last. The Goodyear welt construction is the same used for the finest men's shoes—strong, repairable, and beautiful.",
                materialsText: "100% Nappa Leather / Leather lining / Leather and rubber sole",
                sizeGuide: "True to size. The shaft accommodates various calf widths with interior stretch panel.",
            },
            {
                locale: Locale.FR,
                name: "La Botte Sculptée",
                description: "La botte pour le Paris moderne. Hauteur genou avec un talon bloc sculptural de 60mm. La construction Goodyear permet de ressemeler ces bottes pour des décennies d'usage.",
                craftStory: "Conçue pour durer. La construction Goodyear est la même utilisée pour les plus belles chaussures hommes—solide, réparable et belle.",
                materialsText: "100% Cuir Nappa / Doublure cuir / Semelle cuir et caoutchouc",
                sizeGuide: "Taille standard. La tige s'adapte à différentes largeurs de mollet grâce au panneau stretch intérieur.",
            },
        ],
        variants: [
            { sku: "BS-NR-36", color: "Noir", colorHex: "#1a1a1a", size: "36", priceCents: 145000, inventoryQty: 6, personalizationAllowed: false },
            { sku: "BS-NR-37", color: "Noir", colorHex: "#1a1a1a", size: "37", priceCents: 145000, inventoryQty: 10, personalizationAllowed: false },
            { sku: "BS-NR-38", color: "Noir", colorHex: "#1a1a1a", size: "38", priceCents: 145000, inventoryQty: 12, personalizationAllowed: false },
            { sku: "BS-NR-39", color: "Noir", colorHex: "#1a1a1a", size: "39", priceCents: 145000, inventoryQty: 8, personalizationAllowed: false },
            { sku: "BS-CB-37", color: "Camel", colorHex: "#c4a77d", size: "37", priceCents: 145000, inventoryQty: 5, personalizationAllowed: false },
            { sku: "BS-CB-38", color: "Camel", colorHex: "#c4a77d", size: "38", priceCents: 145000, inventoryQty: 6, personalizationAllowed: false },
        ],
        mediaUrls: [IMG.boot1, IMG.boot2, IMG.boot3],
    },
];

export default productsShoes;
