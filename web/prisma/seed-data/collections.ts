/**
 * Maison Aurèle – Collections Seed Data
 * 4 curated collections with editorial content and lookbook slides
 */

import { Locale, ProductStatus } from "@prisma/client";

// Curated luxury fashion collection imagery - verified working URLs
const COLLECTION_IMAGES = {
    nuitParisienne: {
        hero: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=80",
        sections: [
            "https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=1600&q=80",
            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=80",
        ],
        lookbook: [
            "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=1600&q=80",
            "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1600&q=80",
            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=80",
        ],
    },
    coteDazur: {
        hero: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1600&q=80",
        sections: [
            "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80",
            "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1600&q=80",
        ],
        lookbook: [
            "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1600&q=80",
            "https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=1600&q=80",
            "https://images.unsplash.com/photo-1485968579169-14f587571885?auto=format&fit=crop&w=1600&q=80",
        ],
    },
    atelierNoir: {
        hero: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1600&q=80",
        sections: [
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1600&q=80",
            "https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=1600&q=80",
        ],
        lookbook: [
            "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=1600&q=80",
            "https://images.unsplash.com/photo-1562137369-1a1a0bc66744?auto=format&fit=crop&w=1600&q=80",
        ],
    },
    heritage: {
        hero: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1600&q=80",
        sections: [
            "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=1600&q=80",
        ],
        lookbook: [
            "https://images.unsplash.com/photo-1508424757105-b6d5ad9329d0?auto=format&fit=crop&w=1600&q=80",
            "https://images.unsplash.com/photo-1557330359-ffb0deed6163?auto=format&fit=crop&w=1600&q=80",
        ],
    },
};

// Verified working images for collections
const IMG = {
    fashion1: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=80",
    fashion2: "https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=1600&q=80",
    fashion3: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=80",
    fashion4: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1600&q=80",
    fashion5: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1600&q=80",
    fashion6: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1600&q=80",
    fashion7: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1600&q=80",
    fashion8: "https://images.unsplash.com/photo-1518577915332-c2a19f149a75?auto=format&fit=crop&w=1600&q=80",
    fashion9: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=1600&q=80",
    fashion10: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1600&q=80",
    fashion11: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1600&q=80",
};

export interface CollectionSectionSeed {
    layout: string;
    sortOrder: number;
    assetUrl?: string;
    translations: {
        locale: Locale;
        heading: string;
        body: string;
        caption?: string;
    }[];
}

export interface LookbookSlideSeed {
    assetUrl: string;
    sortOrder: number;
    translations: {
        locale: Locale;
        title: string;
        body?: string;
        caption?: string;
    }[];
}

export interface CollectionSeed {
    id: string;
    slug: string;
    season: string;
    releaseDate: Date;
    status: ProductStatus;
    heroAssetUrl: string;
    productIds: string[];
    highlightedProductIds: string[];
    translations: {
        locale: Locale;
        title: string;
        subtitle: string;
        description: string;
        manifesto: string;
        seoTitle: string;
        seoDescription: string;
    }[];
    sections: CollectionSectionSeed[];
    lookbookSlides: LookbookSlideSeed[];
}

export const collections: CollectionSeed[] = [
    // ═══════════════════════════════════════════════════════════════
    // NUIT PARISIENNE – Fall/Winter Evening Collection
    // ═══════════════════════════════════════════════════════════════
    {
        id: "col-nuit-parisienne",
        slug: "nuit-parisienne",
        season: "Fall/Winter 2025",
        releaseDate: new Date("2025-09-15"),
        status: ProductStatus.ACTIVE,
        heroAssetUrl: IMG.fashion1,
        productIds: [
            "prod-manteau-nocturne",
            "prod-robe-eternelle",
            "prod-robe-soie",
            "prod-veste-sculptee",
            "prod-pochette-minuit",
            "prod-escarpin-lumiere",
            "prod-blouse-poetique",
            "prod-jupe-haute",
        ],
        highlightedProductIds: ["prod-robe-eternelle", "prod-manteau-nocturne"],
        translations: [
            {
                locale: Locale.EN,
                title: "Nuit Parisienne",
                subtitle: "Evening Wear • Fall/Winter 2025",
                description: "When the lights of Paris flicker on and the city transforms, Maison Aurèle presents a collection of quiet confidence. Draped silks, sculpted wools, and the subtle shimmer of velvet—pieces designed for evenings of consequence.",
                manifesto: "We believe that evening wear should whisper, not shout. That the most powerful silhouettes are those that move with intention. Nuit Parisienne is for women who command attention without seeking it—who understand that true elegance is an absence of excess.",
                seoTitle: "Nuit Parisienne Collection | Maison Aurèle Evening Wear",
                seoDescription: "Discover the Nuit Parisienne collection—evening wear defined by quiet confidence, draped silks, and sculptural tailoring. Handcrafted in Paris.",
            },
            {
                locale: Locale.FR,
                title: "Nuit Parisienne",
                subtitle: "Tenue de Soirée • Automne/Hiver 2025",
                description: "Quand les lumières de Paris s'allument et que la ville se transforme, Maison Aurèle présente une collection de confiance tranquille. Soies drapées, laines sculptées, et l'éclat subtil du velours—des pièces conçues pour les soirées d'importance.",
                manifesto: "Nous croyons que la tenue de soirée doit murmurer, pas crier. Que les silhouettes les plus puissantes sont celles qui se meuvent avec intention. Nuit Parisienne est pour les femmes qui commandent l'attention sans la chercher.",
                seoTitle: "Collection Nuit Parisienne | Maison Aurèle Tenues de Soirée",
                seoDescription: "Découvrez la collection Nuit Parisienne—des tenues de soirée définies par la confiance tranquille, les soies drapées et la coupe sculpturale. Fabriqué à Paris.",
            },
        ],
        sections: [
            {
                layout: "full-bleed",
                sortOrder: 1,
                assetUrl: IMG.fashion2,
                translations: [
                    { locale: Locale.EN, heading: "The Evening Hour", body: "Paris at dusk transforms. So do you.", caption: "Photographed at Palais Royal" },
                    { locale: Locale.FR, heading: "L'Heure du Soir", body: "Paris au crépuscule se transforme. Vous aussi.", caption: "Photographié au Palais Royal" },
                ],
            },
            {
                layout: "split",
                sortOrder: 2,
                assetUrl: IMG.fashion3,
                translations: [
                    { locale: Locale.EN, heading: "Fabric as Emotion", body: "Lyon silk that catches the light. Cashmere that drapes like water. Materials chosen not for what they are, but for what they make you feel." },
                    { locale: Locale.FR, heading: "Le Tissu comme Émotion", body: "Soie lyonnaise qui capte la lumière. Cachemire qui tombe comme l'eau. Des matières choisies non pour ce qu'elles sont, mais pour ce qu'elles vous font ressentir." },
                ],
            },
            {
                layout: "quote",
                sortOrder: 3,
                translations: [
                    { locale: Locale.EN, heading: "\"The night asks only one thing: that you arrive entirely as yourself.\"", body: "— Artistic Director, Maison Aurèle" },
                    { locale: Locale.FR, heading: "\"La nuit ne demande qu'une chose: que vous arriviez entièrement vous-même.\"", body: "— Directeur Artistique, Maison Aurèle" },
                ],
            },
        ],
        lookbookSlides: [
            {
                assetUrl: IMG.fashion1, sortOrder: 1, translations: [
                    { locale: Locale.EN, title: "Look 01", body: "Le Manteau Nocturne in Noir", caption: "Pure cashmere, absolute presence" },
                    { locale: Locale.FR, title: "Look 01", body: "Le Manteau Nocturne en Noir", caption: "Cachemire pur, présence absolue" },
                ]
            },
            {
                assetUrl: IMG.fashion4, sortOrder: 2, translations: [
                    { locale: Locale.EN, title: "Look 02", body: "La Robe Éternelle", caption: "25 meters of Lyon silk in motion" },
                    { locale: Locale.FR, title: "Look 02", body: "La Robe Éternelle", caption: "25 mètres de soie lyonnaise en mouvement" },
                ]
            },
            {
                assetUrl: IMG.fashion3, sortOrder: 3, translations: [
                    { locale: Locale.EN, title: "Look 03", body: "La Blouse Poétique with La Jupe Haute", caption: "Bow tied at the neck, silk falls to the knee" },
                    { locale: Locale.FR, title: "Look 03", body: "La Blouse Poétique avec La Jupe Haute", caption: "Lavallière nouée au cou, la soie tombe au genou" },
                ]
            },
        ],
    },

    // ═══════════════════════════════════════════════════════════════
    // CÔTE D'AZUR – Resort/Summer Collection
    // ═══════════════════════════════════════════════════════════════
    {
        id: "col-cote-dazur",
        slug: "cote-dazur",
        season: "Spring/Summer 2026",
        releaseDate: new Date("2026-02-20"),
        status: ProductStatus.ACTIVE,
        heroAssetUrl: IMG.fashion5,
        productIds: [
            "prod-trench-aurele",
            "prod-robe-soie",
            "prod-chemisier-aurore",
            "prod-pantalon-fluide",
            "prod-foulard-soie",
            "prod-cabas-parisien",
        ],
        highlightedProductIds: ["prod-trench-aurele", "prod-robe-soie"],
        translations: [
            {
                locale: Locale.EN,
                title: "Côte d'Azur",
                subtitle: "Resort Collection • Spring/Summer 2026",
                description: "Mediterranean ease meets Parisian precision. Linens that breathe, silks that flow, and the effortless elegance of a summer spent between sea and sky.",
                manifesto: "The French Riviera taught us that true luxury is lightness. That the best clothes disappear into the moment, letting you become the view. Côte d'Azur is an invitation to dress for the life you want to live.",
                seoTitle: "Côte d'Azur Collection | Maison Aurèle Resort Wear",
                seoDescription: "Experience the Côte d'Azur collection—Mediterranean-inspired resort wear with effortless silhouettes in linen and silk.",
            },
            {
                locale: Locale.FR,
                title: "Côte d'Azur",
                subtitle: "Collection Resort • Printemps/Été 2026",
                description: "L'aisance méditerranéenne rencontre la précision parisienne. Des lins qui respirent, des soies qui coulent, et l'élégance sans effort d'un été passé entre mer et ciel.",
                manifesto: "La Côte d'Azur nous a appris que le vrai luxe est la légèreté. Que les meilleurs vêtements disparaissent dans le moment, vous laissant devenir le paysage. Côte d'Azur est une invitation à s'habiller pour la vie que vous voulez vivre.",
                seoTitle: "Collection Côte d'Azur | Maison Aurèle Mode Resort",
                seoDescription: "Découvrez la collection Côte d'Azur—mode resort d'inspiration méditerranéenne avec silhouettes sans effort en lin et soie.",
            },
        ],
        sections: [
            {
                layout: "full-bleed",
                sortOrder: 1,
                assetUrl: IMG.fashion5,
                translations: [
                    { locale: Locale.EN, heading: "Between Sea and Sky", body: "Where the horizon line disappears and so do you.", caption: "Cap Ferrat, June" },
                    { locale: Locale.FR, heading: "Entre Mer et Ciel", body: "Où la ligne d'horizon disparaît, et vous aussi.", caption: "Cap Ferrat, Juin" },
                ],
            },
            {
                layout: "split",
                sortOrder: 2,
                assetUrl: IMG.fashion2,
                translations: [
                    { locale: Locale.EN, heading: "Linen Days", body: "Normandy linen, Mediterranean sun. Fabrics that improve with every wash, that tell stories of salt and wind." },
                    { locale: Locale.FR, heading: "Jours de Lin", body: "Lin de Normandie, soleil méditerranéen. Des tissus qui s'améliorent à chaque lavage, qui racontent des histoires de sel et de vent." },
                ],
            },
        ],
        lookbookSlides: [
            {
                assetUrl: IMG.fashion9, sortOrder: 1, translations: [
                    { locale: Locale.EN, title: "Look 01", body: "Le Trench Aurèle in Sable", caption: "Cotton-silk for warm evenings" },
                    { locale: Locale.FR, title: "Look 01", body: "Le Trench Aurèle en Sable", caption: "Coton-soie pour les soirées douces" },
                ]
            },
            {
                assetUrl: IMG.fashion2, sortOrder: 2, translations: [
                    { locale: Locale.EN, title: "Look 02", body: "Le Chemisier Aurore with Le Pantalon Fluide", caption: "Effortless from beach to dinner" },
                    { locale: Locale.FR, title: "Look 02", body: "Le Chemisier Aurore avec Le Pantalon Fluide", caption: "Sans effort de la plage au dîner" },
                ]
            },
        ],
    },

    // ═══════════════════════════════════════════════════════════════
    // ATELIER PREMIÈRE – Heritage/Signature Collection
    // ═══════════════════════════════════════════════════════════════
    {
        id: "col-atelier-premiere",
        slug: "atelier-premiere",
        season: "Permanent Collection",
        releaseDate: new Date("2024-01-01"),
        status: ProductStatus.ACTIVE,
        heroAssetUrl: IMG.fashion6,
        productIds: [
            "prod-veste-sculptee",
            "prod-chemisier-aurore",
            "prod-pull-cachemire",
            "prod-sac-aurele",
            "prod-mocassin-aurele",
            "prod-echarpe-cachemire",
        ],
        highlightedProductIds: ["prod-veste-sculptee", "prod-sac-aurele"],
        translations: [
            {
                locale: Locale.EN,
                title: "Atelier Première",
                subtitle: "Signature Collection • Permanent",
                description: "The unchanging essentials. Pieces refined over decades, perfected through use. This is the foundation of the Maison Aurèle wardrobe—garments that need no season.",
                manifesto: "Some clothes are made for moments. These are made for lives. Atelier Première represents our belief that the best design is invisible—clothing that becomes part of you, that you reach for without thinking.",
                seoTitle: "Atelier Première | Maison Aurèle Signature Collection",
                seoDescription: "The permanent collection—signature pieces refined over decades. Timeless essentials from Maison Aurèle.",
            },
            {
                locale: Locale.FR,
                title: "Atelier Première",
                subtitle: "Collection Signature • Permanente",
                description: "Les essentiels immuables. Des pièces affinées sur des décennies, perfectionnées par l'usage. C'est le fondement de la garde-robe Maison Aurèle—des vêtements qui n'ont besoin d'aucune saison.",
                manifesto: "Certains vêtements sont faits pour des moments. Ceux-ci sont faits pour des vies. Atelier Première représente notre croyance que le meilleur design est invisible.",
                seoTitle: "Atelier Première | Collection Signature Maison Aurèle",
                seoDescription: "La collection permanente—pièces signature affinées sur des décennies. Essentiels intemporels de Maison Aurèle.",
            },
        ],
        sections: [
            {
                layout: "full-bleed",
                sortOrder: 1,
                assetUrl: IMG.fashion6,
                translations: [
                    { locale: Locale.EN, heading: "Since 1962", body: "Six decades of refinement. The same pursuit, different hands." },
                    { locale: Locale.FR, heading: "Depuis 1962", body: "Six décennies de raffinement. La même quête, des mains différentes." },
                ],
            },
        ],
        lookbookSlides: [
            {
                assetUrl: IMG.fashion7, sortOrder: 1, translations: [
                    { locale: Locale.EN, title: "The Blazer", body: "La Veste Sculptée", caption: "Built on horsehair canvas, worn for decades" },
                    { locale: Locale.FR, title: "Le Blazer", body: "La Veste Sculptée", caption: "Construit sur toile de crin, porté pendant des décennies" },
                ]
            },
            {
                assetUrl: IMG.fashion10, sortOrder: 2, translations: [
                    { locale: Locale.EN, title: "The Bag", body: "Le Sac Aurèle", caption: "18 hours of hand-stitching per piece" },
                    { locale: Locale.FR, title: "Le Sac", body: "Le Sac Aurèle", caption: "18 heures de couture main par pièce" },
                ]
            },
        ],
    },

    // ═══════════════════════════════════════════════════════════════
    // MINUIT DORÉ – Limited Edition Capsule
    // ═══════════════════════════════════════════════════════════════
    {
        id: "col-minuit-dore",
        slug: "minuit-dore",
        season: "Limited Edition 2025",
        releaseDate: new Date("2025-11-01"),
        status: ProductStatus.ACTIVE,
        heroAssetUrl: IMG.fashion8,
        productIds: [
            "prod-blouson-minuit",
            "prod-robe-dentelle",
            "prod-twin-set",
            "prod-pochette-minuit",
        ],
        highlightedProductIds: ["prod-robe-dentelle", "prod-blouson-minuit"],
        translations: [
            {
                locale: Locale.EN,
                title: "Minuit Doré",
                subtitle: "Limited Edition • November 2025",
                description: "Gold at midnight. A capsule of four extraordinary pieces, each limited to 50 units worldwide. Calais lace, vegetable-tanned leather, and the subtle shimmer of gold.",
                manifesto: "Scarcity is not the point. Intention is. Minuit Doré represents the heights of what our atelier can achieve when constraints fall away—when we create not for seasons but for eternity.",
                seoTitle: "Minuit Doré Limited Edition | Maison Aurèle",
                seoDescription: "Discover Minuit Doré—a limited edition capsule of four extraordinary pieces. Only 50 units each, worldwide.",
            },
            {
                locale: Locale.FR,
                title: "Minuit Doré",
                subtitle: "Édition Limitée • Novembre 2025",
                description: "L'or à minuit. Une capsule de quatre pièces extraordinaires, chacune limitée à 50 unités dans le monde. Dentelle de Calais, cuir tanné végétal, et l'éclat subtil de l'or.",
                manifesto: "La rareté n'est pas le point. L'intention l'est. Minuit Doré représente les sommets de ce que notre atelier peut accomplir quand les contraintes s'effacent.",
                seoTitle: "Minuit Doré Édition Limitée | Maison Aurèle",
                seoDescription: "Découvrez Minuit Doré—une capsule édition limitée de quatre pièces extraordinaires. Seulement 50 unités chacune.",
            },
        ],
        sections: [
            {
                layout: "full-bleed",
                sortOrder: 1,
                assetUrl: IMG.fashion8,
                translations: [
                    { locale: Locale.EN, heading: "Four Pieces. Fifty Each.", body: "When we remove the constraints of scale, we find the heights of craft.", caption: "Atelier Paris, 3am" },
                    { locale: Locale.FR, heading: "Quatre Pièces. Cinquante Chacune.", body: "Quand nous retirons les contraintes d'échelle, nous trouvons les sommets du métier.", caption: "Atelier Paris, 3h du matin" },
                ],
            },
        ],
        lookbookSlides: [
            {
                assetUrl: IMG.fashion11, sortOrder: 1, translations: [
                    { locale: Locale.EN, title: "01/50", body: "Le Blouson Minuit", caption: "Three Tuscan hides, seamlessly matched" },
                    { locale: Locale.FR, title: "01/50", body: "Le Blouson Minuit", caption: "Trois peaux toscanes, parfaitement assorties" },
                ]
            },
            {
                assetUrl: IMG.fashion4, sortOrder: 2, translations: [
                    { locale: Locale.EN, title: "02/50", body: "La Robe Dentelle", caption: "32 hours of Calais lace weaving" },
                    { locale: Locale.FR, title: "02/50", body: "La Robe Dentelle", caption: "32 heures de tissage dentelle de Calais" },
                ]
            },
        ],
    },
];

export default collections;
