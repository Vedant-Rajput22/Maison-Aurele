/**
 * Maison Aurèle – Category Seed Data
 * 
 * Luxury fashion categories with bilingual EN/FR translations.
 * Organized in a hierarchy suitable for navigation and filtering.
 */

import { Locale } from "@prisma/client";

export interface CategoryTranslationSeed {
    locale: Locale;
    title: string;
    description: string;
}

export interface CategorySeedData {
    id: string;
    slug: string;
    parentId?: string;
    translations: CategoryTranslationSeed[];
}

export const categories: CategorySeedData[] = [
    // Top-level: Ready-to-Wear (parent for clothing)
    {
        id: "cat-ready-to-wear",
        slug: "ready-to-wear",
        translations: [
            {
                locale: Locale.EN,
                title: "Ready-to-Wear",
                description: "Impeccably tailored pieces that embody Parisian elegance. Each garment is crafted to move with you, from morning to midnight.",
            },
            {
                locale: Locale.FR,
                title: "Prêt-à-Porter",
                description: "Des pièces impeccablement taillées qui incarnent l'élégance parisienne. Chaque vêtement est conçu pour vous accompagner, du matin jusqu'à minuit.",
            },
        ],
    },
    // Outerwear (child of ready-to-wear)
    {
        id: "cat-outerwear",
        slug: "outerwear",
        parentId: "cat-ready-to-wear",
        translations: [
            {
                locale: Locale.EN,
                title: "Outerwear",
                description: "Signature coats, structured blazers, and timeless trenches. The finishing touch to every silhouette.",
            },
            {
                locale: Locale.FR,
                title: "Manteaux",
                description: "Manteaux signature, blazers structurés et trenchs intemporels. La touche finale de chaque silhouette.",
            },
        ],
    },
    // Dresses
    {
        id: "cat-dresses",
        slug: "dresses",
        parentId: "cat-ready-to-wear",
        translations: [
            {
                locale: Locale.EN,
                title: "Dresses",
                description: "From day dresses to evening gowns, each piece tells a story of French savoir-faire and feminine allure.",
            },
            {
                locale: Locale.FR,
                title: "Robes",
                description: "Des robes de jour aux robes du soir, chaque pièce raconte une histoire de savoir-faire français et de séduction féminine.",
            },
        ],
    },
    // Tops
    {
        id: "cat-tops",
        slug: "tops",
        parentId: "cat-ready-to-wear",
        translations: [
            {
                locale: Locale.EN,
                title: "Tops",
                description: "Silk blouses, sculptural chemises, and refined essentials. The foundation of effortless style.",
            },
            {
                locale: Locale.FR,
                title: "Hauts",
                description: "Blouses en soie, chemises sculpturales et essentiels raffinés. Le fondement d'un style sans effort.",
            },
        ],
    },
    // Bottoms
    {
        id: "cat-bottoms",
        slug: "bottoms",
        parentId: "cat-ready-to-wear",
        translations: [
            {
                locale: Locale.EN,
                title: "Bottoms",
                description: "Tailored trousers, flowing skirts, and refined separates. Precision cuts that flatter every form.",
            },
            {
                locale: Locale.FR,
                title: "Bas",
                description: "Pantalons sur mesure, jupes fluides et pièces raffinées. Des coupes précises qui subliment chaque silhouette.",
            },
        ],
    },
    // Knitwear
    {
        id: "cat-knitwear",
        slug: "knitwear",
        parentId: "cat-ready-to-wear",
        translations: [
            {
                locale: Locale.EN,
                title: "Knitwear",
                description: "Luxurious cashmere and fine wool pieces. Soft, sculptural, and supremely comfortable.",
            },
            {
                locale: Locale.FR,
                title: "Maille",
                description: "Pièces luxueuses en cachemire et laine fine. Douces, sculpturales et d'un confort suprême.",
            },
        ],
    },
    // Top-level: Accessories
    {
        id: "cat-accessories",
        slug: "accessories",
        translations: [
            {
                locale: Locale.EN,
                title: "Accessories",
                description: "The details that define a look. Handcrafted leather goods, silk scarves, and precious finishing touches.",
            },
            {
                locale: Locale.FR,
                title: "Accessoires",
                description: "Les détails qui définissent un look. Maroquinerie artisanale, foulards en soie et touches précieuses.",
            },
        ],
    },
    // Bags
    {
        id: "cat-bags",
        slug: "bags",
        parentId: "cat-accessories",
        translations: [
            {
                locale: Locale.EN,
                title: "Bags",
                description: "From the signature Aurèle tote to refined pochettes. Each bag is hand-stitched in our Paris atelier.",
            },
            {
                locale: Locale.FR,
                title: "Sacs",
                description: "Du tote signature Aurèle aux pochettes raffinées. Chaque sac est cousu main dans notre atelier parisien.",
            },
        ],
    },
    // Scarves & Shawls
    {
        id: "cat-scarves",
        slug: "scarves",
        parentId: "cat-accessories",
        translations: [
            {
                locale: Locale.EN,
                title: "Scarves & Shawls",
                description: "Silk carrés, cashmere wraps, and generously proportioned stoles. Artistry you can wear.",
            },
            {
                locale: Locale.FR,
                title: "Écharpes & Châles",
                description: "Carrés de soie, étoles en cachemire et châles généreusement proportionnés. L'art à porter.",
            },
        ],
    },
    // Shoes
    {
        id: "cat-shoes",
        slug: "shoes",
        translations: [
            {
                locale: Locale.EN,
                title: "Shoes",
                description: "Italian-crafted footwear with French sensibility. Each pair is made using traditional Goodyear or Blake construction.",
            },
            {
                locale: Locale.FR,
                title: "Chaussures",
                description: "Chaussures fabriquées en Italie avec une sensibilité française. Chaque paire est réalisée selon les techniques Goodyear ou Blake traditionnelles.",
            },
        ],
    },
    // Jewelry
    {
        id: "cat-jewelry",
        slug: "jewelry",
        parentId: "cat-accessories",
        translations: [
            {
                locale: Locale.EN,
                title: "Fine Jewelry",
                description: "Sculptural pieces in gold vermeil and sterling silver. Designed to be worn, cherished, and passed down.",
            },
            {
                locale: Locale.FR,
                title: "Joaillerie",
                description: "Pièces sculpturales en vermeil et argent sterling. Conçues pour être portées, chéries et transmises.",
            },
        ],
    },
    // Leather Goods
    {
        id: "cat-leather-goods",
        slug: "leather-goods",
        parentId: "cat-accessories",
        translations: [
            {
                locale: Locale.EN,
                title: "Leather Goods",
                description: "Wallets, cardholders, and travel accessories. Small luxuries crafted from the finest Tuscan leather.",
            },
            {
                locale: Locale.FR,
                title: "Maroquinerie",
                description: "Portefeuilles, porte-cartes et accessoires de voyage. Petits luxes fabriqués dans le plus fin cuir toscan.",
            },
        ],
    },
];

export default categories;
