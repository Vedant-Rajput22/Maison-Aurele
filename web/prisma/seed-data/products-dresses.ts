/**
 * Maison Aurèle – Dresses Seed Data
 */

import { Locale, ProductStatus } from "@prisma/client";
import { ProductSeed } from "./products-outerwear";

// Curated luxury evening wear imagery - verified working URLs
const DRESS_IMAGES = {
    eternelle: [
        "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1518577915332-c2a19f149a75?auto=format&fit=crop&w=1200&q=80",
    ],
    soie: [
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=1200&q=80",
    ],
    sculptee: [
        "https://images.unsplash.com/photo-1562137369-1a1a0bc66744?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1508424757105-b6d5ad9329d0?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1557330359-ffb0deed6163?auto=format&fit=crop&w=1200&q=80",
    ],
};

// Verified working dress images for products using helper
const IMG = {
    dress1: "https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=1200&q=80",
    dress2: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1200&q=80",
    dress3: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=80",
    lace1: "https://images.unsplash.com/photo-1518577915332-c2a19f149a75?auto=format&fit=crop&w=1200&q=80",
    lace2: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1200&q=80",
    lace3: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=80",
};

export const productsDresses: ProductSeed[] = [
    {
        id: "prod-robe-eternelle",
        slug: "la-robe-eternelle",
        skuPrefix: "RE",
        status: ProductStatus.ACTIVE,
        categoryId: "cat-dresses",
        originCountry: "FR",
        heritageTag: "Haute Couture",
        limitedEdition: false,
        weightGrams: 680,
        atelierNotes: "Each gown requires 25 meters of Lyon silk and 60 hours of hand-draping. The signature asymmetric hem is weighted with silk-covered chains for perfect movement.",
        careInstructions: {
            en: ["Dry clean by couture specialist", "Store flat or hanging with padded clips", "Steam only—never iron"],
            fr: ["Nettoyage à sec par spécialiste couture", "Ranger à plat ou suspendue avec pinces rembourrées", "Vapeur uniquement—jamais de fer"],
        },
        materials: [{ materialId: "mat-silk", percentage: 100 }],
        translations: [
            {
                locale: Locale.EN,
                name: "La Robe Éternelle",
                description: "The evening gown that stops time. A cascade of Lyon silk falls from sculpted shoulders to an asymmetric hem, moving like water with every step. The draped bodice requires no closure—it wraps and ties at the waist.",
                craftStory: "Sixty hours of hand-draping. Twenty-five meters of France's finest silk. An atelier tradition reinvented for the modern woman.",
                materialsText: "100% Soie de Lyon / Self-lined",
                sizeGuide: "Cut to size. We recommend booking a virtual fitting with our atelier for the perfect drape.",
            },
            {
                locale: Locale.FR,
                name: "La Robe Éternelle",
                description: "La robe du soir qui arrête le temps. Une cascade de soie lyonnaise tombe des épaules sculptées jusqu'à un ourlet asymétrique, se mouvant comme l'eau à chaque pas. Le corsage drapé ne nécessite aucune fermeture—il s'enroule et se noue à la taille.",
                craftStory: "Soixante heures de drapé à la main. Vingt-cinq mètres de la plus fine soie de France. Une tradition atelier réinventée pour la femme moderne.",
                materialsText: "100% Soie de Lyon / Auto-doublée",
                sizeGuide: "Coupée sur mesure. Nous recommandons de réserver un essayage virtuel avec notre atelier pour le drapé parfait.",
            },
        ],
        variants: [
            { sku: "RE-NR-34", color: "Noir", colorHex: "#1a1a1a", size: "34", priceCents: 620000, inventoryQty: 4, personalizationAllowed: true },
            { sku: "RE-NR-36", color: "Noir", colorHex: "#1a1a1a", size: "36", priceCents: 620000, inventoryQty: 6, personalizationAllowed: true },
            { sku: "RE-NR-38", color: "Noir", colorHex: "#1a1a1a", size: "38", priceCents: 620000, inventoryQty: 5, personalizationAllowed: true },
            { sku: "RE-IV-36", color: "Ivoire", colorHex: "#fffff0", size: "36", priceCents: 620000, inventoryQty: 3, personalizationAllowed: true },
            { sku: "RE-IV-38", color: "Ivoire", colorHex: "#fffff0", size: "38", priceCents: 620000, inventoryQty: 4, personalizationAllowed: true },
            { sku: "RE-RG-36", color: "Rouge Aurore", colorHex: "#8b0000", size: "36", priceCents: 620000, inventoryQty: 2, personalizationAllowed: true },
        ],
        mediaUrls: DRESS_IMAGES.eternelle,
    },
    {
        id: "prod-robe-soie",
        slug: "la-robe-de-soie",
        skuPrefix: "RS",
        status: ProductStatus.ACTIVE,
        categoryId: "cat-dresses",
        originCountry: "FR",
        heritageTag: "Atelier Nuit",
        limitedEdition: false,
        weightGrams: 450,
        atelierNotes: "The slip dress elevated to couture. French seams throughout, with a draped cowl back that reveals without exposing. Adjustable silk straps.",
        careInstructions: {
            en: ["Hand wash cold or dry clean", "Air dry flat", "Steam to remove wrinkles"],
            fr: ["Lavage main à froid ou nettoyage à sec", "Sécher à plat", "Vaporiser pour enlever les plis"],
        },
        materials: [{ materialId: "mat-silk", percentage: 100 }],
        translations: [
            {
                locale: Locale.EN,
                name: "La Robe de Soie",
                description: "The art of the slip dress, perfected. Heavy silk charmeuse skims the body from delicate straps to a midi hem. The cowl back drapes low, revealing just enough.",
                craftStory: "The simplest silhouette demands the finest execution. Every seam is French, every stitch invisible.",
                materialsText: "100% Silk Charmeuse / Silk lining",
                sizeGuide: "True to size with adjustable straps. The bias cut flatters all figures.",
            },
            {
                locale: Locale.FR,
                name: "La Robe de Soie",
                description: "L'art de la robe de soie, perfectionné. La charmeuse de soie lourde effleure le corps des bretelles délicates jusqu'à un ourlet midi. Le dos drapé tombe bas, révélant juste assez.",
                craftStory: "La silhouette la plus simple exige l'exécution la plus fine. Chaque couture est française, chaque point invisible.",
                materialsText: "100% Charmeuse de soie / Doublure soie",
                sizeGuide: "Taille standard avec bretelles ajustables. La coupe en biais flatte toutes les silhouettes.",
            },
        ],
        variants: [
            { sku: "RS-NR-34", color: "Noir", colorHex: "#1a1a1a", size: "34", priceCents: 380000, inventoryQty: 8, personalizationAllowed: false },
            { sku: "RS-NR-36", color: "Noir", colorHex: "#1a1a1a", size: "36", priceCents: 380000, inventoryQty: 12, personalizationAllowed: false },
            { sku: "RS-NR-38", color: "Noir", colorHex: "#1a1a1a", size: "38", priceCents: 380000, inventoryQty: 10, personalizationAllowed: false },
            { sku: "RS-CH-36", color: "Champagne", colorHex: "#f7e7ce", size: "36", priceCents: 380000, inventoryQty: 6, personalizationAllowed: false },
            { sku: "RS-CH-38", color: "Champagne", colorHex: "#f7e7ce", size: "38", priceCents: 380000, inventoryQty: 7, personalizationAllowed: false },
        ],
        mediaUrls: DRESS_IMAGES.soie,
    },
    {
        id: "prod-robe-sculptee",
        slug: "la-robe-sculptee",
        skuPrefix: "RSC",
        status: ProductStatus.ACTIVE,
        categoryId: "cat-dresses",
        originCountry: "FR",
        heritageTag: "Façonné Main",
        limitedEdition: false,
        weightGrams: 720,
        atelierNotes: "Architectural in spirit, fluid in motion. The structured bodice uses boned construction while the skirt falls freely. Each piece is individually balanced.",
        careInstructions: {
            en: ["Dry clean only", "Store on padded hanger", "Avoid folding"],
            fr: ["Nettoyage à sec uniquement", "Ranger sur cintre rembourré", "Éviter de plier"],
        },
        materials: [{ materialId: "mat-virgin-wool", percentage: 100 }],
        translations: [
            {
                locale: Locale.EN,
                name: "La Robe Sculptée",
                description: "Architecture meets movement. The structured bodice creates tension against the fluid A-line skirt. Invisible boning shapes without constraining. A masterclass in proportion.",
                craftStory: "Each dress is balanced individually. The bodice resists; the skirt surrenders. The result is pure kinetic elegance.",
                materialsText: "100% Italian Virgin Wool / Silk lining",
                sizeGuide: "Fitted through the bodice. We recommend your true size; alterations available through our atelier.",
            },
            {
                locale: Locale.FR,
                name: "La Robe Sculptée",
                description: "L'architecture rencontre le mouvement. Le corsage structuré crée une tension contre la jupe évasée fluide. Le baleinage invisible sculpte sans contraindre. Une masterclass en proportions.",
                craftStory: "Chaque robe est équilibrée individuellement. Le corsage résiste; la jupe s'abandonne. Le résultat est l'élégance cinétique pure.",
                materialsText: "100% Laine vierge italienne / Doublure soie",
                sizeGuide: "Ajustée au corsage. Nous recommandons votre taille réelle; retouches disponibles via notre atelier.",
            },
        ],
        variants: [
            { sku: "RSC-NR-34", color: "Noir", colorHex: "#1a1a1a", size: "34", priceCents: 450000, inventoryQty: 5, personalizationAllowed: false },
            { sku: "RSC-NR-36", color: "Noir", colorHex: "#1a1a1a", size: "36", priceCents: 450000, inventoryQty: 8, personalizationAllowed: false },
            { sku: "RSC-NR-38", color: "Noir", colorHex: "#1a1a1a", size: "38", priceCents: 450000, inventoryQty: 6, personalizationAllowed: false },
            { sku: "RSC-GR-36", color: "Gris Perle", colorHex: "#d3d3d3", size: "36", priceCents: 450000, inventoryQty: 4, personalizationAllowed: false },
        ],
        mediaUrls: [IMG.dress1, IMG.dress2, IMG.dress3],
    },
    {
        id: "prod-robe-dentelle",
        slug: "la-robe-dentelle",
        skuPrefix: "RD",
        status: ProductStatus.ACTIVE,
        categoryId: "cat-dresses",
        originCountry: "FR",
        heritageTag: "Calais Heritage",
        limitedEdition: true,
        weightGrams: 580,
        atelierNotes: "Calais lace requires eight hours to weave a single meter. This gown uses four meters of our exclusive floral pattern, developed in collaboration with fourth-generation laciers.",
        careInstructions: {
            en: ["Specialist lace cleaning only", "Store flat in acid-free tissue", "Never steam or press"],
            fr: ["Nettoyage dentelle spécialisé uniquement", "Ranger à plat dans du papier de soie sans acide", "Ne jamais vaporiser ou repasser"],
        },
        materials: [{ materialId: "mat-calais-lace", percentage: 100 }],
        translations: [
            {
                locale: Locale.EN,
                name: "La Robe Dentelle",
                description: "A poem in Calais lace. Thirty-two hours of weaving, eight of assembly. The floor-length column reveals as much as it conceals, lined in nude silk that disappears against the skin.",
                craftStory: "Collaboration with the last Leavers loom weavers in Calais. Each meter takes eight hours. This is true French patrimoine.",
                materialsText: "100% Dentelle de Calais (cotton-silk blend) / Nude silk lining",
                sizeGuide: "Column silhouette requires precise sizing. Virtual fitting recommended.",
            },
            {
                locale: Locale.FR,
                name: "La Robe Dentelle",
                description: "Un poème en dentelle de Calais. Trente-deux heures de tissage, huit d'assemblage. La colonne jusqu'au sol révèle autant qu'elle dissimule, doublée de soie nude qui disparaît sur la peau.",
                craftStory: "Collaboration avec les derniers tisserands de métiers Leavers à Calais. Chaque mètre prend huit heures. C'est le vrai patrimoine français.",
                materialsText: "100% Dentelle de Calais (mélange coton-soie) / Doublure soie nude",
                sizeGuide: "La silhouette colonne nécessite un dimensionnement précis. Essayage virtuel recommandé.",
            },
        ],
        variants: [
            { sku: "RD-NR-34", color: "Noir", colorHex: "#1a1a1a", size: "34", priceCents: 890000, inventoryQty: 2, personalizationAllowed: true },
            { sku: "RD-NR-36", color: "Noir", colorHex: "#1a1a1a", size: "36", priceCents: 890000, inventoryQty: 3, personalizationAllowed: true },
            { sku: "RD-NR-38", color: "Noir", colorHex: "#1a1a1a", size: "38", priceCents: 890000, inventoryQty: 2, personalizationAllowed: true },
            { sku: "RD-IV-36", color: "Ivoire", colorHex: "#fffff0", size: "36", priceCents: 890000, inventoryQty: 1, personalizationAllowed: true },
        ],
        mediaUrls: [IMG.lace1, IMG.lace2, IMG.lace3],
    },
];

export default productsDresses;
