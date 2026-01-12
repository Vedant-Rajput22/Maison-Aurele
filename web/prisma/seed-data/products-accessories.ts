/**
 * Maison Aurèle – Bottoms, Bags & Accessories Seed Data
 */

import { Locale, ProductStatus } from "@prisma/client";
import { ProductSeed } from "./products-outerwear";

// Curated luxury accessories imagery - verified working URLs
const ACCESSORY_IMAGES = {
    pantalon: [
        "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=1200&q=80",
    ],
    jupe: [
        "https://images.unsplash.com/photo-1583496661160-fb5886a0aeec?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=80",
    ],
    sac: [
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=80",
    ],
    pochette: [
        "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80",
    ],
    foulard: [
        "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80",
    ],
    cabas: [
        "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80",
    ],
};

// Working luxury fashion images
const IMG = {
    // Pants/Trousers
    trousers1: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=80",
    trousers2: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=1200&q=80",
    trousers3: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80",
    // Bags
    bag1: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80",
    bag2: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80",
    bag3: "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=1200&q=80",
    // Scarves
    scarf1: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=1200&q=80",
    scarf2: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=1200&q=80",
    scarf3: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80",
};

export const productsBottoms: ProductSeed[] = [
    {
        id: "prod-pantalon-fluide",
        slug: "le-pantalon-fluide",
        skuPrefix: "PF",
        status: ProductStatus.ACTIVE,
        categoryId: "cat-bottoms",
        originCountry: "FR",
        heritageTag: "Couture Line",
        limitedEdition: false,
        weightGrams: 420,
        atelierNotes: "Wide-leg trousers with a high waist that elongates the leg. The drape is achieved through precise bias cutting that requires 30% more fabric.",
        careInstructions: {
            en: ["Dry clean only", "Hang to store", "Steam to refresh"],
            fr: ["Nettoyage à sec uniquement", "Ranger suspendu", "Vaporiser pour rafraîchir"],
        },
        materials: [{ materialId: "mat-virgin-wool", percentage: 100 }],
        translations: [
            {
                locale: Locale.EN,
                name: "Le Pantalon Fluide",
                description: "Trousers that move like skirts. The high waist and wide leg create an elongated silhouette, while the bias cut ensures graceful drape. Front pleats add structure without stiffness.",
                craftStory: "Thirty percent more fabric goes into each pair. The bias cut demands it—and rewards with incomparable movement.",
                materialsText: "100% Italian Virgin Wool / Silk waistband lining",
                sizeGuide: "High-waisted, wide-leg. True to size at the waist; the leg is generously proportioned.",
            },
            {
                locale: Locale.FR,
                name: "Le Pantalon Fluide",
                description: "Des pantalons qui bougent comme des jupes. La taille haute et la jambe large créent une silhouette allongée, tandis que la coupe en biais assure un drapé gracieux.",
                craftStory: "Trente pour cent de tissu en plus dans chaque paire. La coupe en biais l'exige—et récompense par un mouvement incomparable.",
                materialsText: "100% Laine vierge italienne / Doublure ceinture en soie",
                sizeGuide: "Taille haute, jambe large. Taille standard à la taille; la jambe est généreusement proportionnée.",
            },
        ],
        variants: [
            { sku: "PF-NR-34", color: "Noir", colorHex: "#1a1a1a", size: "34", priceCents: 135000, inventoryQty: 12, personalizationAllowed: false },
            { sku: "PF-NR-36", color: "Noir", colorHex: "#1a1a1a", size: "36", priceCents: 135000, inventoryQty: 15, personalizationAllowed: false },
            { sku: "PF-NR-38", color: "Noir", colorHex: "#1a1a1a", size: "38", priceCents: 135000, inventoryQty: 14, personalizationAllowed: false },
            { sku: "PF-CB-36", color: "Camel", colorHex: "#c4a77d", size: "36", priceCents: 135000, inventoryQty: 8, personalizationAllowed: false },
            { sku: "PF-CB-38", color: "Camel", colorHex: "#c4a77d", size: "38", priceCents: 135000, inventoryQty: 10, personalizationAllowed: false },
        ],
        mediaUrls: [IMG.trousers1, IMG.trousers2, IMG.trousers3],
    },
    {
        id: "prod-jupe-haute",
        slug: "la-jupe-haute",
        skuPrefix: "JH",
        status: ProductStatus.ACTIVE,
        categoryId: "cat-bottoms",
        originCountry: "FR",
        heritageTag: "Atelier Paris",
        limitedEdition: false,
        weightGrams: 280,
        atelierNotes: "A midi pencil skirt with couture-level construction. The silk moves with the body while maintaining its line through strategically placed seaming.",
        careInstructions: {
            en: ["Dry clean only", "Store flat or hanging", "Steam from inside"],
            fr: ["Nettoyage à sec uniquement", "Ranger à plat ou suspendue", "Vaporiser de l'intérieur"],
        },
        materials: [{ materialId: "mat-silk", percentage: 100 }],
        translations: [
            {
                locale: Locale.EN,
                name: "La Jupe Haute",
                description: "The pencil skirt, perfected. High-waisted with a midi length that hits at the most flattering point. A deep back vent allows for graceful movement.",
                craftStory: "Precision seaming creates structure from silk. Each seam is placed to sculpt without constricting.",
                materialsText: "100% Silk Satin / Silk lining",
                sizeGuide: "Fitted through the hip. True to size; the stretch-silk lining ensures comfort.",
            },
            {
                locale: Locale.FR,
                name: "La Jupe Haute",
                description: "La jupe crayon, perfectionnée. Taille haute avec une longueur midi qui atteint le point le plus flatteur. Une fente arrière profonde permet un mouvement gracieux.",
                craftStory: "Les coutures de précision créent la structure à partir de la soie. Chaque couture est placée pour sculpter sans contraindre.",
                materialsText: "100% Satin de soie / Doublure soie",
                sizeGuide: "Ajustée à la hanche. Taille standard; la doublure stretch-soie assure le confort.",
            },
        ],
        variants: [
            { sku: "JH-NR-34", color: "Noir", colorHex: "#1a1a1a", size: "34", priceCents: 168000, inventoryQty: 8, personalizationAllowed: false },
            { sku: "JH-NR-36", color: "Noir", colorHex: "#1a1a1a", size: "36", priceCents: 168000, inventoryQty: 12, personalizationAllowed: false },
            { sku: "JH-NR-38", color: "Noir", colorHex: "#1a1a1a", size: "38", priceCents: 168000, inventoryQty: 10, personalizationAllowed: false },
            { sku: "JH-CH-36", color: "Champagne", colorHex: "#f7e7ce", size: "36", priceCents: 168000, inventoryQty: 6, personalizationAllowed: false },
        ],
        mediaUrls: [IMG.trousers2, IMG.trousers1, IMG.trousers3],
    },
];

export const productsBags: ProductSeed[] = [
    {
        id: "prod-sac-aurele",
        slug: "le-sac-aurele",
        skuPrefix: "SA",
        status: ProductStatus.ACTIVE,
        categoryId: "cat-bags",
        originCountry: "IT",
        heritageTag: "Signature",
        limitedEdition: false,
        weightGrams: 650,
        atelierNotes: "Our signature bag, hand-stitched in Tuscany using saddle stitch technique—the same used for equestrian leather goods. Each bag takes 18 hours to complete.",
        careInstructions: {
            en: ["Condition with leather cream twice yearly", "Store stuffed in dust bag", "Avoid prolonged sunlight"],
            fr: ["Conditionner avec crème pour cuir deux fois par an", "Ranger rembourrée dans son pochon", "Éviter le soleil prolongé"],
        },
        materials: [{ materialId: "mat-nappa-leather", percentage: 100 }],
        translations: [
            {
                locale: Locale.EN,
                name: "Le Sac Aurèle",
                description: "Our signature tote bag. Structured yet supple, sized for life. The reinforced base protects your belongings while the interior pockets organize with quiet efficiency.",
                craftStory: "Eighteen hours of hand-stitching. Vegetable-tanned leather that ages beautifully. A bag for decades, not seasons.",
                materialsText: "100% Full-grain Tuscan Leather / Suede lining / Gold-plated hardware",
                sizeGuide: "Dimensions: 32cm × 28cm × 14cm. Fits a 13\" laptop.",
            },
            {
                locale: Locale.FR,
                name: "Le Sac Aurèle",
                description: "Notre sac cabas signature. Structuré mais souple, dimensionné pour la vie. La base renforcée protège vos affaires tandis que les poches intérieures organisent avec une efficacité discrète.",
                craftStory: "Dix-huit heures de couture à la main. Cuir tanné végétal qui vieillit magnifiquement. Un sac pour des décennies, pas des saisons.",
                materialsText: "100% Cuir toscan pleine fleur / Doublure daim / Ferrures plaqué or",
                sizeGuide: "Dimensions: 32cm × 28cm × 14cm. Convient à un ordinateur 13 pouces.",
            },
        ],
        variants: [
            { sku: "SA-NR", color: "Noir", colorHex: "#1a1a1a", size: null, priceCents: 390000, inventoryQty: 8, personalizationAllowed: true },
            { sku: "SA-CB", color: "Camel", colorHex: "#c4a77d", size: null, priceCents: 390000, inventoryQty: 10, personalizationAllowed: true },
            { sku: "SA-CG", color: "Cognac", colorHex: "#8b4513", size: null, priceCents: 390000, inventoryQty: 6, personalizationAllowed: true },
        ],
        mediaUrls: [IMG.bag1, IMG.bag2, IMG.bag3],
    },
    {
        id: "prod-pochette-minuit",
        slug: "la-pochette-minuit",
        skuPrefix: "PM",
        status: ProductStatus.ACTIVE,
        categoryId: "cat-bags",
        originCountry: "FR",
        heritageTag: "Soirée",
        limitedEdition: false,
        weightGrams: 220,
        atelierNotes: "Lyon velvet paired with leather trim. The frame opens with a satisfying click—a mechanism borrowed from vintage cigarette cases.",
        careInstructions: {
            en: ["Brush velvet gently", "Store in dust bag", "Avoid rain and humidity"],
            fr: ["Brosser le velours délicatement", "Ranger dans son pochon", "Éviter pluie et humidité"],
        },
        materials: [
            { materialId: "mat-velvet", percentage: 70 },
            { materialId: "mat-nappa-leather", percentage: 30 },
        ],
        translations: [
            {
                locale: Locale.EN,
                name: "La Pochette Minuit",
                description: "For evenings of consequence. Lyon velvet catches the light while the leather frame provides structure. The vintage-inspired clasp opens with a satisfying click.",
                craftStory: "Velvet from the looms of Lyon, leather from Tuscany. The clasp mechanism is borrowed from 1940s cigarette cases.",
                materialsText: "70% Lyon Velvet, 30% Nappa Leather / Gold-plated frame",
                sizeGuide: "Dimensions: 24cm × 14cm × 4cm. Fits phone, cards, keys, lipstick.",
            },
            {
                locale: Locale.FR,
                name: "La Pochette Minuit",
                description: "Pour les soirées d'importance. Le velours lyonnais capte la lumière tandis que le cadre en cuir apporte la structure. Le fermoir d'inspiration vintage s'ouvre avec un clic satisfaisant.",
                craftStory: "Velours des métiers de Lyon, cuir de Toscane. Le mécanisme du fermoir est emprunté aux étuis à cigarettes des années 1940.",
                materialsText: "70% Velours de Lyon, 30% Cuir Nappa / Cadre plaqué or",
                sizeGuide: "Dimensions: 24cm × 14cm × 4cm. Contient téléphone, cartes, clés, rouge à lèvres.",
            },
        ],
        variants: [
            { sku: "PM-NR", color: "Noir", colorHex: "#1a1a1a", size: null, priceCents: 185000, inventoryQty: 12, personalizationAllowed: false },
            { sku: "PM-BG", color: "Bordeaux", colorHex: "#722f37", size: null, priceCents: 185000, inventoryQty: 8, personalizationAllowed: false },
            { sku: "PM-MN", color: "Marine", colorHex: "#1c2841", size: null, priceCents: 185000, inventoryQty: 6, personalizationAllowed: false },
        ],
        mediaUrls: [IMG.bag2, IMG.bag3, IMG.bag1],
    },
    {
        id: "prod-cabas-parisien",
        slug: "le-cabas-parisien",
        skuPrefix: "CP",
        status: ProductStatus.ACTIVE,
        categoryId: "cat-bags",
        originCountry: "IT",
        heritageTag: "Atelier",
        limitedEdition: false,
        weightGrams: 580,
        atelierNotes: "The everyday tote, refined. Unstructured design allows the bag to mold to your belongings. Longer handles fit comfortably over the shoulder.",
        careInstructions: {
            en: ["Wipe with damp cloth", "Condition leather quarterly", "Store flat when empty"],
            fr: ["Essuyer avec un chiffon humide", "Conditionner le cuir trimestriellement", "Ranger à plat quand vide"],
        },
        materials: [{ materialId: "mat-nappa-leather", percentage: 100 }],
        translations: [
            {
                locale: Locale.EN,
                name: "Le Cabas Parisien",
                description: "The bag that goes everywhere. Unstructured and effortless, it molds to your day. Longer handles accommodate shoulder carry; the magnetic closure secures without fuss.",
                craftStory: "Inspired by Parisian market bags, elevated to luxury. The unlined interior reveals the leather's pristine reverse side.",
                materialsText: "100% Unlined Nappa Leather / Antique brass hardware",
                sizeGuide: "Dimensions: 38cm × 32cm × 16cm. Generous capacity for work essentials.",
            },
            {
                locale: Locale.FR,
                name: "Le Cabas Parisien",
                description: "Le sac qui va partout. Déstructuré et sans effort, il s'adapte à votre journée. Les anses plus longues permettent le porté épaule; la fermeture magnétique sécurise sans chichis.",
                craftStory: "Inspiré des sacs de marché parisiens, élevé au luxe. L'intérieur non doublé révèle l'envers impeccable du cuir.",
                materialsText: "100% Cuir Nappa non doublé / Ferrures laiton vieilli",
                sizeGuide: "Dimensions: 38cm × 32cm × 16cm. Capacité généreuse pour les essentiels de travail.",
            },
        ],
        variants: [
            { sku: "CP-NR", color: "Noir", colorHex: "#1a1a1a", size: null, priceCents: 265000, inventoryQty: 10, personalizationAllowed: true },
            { sku: "CP-CB", color: "Camel", colorHex: "#c4a77d", size: null, priceCents: 265000, inventoryQty: 12, personalizationAllowed: true },
        ],
        mediaUrls: [IMG.bag3, IMG.bag1, IMG.bag2],
    },
];

export const productsAccessories: ProductSeed[] = [
    {
        id: "prod-echarpe-cachemire",
        slug: "lecharpe-cachemire",
        skuPrefix: "EC",
        status: ProductStatus.ACTIVE,
        categoryId: "cat-scarves",
        originCountry: "FR",
        heritageTag: "Mongolie",
        limitedEdition: false,
        weightGrams: 180,
        atelierNotes: "Two meters of pure cashmere, light as air. Hand-rolled edges and a subtle tonal logo add refinement without ostentation.",
        careInstructions: {
            en: ["Hand wash cold with cashmere shampoo", "Lay flat to dry", "Store folded with cedar"],
            fr: ["Laver à la main eau froide avec shampooing cachemire", "Sécher à plat", "Ranger plié avec du cèdre"],
        },
        materials: [{ materialId: "mat-cashmere", percentage: 100 }],
        translations: [
            {
                locale: Locale.EN,
                name: "L'Écharpe Cachemire",
                description: "Two meters of Mongolian cashmere, impossibly light. Generous dimensions allow for wrapping, draping, or elegant tossing. Hand-rolled edges finish the luxurious weight.",
                craftStory: "Each scarf is washed and brushed three times for optimal softness. The hand-rolled edge is a signature of quality.",
                materialsText: "100% Grade A Mongolian Cashmere",
                sizeGuide: "Dimensions: 200cm × 70cm. One size.",
            },
            {
                locale: Locale.FR,
                name: "L'Écharpe Cachemire",
                description: "Deux mètres de cachemire mongol, incroyablement léger. Les dimensions généreuses permettent d'enrouler, de draper ou de jeter élégamment. Les bords roulés à la main terminent le poids luxueux.",
                craftStory: "Chaque écharpe est lavée et brossée trois fois pour une douceur optimale. Le bord roulé main est une signature de qualité.",
                materialsText: "100% Cachemire Grade A de Mongolie",
                sizeGuide: "Dimensions: 200cm × 70cm. Taille unique.",
            },
        ],
        variants: [
            { sku: "EC-NR", color: "Noir", colorHex: "#1a1a1a", size: null, priceCents: 68000, inventoryQty: 20, personalizationAllowed: true },
            { sku: "EC-CB", color: "Camel", colorHex: "#c4a77d", size: null, priceCents: 68000, inventoryQty: 18, personalizationAllowed: true },
            { sku: "EC-GR", color: "Gris Chiné", colorHex: "#808080", size: null, priceCents: 68000, inventoryQty: 15, personalizationAllowed: true },
            { sku: "EC-IV", color: "Ivoire", colorHex: "#fffff0", size: null, priceCents: 68000, inventoryQty: 12, personalizationAllowed: true },
        ],
        mediaUrls: [IMG.scarf1, IMG.scarf2, IMG.scarf3],
    },
    {
        id: "prod-foulard-soie",
        slug: "le-foulard-soie",
        skuPrefix: "FS",
        status: ProductStatus.ACTIVE,
        categoryId: "cat-scarves",
        originCountry: "FR",
        heritageTag: "Lyon",
        limitedEdition: false,
        weightGrams: 65,
        atelierNotes: "Printed in Lyon using 12-color rotary screen technique. Each pattern is developed in-house and produced in limited quantities.",
        careInstructions: {
            en: ["Dry clean only", "Store rolled, not folded", "Keep away from perfume"],
            fr: ["Nettoyage à sec uniquement", "Ranger roulé, pas plié", "Éloigner des parfums"],
        },
        materials: [{ materialId: "mat-silk", percentage: 100 }],
        translations: [
            {
                locale: Locale.EN,
                name: "Le Foulard Soie",
                description: "A canvas of Lyon silk. Our signature print is developed in-house and produced using traditional 12-color rotary screen technique. Tie, drape, or frame as art.",
                craftStory: "One year to develop the print. Twelve screens for twelve colors. A square of wearable art.",
                materialsText: "100% Lyon Silk Twill",
                sizeGuide: "Dimensions: 90cm × 90cm. The classic carré format.",
            },
            {
                locale: Locale.FR,
                name: "Le Foulard Soie",
                description: "Une toile de soie lyonnaise. Notre imprimé signature est développé en interne et produit selon la technique traditionnelle de sérigraphie rotative 12 couleurs.",
                craftStory: "Un an pour développer l'imprimé. Douze écrans pour douze couleurs. Un carré d'art portable.",
                materialsText: "100% Twill de soie de Lyon",
                sizeGuide: "Dimensions: 90cm × 90cm. Le format carré classique.",
            },
        ],
        variants: [
            { sku: "FS-NR", color: "Nuit & Or", colorHex: "#1a1a1a", size: null, priceCents: 45000, inventoryQty: 25, personalizationAllowed: false },
            { sku: "FS-IV", color: "Ivoire & Marine", colorHex: "#fffff0", size: null, priceCents: 45000, inventoryQty: 20, personalizationAllowed: false },
            { sku: "FS-BG", color: "Bordeaux & Or", colorHex: "#722f37", size: null, priceCents: 45000, inventoryQty: 18, personalizationAllowed: false },
        ],
        mediaUrls: [IMG.scarf2, IMG.scarf3, IMG.scarf1],
    },
];

export default { productsBottoms, productsBags, productsAccessories };
