/**
 * Maison Aurèle – Knitwear & Tops Seed Data
 */

import { Locale, ProductStatus } from "@prisma/client";
import { ProductSeed } from "./products-outerwear";

// Curated luxury knitwear and tops imagery - verified working URLs
const KNITWEAR_IMAGES = {
    pull: [
        "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1200&q=80",
    ],
    blouse: [
        "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=1200&q=80",
    ],
    chemisier: [
        "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=1200&q=80",
    ],
};

// Verified working images for knitwear and tops
const IMG = {
    knit1: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1200&q=80",
    knit2: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1200&q=80",
    knit3: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1200&q=80",
    blouse1: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=1200&q=80",
    blouse2: "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=1200&q=80",
    blouse3: "https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=1200&q=80",
};

export const productsKnitwear: ProductSeed[] = [
    {
        id: "prod-pull-cachemire",
        slug: "le-pull-cachemire",
        skuPrefix: "PC",
        status: ProductStatus.ACTIVE,
        categoryId: "cat-knitwear",
        originCountry: "FR",
        heritageTag: "Mongolie Pure",
        limitedEdition: false,
        weightGrams: 380,
        atelierNotes: "Knitted from Grade A Mongolian cashmere—the finest 15% of the fleece. Full-fashioned construction means no cut edges; each piece is shaped on the machine.",
        careInstructions: {
            en: ["Hand wash in cool water with cashmere shampoo", "Lay flat to dry", "Fold to store—never hang"],
            fr: ["Laver à la main à l'eau fraîche avec shampooing cachemire", "Sécher à plat", "Plier pour ranger—ne jamais suspendre"],
        },
        materials: [{ materialId: "mat-cashmere", percentage: 100 }],
        translations: [
            {
                locale: Locale.EN,
                name: "Le Pull Cachemire",
                description: "Pure Mongolian cashmere, impossibly soft. The relaxed fit falls just below the hip, with dropped shoulders and ribbed cuffs that gently hug the wrist. Comfort elevated to luxury.",
                craftStory: "Each sweater uses cashmere from a single herd. Full-fashioned construction ensures no rough edges—only seamless softness.",
                materialsText: "100% Grade A Mongolian Cashmere",
                sizeGuide: "Relaxed fit. True to size for an elegant drape; size down for a closer fit.",
            },
            {
                locale: Locale.FR,
                name: "Le Pull Cachemire",
                description: "Pur cachemire de Mongolie, incroyablement doux. La coupe décontractée tombe juste sous la hanche, avec des épaules tombantes et des poignets côtelés qui enlacent doucement le poignet.",
                craftStory: "Chaque pull utilise le cachemire d'un seul troupeau. La construction fully-fashioned garantit aucun bord rugueux—seulement une douceur sans couture.",
                materialsText: "100% Cachemire Grade A de Mongolie",
                sizeGuide: "Coupe décontractée. Taille standard pour un drapé élégant; taille en dessous pour un ajustement plus près du corps.",
            },
        ],
        variants: [
            { sku: "PC-NR-S", color: "Noir", colorHex: "#1a1a1a", size: "S", priceCents: 189000, inventoryQty: 15, personalizationAllowed: false },
            { sku: "PC-NR-M", color: "Noir", colorHex: "#1a1a1a", size: "M", priceCents: 189000, inventoryQty: 18, personalizationAllowed: false },
            { sku: "PC-NR-L", color: "Noir", colorHex: "#1a1a1a", size: "L", priceCents: 189000, inventoryQty: 12, personalizationAllowed: false },
            { sku: "PC-CB-S", color: "Camel", colorHex: "#c4a77d", size: "S", priceCents: 189000, inventoryQty: 10, personalizationAllowed: false },
            { sku: "PC-CB-M", color: "Camel", colorHex: "#c4a77d", size: "M", priceCents: 189000, inventoryQty: 14, personalizationAllowed: false },
            { sku: "PC-GR-M", color: "Gris Chiné", colorHex: "#808080", size: "M", priceCents: 189000, inventoryQty: 11, personalizationAllowed: false },
        ],
        mediaUrls: [IMG.knit1, IMG.knit2, IMG.knit3],
    },
    {
        id: "prod-cardigan-aerien",
        slug: "le-cardigan-aerien",
        skuPrefix: "CA",
        status: ProductStatus.ACTIVE,
        categoryId: "cat-knitwear",
        originCountry: "FR",
        heritageTag: "Atelier Paris",
        limitedEdition: false,
        weightGrams: 320,
        atelierNotes: "A silk-cashmere blend creates a fabric with natural sheen and temperature regulation. Mother-of-pearl buttons hand-selected for color consistency.",
        careInstructions: {
            en: ["Dry clean or gentle hand wash", "Reshape while damp", "Store folded with cedar"],
            fr: ["Nettoyage à sec ou lavage main délicat", "Remettre en forme humide", "Ranger plié avec du cèdre"],
        },
        materials: [
            { materialId: "mat-cashmere", percentage: 70 },
            { materialId: "mat-silk", percentage: 30 },
        ],
        translations: [
            {
                locale: Locale.EN,
                name: "Le Cardigan Aérien",
                description: "Weightless warmth. The silk-cashmere blend creates a luminous fabric that drapes like liquid. V-neck, horn buttons, and a slightly cropped length that pairs with high-waisted trousers.",
                craftStory: "The blend is our secret: cashmere for warmth, silk for sheen. Each button is hand-matched to the knit.",
                materialsText: "70% Cashmere, 30% Silk / Mother-of-pearl buttons",
                sizeGuide: "Slightly cropped. Take your usual size for the intended proportion.",
            },
            {
                locale: Locale.FR,
                name: "Le Cardigan Aérien",
                description: "Chaleur sans poids. Le mélange soie-cachemire crée un tissu lumineux qui tombe comme du liquide. Col en V, boutons en corne, et une longueur légèrement courte qui s'associe aux pantalons taille haute.",
                craftStory: "Le mélange est notre secret: cachemire pour la chaleur, soie pour l'éclat. Chaque bouton est assorti à la main au tricot.",
                materialsText: "70% Cachemire, 30% Soie / Boutons en nacre",
                sizeGuide: "Légèrement court. Prenez votre taille habituelle pour la proportion prévue.",
            },
        ],
        variants: [
            { sku: "CA-NR-S", color: "Noir", colorHex: "#1a1a1a", size: "S", priceCents: 210000, inventoryQty: 10, personalizationAllowed: false },
            { sku: "CA-NR-M", color: "Noir", colorHex: "#1a1a1a", size: "M", priceCents: 210000, inventoryQty: 12, personalizationAllowed: false },
            { sku: "CA-IV-S", color: "Ivoire", colorHex: "#fffff0", size: "S", priceCents: 210000, inventoryQty: 8, personalizationAllowed: false },
            { sku: "CA-IV-M", color: "Ivoire", colorHex: "#fffff0", size: "M", priceCents: 210000, inventoryQty: 9, personalizationAllowed: false },
        ],
        mediaUrls: [IMG.knit2, IMG.knit3, IMG.knit1],
    },
    {
        id: "prod-twin-set",
        slug: "le-twin-set-parisien",
        skuPrefix: "TS",
        status: ProductStatus.ACTIVE,
        categoryId: "cat-knitwear",
        originCountry: "FR",
        heritageTag: "Savoir-Faire",
        limitedEdition: false,
        weightGrams: 480,
        atelierNotes: "The twin-set reimagined for today. A fitted short-sleeve knit paired with a matching cardigan. Sold as a set; each piece also works independently.",
        careInstructions: {
            en: ["Hand wash separately", "Lay flat to dry", "Steam gently if needed"],
            fr: ["Laver à la main séparément", "Sécher à plat", "Vaporiser délicatement si nécessaire"],
        },
        materials: [{ materialId: "mat-cashmere", percentage: 100 }],
        translations: [
            {
                locale: Locale.EN,
                name: "Le Twin-Set Parisien",
                description: "A Parisian essential, perfected. The fitted short-sleeve top pairs with its matching cardigan for endless versatility. Worn together or apart, the set embodies refined simplicity.",
                craftStory: "Two pieces, one intention. The twin-set has been part of Parisian wardrobes for decades—we simply make it better.",
                materialsText: "100% Mongolian Cashmere / Set of two pieces",
                sizeGuide: "Fitted silhouette. We recommend your true size.",
            },
            {
                locale: Locale.FR,
                name: "Le Twin-Set Parisien",
                description: "Un essentiel parisien, perfectionné. Le haut ajusté à manches courtes s'associe à son cardigan assorti pour une polyvalence infinie. Portés ensemble ou séparément, l'ensemble incarne la simplicité raffinée.",
                craftStory: "Deux pièces, une intention. Le twin-set fait partie des garde-robes parisiennes depuis des décennies—nous le faisons simplement mieux.",
                materialsText: "100% Cachemire de Mongolie / Ensemble de deux pièces",
                sizeGuide: "Silhouette ajustée. Nous recommandons votre taille réelle.",
            },
        ],
        variants: [
            { sku: "TS-NR-S", color: "Noir", colorHex: "#1a1a1a", size: "S", priceCents: 240000, inventoryQty: 6, personalizationAllowed: false },
            { sku: "TS-NR-M", color: "Noir", colorHex: "#1a1a1a", size: "M", priceCents: 240000, inventoryQty: 8, personalizationAllowed: false },
            { sku: "TS-CB-S", color: "Camel", colorHex: "#c4a77d", size: "S", priceCents: 240000, inventoryQty: 5, personalizationAllowed: false },
            { sku: "TS-CB-M", color: "Camel", colorHex: "#c4a77d", size: "M", priceCents: 240000, inventoryQty: 7, personalizationAllowed: false },
        ],
        mediaUrls: [IMG.knit3, IMG.knit1, IMG.knit2],
    },
];

export const productsTops: ProductSeed[] = [
    {
        id: "prod-blouse-poetique",
        slug: "la-blouse-poetique",
        skuPrefix: "BP",
        status: ProductStatus.ACTIVE,
        categoryId: "cat-tops",
        originCountry: "FR",
        heritageTag: "Soie Lyonnaise",
        limitedEdition: false,
        weightGrams: 180,
        atelierNotes: "Twelve panels of Lyon silk, assembled by hand. The bow collar can be tied multiple ways—at the neck, loosely draped, or left to flutter open.",
        careInstructions: {
            en: ["Dry clean recommended", "Cool iron on reverse if needed", "Store on padded hanger"],
            fr: ["Nettoyage à sec recommandé", "Fer froid sur l'envers si nécessaire", "Ranger sur cintre rembourré"],
        },
        materials: [{ materialId: "mat-silk", percentage: 100 }],
        translations: [
            {
                locale: Locale.EN,
                name: "La Blouse Poétique",
                description: "Romance in silk. The poet blouse features a generous bow collar, billowing sleeves, and French seams throughout. Pair with tailored trousers for Parisian polish.",
                craftStory: "Twelve panels of Lyon silk, hand-assembled. The bow collar offers three ways to wear—formal, draped, or open.",
                materialsText: "100% Silk Crêpe de Chine",
                sizeGuide: "Relaxed through the body with voluminous sleeves. True to size.",
            },
            {
                locale: Locale.FR,
                name: "La Blouse Poétique",
                description: "Romance en soie. La blouse poète présente un généreux col lavallière, des manches bouffantes et des coutures françaises partout. Associez avec un pantalon tailleur pour l'élégance parisienne.",
                craftStory: "Douze panneaux de soie lyonnaise, assemblés à la main. Le col lavallière offre trois façons de porter—formel, drapé ou ouvert.",
                materialsText: "100% Crêpe de Chine en soie",
                sizeGuide: "Décontractée au corps avec des manches volumineuses. Taille standard.",
            },
        ],
        variants: [
            { sku: "BP-IV-34", color: "Ivoire", colorHex: "#fffff0", size: "34", priceCents: 145000, inventoryQty: 10, personalizationAllowed: false },
            { sku: "BP-IV-36", color: "Ivoire", colorHex: "#fffff0", size: "36", priceCents: 145000, inventoryQty: 14, personalizationAllowed: false },
            { sku: "BP-IV-38", color: "Ivoire", colorHex: "#fffff0", size: "38", priceCents: 145000, inventoryQty: 12, personalizationAllowed: false },
            { sku: "BP-NR-36", color: "Noir", colorHex: "#1a1a1a", size: "36", priceCents: 145000, inventoryQty: 8, personalizationAllowed: false },
            { sku: "BP-NR-38", color: "Noir", colorHex: "#1a1a1a", size: "38", priceCents: 145000, inventoryQty: 9, personalizationAllowed: false },
        ],
        mediaUrls: [IMG.blouse1, IMG.blouse2, IMG.blouse3],
    },
    {
        id: "prod-chemisier-aurore",
        slug: "le-chemisier-aurore",
        skuPrefix: "CH",
        status: ProductStatus.ACTIVE,
        categoryId: "cat-tops",
        originCountry: "FR",
        heritageTag: "Atelier Paris",
        limitedEdition: false,
        weightGrams: 160,
        atelierNotes: "The perfect white shirt doesn't exist—until now. Egyptian cotton with mother-of-pearl buttons. Tailored yet relaxed, structured yet soft.",
        careInstructions: {
            en: ["Machine wash cold", "Line dry or tumble low", "Iron while slightly damp"],
            fr: ["Laver en machine à froid", "Sécher sur fil ou sèche-linge doux", "Repasser légèrement humide"],
        },
        materials: [{ materialId: "mat-cotton-egyptian", percentage: 100 }],
        translations: [
            {
                locale: Locale.EN,
                name: "Le Chemisier Aurore",
                description: "The essential white shirt, elevated. Crisp Egyptian cotton with a subtle sheen. Classic collar, hidden placket, and a slightly relaxed fit that tucks beautifully.",
                craftStory: "We spent two years perfecting this shirt. The fabric, the fit, the curve of the collar—every detail considered.",
                materialsText: "100% Egyptian Cotton / Mother-of-pearl buttons",
                sizeGuide: "Slightly relaxed fit. True to size; size down for a crisper silhouette.",
            },
            {
                locale: Locale.FR,
                name: "Le Chemisier Aurore",
                description: "La chemise blanche essentielle, sublimée. Coton égyptien net avec un éclat subtil. Col classique, patte de boutonnage cachée et une coupe légèrement décontractée qui se rentre parfaitement.",
                craftStory: "Nous avons passé deux ans à perfectionner cette chemise. Le tissu, la coupe, la courbe du col—chaque détail considéré.",
                materialsText: "100% Coton égyptien / Boutons en nacre",
                sizeGuide: "Coupe légèrement décontractée. Taille standard; taille en dessous pour une silhouette plus nette.",
            },
        ],
        variants: [
            { sku: "CH-BL-34", color: "Blanc", colorHex: "#ffffff", size: "34", priceCents: 125000, inventoryQty: 15, personalizationAllowed: true },
            { sku: "CH-BL-36", color: "Blanc", colorHex: "#ffffff", size: "36", priceCents: 125000, inventoryQty: 20, personalizationAllowed: true },
            { sku: "CH-BL-38", color: "Blanc", colorHex: "#ffffff", size: "38", priceCents: 125000, inventoryQty: 18, personalizationAllowed: true },
            { sku: "CH-CB-36", color: "Ciel", colorHex: "#87ceeb", size: "36", priceCents: 125000, inventoryQty: 10, personalizationAllowed: true },
            { sku: "CH-CB-38", color: "Ciel", colorHex: "#87ceeb", size: "38", priceCents: 125000, inventoryQty: 12, personalizationAllowed: true },
        ],
        mediaUrls: [IMG.blouse2, IMG.blouse3, IMG.blouse1],
    },
    {
        id: "prod-top-sculptural",
        slug: "le-top-sculptural",
        skuPrefix: "TPS",
        status: ProductStatus.ACTIVE,
        categoryId: "cat-tops",
        originCountry: "FR",
        heritageTag: "Contemporary",
        limitedEdition: false,
        weightGrams: 140,
        atelierNotes: "Architectural draping creates a sculptural effect from a single pattern piece. The asymmetric hem adds movement while the silk blend ensures comfort.",
        careInstructions: {
            en: ["Hand wash cold", "Lay flat to dry", "Steam to refresh"],
            fr: ["Laver à la main à froid", "Sécher à plat", "Vaporiser pour rafraîchir"],
        },
        materials: [
            { materialId: "mat-silk", percentage: 85 },
        ],
        translations: [
            {
                locale: Locale.EN,
                name: "Le Top Sculptural",
                description: "Architecture for the body. This draped top is cut from a single pattern piece that wraps and folds into sculptural form. The asymmetric hem moves with intention.",
                craftStory: "One cut, endless possibilities. Our drapers spent months perfecting the fold that creates this effortless shape.",
                materialsText: "85% Silk, 15% Elastane",
                sizeGuide: "One size fits most (34-40). The drape adjusts naturally to your silhouette.",
            },
            {
                locale: Locale.FR,
                name: "Le Top Sculptural",
                description: "Architecture pour le corps. Ce top drapé est coupé d'une seule pièce de patron qui s'enroule et se plie en forme sculpturale. L'ourlet asymétrique se meut avec intention.",
                craftStory: "Une coupe, des possibilités infinies. Nos drapiers ont passé des mois à perfectionner le pli qui crée cette forme sans effort.",
                materialsText: "85% Soie, 15% Élasthanne",
                sizeGuide: "Taille unique (34-40). Le drapé s'ajuste naturellement à votre silhouette.",
            },
        ],
        variants: [
            { sku: "TPS-NR-OS", color: "Noir", colorHex: "#1a1a1a", size: "One Size", priceCents: 98000, inventoryQty: 20, personalizationAllowed: false },
            { sku: "TPS-IV-OS", color: "Ivoire", colorHex: "#fffff0", size: "One Size", priceCents: 98000, inventoryQty: 15, personalizationAllowed: false },
            { sku: "TPS-BG-OS", color: "Bordeaux", colorHex: "#722f37", size: "One Size", priceCents: 98000, inventoryQty: 12, personalizationAllowed: false },
        ],
        mediaUrls: [IMG.blouse3, IMG.blouse1, IMG.blouse2],
    },
];

export default { productsKnitwear, productsTops };
