/**
 * Maison Aurèle – Products Seed Data
 * Ultra-luxury French fashion products with bilingual content
 */

import { Locale, ProductStatus } from "@prisma/client";

export interface ProductVariantSeed {
    sku: string;
    color: string;
    colorHex: string;
    size: string | null;
    priceCents: number;
    compareAtCents?: number;
    inventoryQty: number;
    personalizationAllowed: boolean;
}

export interface ProductSeed {
    id: string;
    slug: string;
    skuPrefix: string;
    status: ProductStatus;
    categoryId: string;
    originCountry: string;
    heritageTag: string;
    limitedEdition: boolean;
    weightGrams: number;
    atelierNotes: string;
    careInstructions: Record<string, string[]>;
    materials: { materialId: string; percentage: number }[];
    translations: {
        locale: Locale;
        name: string;
        description: string;
        craftStory: string;
        materialsText: string;
        sizeGuide: string;
    }[];
    variants: ProductVariantSeed[];
    mediaUrls: string[];
}

// Curated luxury outerwear imagery - verified working URLs
const OUTERWEAR_IMAGES = {
    manteauNocturne: [
        "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?auto=format&fit=crop&w=1200&q=80",
    ],
    vesteSculptee: [
        "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1550639525-c97d455acf70?auto=format&fit=crop&w=1200&q=80",
    ],
};

// Verified working luxury fashion images
const IMG = {
    coat1: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=1200&q=80",
    coat2: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1200&q=80",
    coat3: "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?auto=format&fit=crop&w=1200&q=80",
    blazer1: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80",
    blazer2: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=80",
    blazer3: "https://images.unsplash.com/photo-1550639525-c97d455acf70?auto=format&fit=crop&w=1200&q=80",
    trench1: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=1200&q=80",
    trench2: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=80",
    trench3: "https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=1200&q=80",
    leather1: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=80",
    leather2: "https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=1200&q=80",
    leather3: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=80",
};

export const products: ProductSeed[] = [
    // ═══════════════════════════════════════════════════════════════
    // OUTERWEAR
    // ═══════════════════════════════════════════════════════════════
    {
        id: "prod-manteau-nocturne",
        slug: "le-manteau-nocturne",
        skuPrefix: "MN",
        status: ProductStatus.ACTIVE,
        categoryId: "cat-outerwear",
        originCountry: "FR",
        heritageTag: "Atelier Paris",
        limitedEdition: false,
        weightGrams: 1800,
        atelierNotes: "Hand-finished in our Paris atelier over 40 hours. Each coat is cut from a single bolt of cashmere to ensure color consistency. The signature shoulder line is sculpted using traditional couture padding techniques dating to 1962.",
        careInstructions: {
            en: ["Dry clean only", "Store on padded hanger", "Steam to refresh", "Avoid direct sunlight"],
            fr: ["Nettoyage à sec uniquement", "Ranger sur cintre rembourré", "Vaporiser pour rafraîchir", "Éviter la lumière directe"],
        },
        materials: [{ materialId: "mat-cashmere", percentage: 100 }],
        translations: [
            {
                locale: Locale.EN,
                name: "Le Manteau Nocturne",
                description: "A masterwork of Parisian tailoring. This double-breasted coat drapes with the quiet confidence of midnight, its silhouette a study in sculptural elegance. The generous cut accommodates layering while maintaining an impeccable line.",
                craftStory: "Forty hours of hand-finishing. A single bolt of Mongolian cashmere. The culmination of six decades of atelier expertise.",
                materialsText: "100% Pure Mongolian Cashmere, horn buttons, silk lining",
                sizeGuide: "Cut generously. We recommend your usual size for an elegant drape, or size down for a more fitted silhouette.",
            },
            {
                locale: Locale.FR,
                name: "Le Manteau Nocturne",
                description: "Un chef-d'œuvre de la couture parisienne. Ce manteau croisé tombe avec la confiance tranquille de minuit, sa silhouette une étude en élégance sculpturale. La coupe généreuse permet les superpositions tout en maintenant une ligne impeccable.",
                craftStory: "Quarante heures de finition à la main. Une seule pièce de cachemire de Mongolie. L'aboutissement de six décennies d'expertise atelier.",
                materialsText: "100% Cachemire pur de Mongolie, boutons en corne, doublure en soie",
                sizeGuide: "Coupe généreuse. Nous recommandons votre taille habituelle pour un drapé élégant, ou une taille en dessous pour une silhouette plus ajustée.",
            },
        ],
        variants: [
            { sku: "MN-NR-34", color: "Noir", colorHex: "#1a1a1a", size: "34", priceCents: 485000, inventoryQty: 8, personalizationAllowed: true },
            { sku: "MN-NR-36", color: "Noir", colorHex: "#1a1a1a", size: "36", priceCents: 485000, inventoryQty: 12, personalizationAllowed: true },
            { sku: "MN-NR-38", color: "Noir", colorHex: "#1a1a1a", size: "38", priceCents: 485000, inventoryQty: 10, personalizationAllowed: true },
            { sku: "MN-NR-40", color: "Noir", colorHex: "#1a1a1a", size: "40", priceCents: 485000, inventoryQty: 6, personalizationAllowed: true },
            { sku: "MN-CB-36", color: "Camel", colorHex: "#c4a77d", size: "36", priceCents: 485000, inventoryQty: 5, personalizationAllowed: true },
            { sku: "MN-CB-38", color: "Camel", colorHex: "#c4a77d", size: "38", priceCents: 485000, inventoryQty: 7, personalizationAllowed: true },
        ],
        mediaUrls: OUTERWEAR_IMAGES.manteauNocturne,
    },
    {
        id: "prod-veste-sculptee",
        slug: "la-veste-sculptee",
        skuPrefix: "VS",
        status: ProductStatus.ACTIVE,
        categoryId: "cat-outerwear",
        originCountry: "FR",
        heritageTag: "Façonné Main",
        limitedEdition: false,
        weightGrams: 950,
        atelierNotes: "The structured shoulder is built using horsehair canvas and hand-padded with layers of cotton wadding. Each lapel is hand-rolled and slip-stitched by our master tailors.",
        careInstructions: {
            en: ["Dry clean only", "Store on shaped hanger", "Brush after wearing"],
            fr: ["Nettoyage à sec uniquement", "Ranger sur cintre galbé", "Brosser après usage"],
        },
        materials: [
            { materialId: "mat-virgin-wool", percentage: 85 },
            { materialId: "mat-silk", percentage: 15 },
        ],
        translations: [
            {
                locale: Locale.EN,
                name: "La Veste Sculptée",
                description: "Architectural precision meets Parisian nonchalance. This single-breasted blazer features our signature sculpted shoulder and a slightly nipped waist that elongates the silhouette.",
                craftStory: "Built on horsehair canvas with hand-padded shoulders. A construction technique unchanged since our founding.",
                materialsText: "85% Virgin Wool, 15% Silk / Bemberg lining",
                sizeGuide: "True to size. The blazer is designed to skim the body with room for a silk blouse underneath.",
            },
            {
                locale: Locale.FR,
                name: "La Veste Sculptée",
                description: "Précision architecturale et nonchalance parisienne. Ce blazer à un bouton présente notre épaule sculptée signature et une taille légèrement pincée qui allonge la silhouette.",
                craftStory: "Construit sur toile de crin avec épaules rembourrées à la main. Une technique de construction inchangée depuis notre fondation.",
                materialsText: "85% Laine vierge, 15% Soie / Doublure Bemberg",
                sizeGuide: "Taille standard. Le blazer est conçu pour effleurer le corps avec de la place pour une blouse en soie.",
            },
        ],
        variants: [
            { sku: "VS-NR-34", color: "Noir", colorHex: "#1a1a1a", size: "34", priceCents: 295000, inventoryQty: 10, personalizationAllowed: false },
            { sku: "VS-NR-36", color: "Noir", colorHex: "#1a1a1a", size: "36", priceCents: 295000, inventoryQty: 14, personalizationAllowed: false },
            { sku: "VS-NR-38", color: "Noir", colorHex: "#1a1a1a", size: "38", priceCents: 295000, inventoryQty: 12, personalizationAllowed: false },
            { sku: "VS-MN-36", color: "Marine", colorHex: "#1c2841", size: "36", priceCents: 295000, inventoryQty: 8, personalizationAllowed: false },
            { sku: "VS-MN-38", color: "Marine", colorHex: "#1c2841", size: "38", priceCents: 295000, inventoryQty: 9, personalizationAllowed: false },
        ],
        mediaUrls: [IMG.blazer1, IMG.blazer2, IMG.blazer3],
    },
    {
        id: "prod-trench-aurele",
        slug: "le-trench-aurele",
        skuPrefix: "TA",
        status: ProductStatus.ACTIVE,
        categoryId: "cat-outerwear",
        originCountry: "FR",
        heritageTag: "Signature",
        limitedEdition: false,
        weightGrams: 1200,
        atelierNotes: "Our interpretation of the classic trench, elongated and refined. Features hand-stitched buttonholes and a removable silk-wool lining for transitional wear.",
        careInstructions: {
            en: ["Dry clean only", "Remove lining before cleaning", "Store loosely belted"],
            fr: ["Nettoyage à sec uniquement", "Retirer la doublure avant nettoyage", "Ranger légèrement ceinturé"],
        },
        materials: [
            { materialId: "mat-cotton-egyptian", percentage: 70 },
            { materialId: "mat-silk", percentage: 30 },
        ],
        translations: [
            {
                locale: Locale.EN,
                name: "Le Trench Aurèle",
                description: "The Aurèle trench reimagines a wardrobe essential. Elongated to mid-calf, with a fluid drape that moves with intention. The cotton-silk blend offers protection from spring showers while maintaining breathability.",
                craftStory: "Inspired by the ateliers of the 8th arrondissement, where our founder first learned to cut a trench coat that moved like water.",
                materialsText: "70% Egyptian Cotton, 30% Silk / Removable wool-silk lining",
                sizeGuide: "Generous fit intended for layering. Consider sizing down for a belted silhouette.",
            },
            {
                locale: Locale.FR,
                name: "Le Trench Aurèle",
                description: "Le trench Aurèle réinvente un essentiel de la garde-robe. Allongé jusqu'au mi-mollet, avec un drapé fluide qui se meut avec intention. Le mélange coton-soie offre une protection contre les averses printanières tout en conservant la respirabilité.",
                craftStory: "Inspiré des ateliers du 8ème arrondissement, où notre fondateur a appris à couper un trench qui coulait comme l'eau.",
                materialsText: "70% Coton égyptien, 30% Soie / Doublure amovible laine-soie",
                sizeGuide: "Coupe généreuse prévue pour les superpositions. Envisagez une taille en dessous pour une silhouette ceinturée.",
            },
        ],
        variants: [
            { sku: "TA-SB-34", color: "Sable", colorHex: "#c2b280", size: "34", priceCents: 320000, inventoryQty: 6, personalizationAllowed: true },
            { sku: "TA-SB-36", color: "Sable", colorHex: "#c2b280", size: "36", priceCents: 320000, inventoryQty: 10, personalizationAllowed: true },
            { sku: "TA-SB-38", color: "Sable", colorHex: "#c2b280", size: "38", priceCents: 320000, inventoryQty: 8, personalizationAllowed: true },
            { sku: "TA-NR-36", color: "Noir", colorHex: "#1a1a1a", size: "36", priceCents: 320000, inventoryQty: 7, personalizationAllowed: true },
            { sku: "TA-NR-38", color: "Noir", colorHex: "#1a1a1a", size: "38", priceCents: 320000, inventoryQty: 9, personalizationAllowed: true },
        ],
        mediaUrls: [IMG.trench1, IMG.trench2, IMG.trench3],
    },
    {
        id: "prod-blouson-minuit",
        slug: "le-blouson-minuit",
        skuPrefix: "BM",
        status: ProductStatus.ACTIVE,
        categoryId: "cat-outerwear",
        originCountry: "IT",
        heritageTag: "Édition Limitée",
        limitedEdition: true,
        weightGrams: 1400,
        atelierNotes: "Vegetable-tanned nappa leather hand-cut in Tuscany, assembled in Paris. Each jacket requires three full hides to achieve seamless panel matching.",
        careInstructions: {
            en: ["Professional leather cleaning only", "Condition annually", "Store in breathable garment bag"],
            fr: ["Nettoyage cuir professionnel uniquement", "Conditionner annuellement", "Ranger dans une housse respirante"],
        },
        materials: [{ materialId: "mat-nappa-leather", percentage: 100 }],
        translations: [
            {
                locale: Locale.EN,
                name: "Le Blouson Minuit",
                description: "Midnight-weight leather, soft as silk. This moto-inspired blouson is cut with a slightly cropped hem and adjustable side tabs. The leather will develop a beautiful patina unique to its owner.",
                craftStory: "Three hides, seamlessly matched. Forty days of vegetable tanning. A jacket that ages like fine wine.",
                materialsText: "100% Vegetable-tanned Tuscan Nappa Leather / Silk lining",
                sizeGuide: "Fitted cut. We recommend your true size for the intended silhouette.",
            },
            {
                locale: Locale.FR,
                name: "Le Blouson Minuit",
                description: "Cuir poids minuit, doux comme la soie. Ce blouson d'inspiration moto est coupé avec un ourlet légèrement court et des pattes latérales ajustables. Le cuir développera une belle patine unique à son propriétaire.",
                craftStory: "Trois peaux, parfaitement assorties. Quarante jours de tannage végétal. Une veste qui vieillit comme un grand vin.",
                materialsText: "100% Cuir Nappa toscan tanné végétal / Doublure soie",
                sizeGuide: "Coupe ajustée. Nous recommandons votre taille réelle pour la silhouette prévue.",
            },
        ],
        variants: [
            { sku: "BM-NR-34", color: "Noir", colorHex: "#1a1a1a", size: "34", priceCents: 540000, inventoryQty: 3, personalizationAllowed: true },
            { sku: "BM-NR-36", color: "Noir", colorHex: "#1a1a1a", size: "36", priceCents: 540000, inventoryQty: 5, personalizationAllowed: true },
            { sku: "BM-NR-38", color: "Noir", colorHex: "#1a1a1a", size: "38", priceCents: 540000, inventoryQty: 4, personalizationAllowed: true },
            { sku: "BM-CG-36", color: "Cognac", colorHex: "#8b4513", size: "36", priceCents: 540000, inventoryQty: 2, personalizationAllowed: true },
            { sku: "BM-CG-38", color: "Cognac", colorHex: "#8b4513", size: "38", priceCents: 540000, inventoryQty: 2, personalizationAllowed: true },
        ],
        mediaUrls: [IMG.leather1, IMG.leather2, IMG.leather3],
    },
];

export default products;
