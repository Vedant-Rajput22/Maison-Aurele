/**
 * Maison Aurèle – Editorial/Journal Seed Data
 * 6 editorial posts with rich bilingual content
 */

import { Locale, ProductStatus, EditorialCategory } from "@prisma/client";

// Curated luxury fashion editorial imagery - verified working URLs
const EDITORIAL_IMAGES = {
    lesMains: {
        hero: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1600&q=80",
        media: [
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1600&q=80",
            "https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=1600&q=80",
        ],
    },
    nuitFilm: {
        hero: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=80",
        media: [
            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=80",
        ],
    },
    matiere: {
        hero: "https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=1600&q=80",
        media: [
            "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80",
            "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1600&q=80",
        ],
    },
    archive: {
        hero: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1600&q=80",
        media: [
            "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=1600&q=80",
        ],
    },
    silhouette: {
        hero: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1600&q=80",
        media: [
            "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1600&q=80",
        ],
    },
    nocturne: {
        hero: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=1600&q=80",
        media: [
            "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1600&q=80",
        ],
    },
};

// Verified working images for editorial
const IMG = {
    editorial1: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1600&q=80",
    editorial2: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=80",
    editorial3: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1600&q=80",
    editorial4: "https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=1600&q=80",
    editorial5: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=80",
    editorial6: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1600&q=80",
    editorial7: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1600&q=80",
    editorial8: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1600&q=80",
};

export interface EditorialBlockSeed {
    type: "text" | "quote" | "media" | "carousel";
    sortOrder: number;
    assetUrl?: string;
    translations: {
        locale: Locale;
        headline?: string;
        body?: string;
        caption?: string;
    }[];
}

export interface EditorialFeatureSeed {
    productId: string;
    note?: string;
    sortOrder: number;
}

export interface EditorialSeed {
    id: string;
    slug: string;
    category: EditorialCategory;
    publishedAt: Date;
    status: ProductStatus;
    heroAssetUrl: string;
    translations: {
        locale: Locale;
        title: string;
        standfirst: string;
        seoTitle: string;
        seoDescription: string;
    }[];
    blocks: EditorialBlockSeed[];
    featuredProducts: EditorialFeatureSeed[];
}

export const editorialPosts: EditorialSeed[] = [
    // ═══════════════════════════════════════════════════════════════
    // LES MAINS DE L'ATELIER – The Hands of the Atelier
    // ═══════════════════════════════════════════════════════════════
    {
        id: "edit-les-mains",
        slug: "les-mains-de-latelier",
        category: EditorialCategory.MAISON,
        publishedAt: new Date("2025-06-15"),
        status: ProductStatus.ACTIVE,
        heroAssetUrl: IMG.editorial1,
        translations: [
            {
                locale: Locale.EN,
                title: "Les Mains de l'Atelier",
                standfirst: "In our Paris atelier, 47 pairs of hands shape each collection. This is their story—and ours.",
                seoTitle: "Les Mains de l'Atelier | Maison Aurèle Journal",
                seoDescription: "Discover the craftsmen and women behind Maison Aurèle. 47 pairs of hands in our Paris atelier, continuing traditions started in 1962.",
            },
            {
                locale: Locale.FR,
                title: "Les Mains de l'Atelier",
                standfirst: "Dans notre atelier parisien, 47 paires de mains façonnent chaque collection. C'est leur histoire—et la nôtre.",
                seoTitle: "Les Mains de l'Atelier | Journal Maison Aurèle",
                seoDescription: "Découvrez les artisans derrière Maison Aurèle. 47 paires de mains dans notre atelier parisien, perpétuant des traditions depuis 1962.",
            },
        ],
        blocks: [
            {
                type: "text",
                sortOrder: 1,
                translations: [
                    {
                        locale: Locale.EN,
                        headline: "The Atelier at 5am",
                        body: "Before dawn, when the rue du Faubourg Saint-Honoré is still empty, light already glows from our third-floor windows. Marguerite, our head seamstress, arrives first. She has been with the maison since 1987, when she was nineteen. 'I don't think about years,' she says, threading a needle with silk so fine it seems to disappear. 'I think about stitches. And there are always more stitches to make.'"
                    },
                    {
                        locale: Locale.FR,
                        headline: "L'Atelier à 5h du Matin",
                        body: "Avant l'aube, quand la rue du Faubourg Saint-Honoré est encore vide, la lumière brille déjà de nos fenêtres du troisième étage. Marguerite, notre première d'atelier, arrive en premier. Elle est avec la maison depuis 1987, quand elle avait dix-neuf ans. 'Je ne pense pas aux années,' dit-elle, enfilant une aiguille avec de la soie si fine qu'elle semble disparaître. 'Je pense aux points. Et il y a toujours plus de points à faire.'"
                    },
                ],
            },
            {
                type: "media",
                sortOrder: 2,
                assetUrl: IMG.editorial3,
                translations: [
                    { locale: Locale.EN, caption: "Marguerite at work on La Veste Sculptée, February 2025" },
                    { locale: Locale.FR, caption: "Marguerite au travail sur La Veste Sculptée, Février 2025" },
                ],
            },
            {
                type: "quote",
                sortOrder: 3,
                translations: [
                    {
                        locale: Locale.EN,
                        headline: "\"A stitch is a decision. Forty thousand decisions make a coat.\"",
                        body: "— Marguerite, Première d'Atelier"
                    },
                    {
                        locale: Locale.FR,
                        headline: "\"Un point est une décision. Quarante mille décisions font un manteau.\"",
                        body: "— Marguerite, Première d'Atelier"
                    },
                ],
            },
            {
                type: "text",
                sortOrder: 4,
                translations: [
                    {
                        locale: Locale.EN,
                        headline: "The Passing of Knowledge",
                        body: "Apprenticeship at Maison Aurèle takes seven years. 'We don't train tailors,' says our atelier director, Jean-Pierre. 'We grow them. Like a vine, they need time in the soil before they can bear fruit.' Each apprentice sits beside a master for five years before they touch a client garment. 'Speed is not the goal,' Jean-Pierre continues. 'Excellence takes the time it takes.'"
                    },
                    {
                        locale: Locale.FR,
                        headline: "La Transmission du Savoir",
                        body: "L'apprentissage chez Maison Aurèle prend sept ans. 'Nous ne formons pas des tailleurs,' dit notre directeur d'atelier, Jean-Pierre. 'Nous les cultivons. Comme une vigne, ils ont besoin de temps dans le sol avant de pouvoir porter des fruits.' Chaque apprenti s'assoit à côté d'un maître pendant cinq ans avant de toucher un vêtement client."
                    },
                ],
            },
        ],
        featuredProducts: [
            { productId: "prod-veste-sculptee", note: "Featured in this story", sortOrder: 1 },
            { productId: "prod-manteau-nocturne", note: "Atelier craftsmanship", sortOrder: 2 },
        ],
    },

    // ═══════════════════════════════════════════════════════════════
    // NUIT PARISIENNE: THE FILM
    // ═══════════════════════════════════════════════════════════════
    {
        id: "edit-nuit-film",
        slug: "nuit-parisienne-the-film",
        category: EditorialCategory.CAMPAIGN,
        publishedAt: new Date("2025-09-20"),
        status: ProductStatus.ACTIVE,
        heroAssetUrl: IMG.editorial2,
        translations: [
            {
                locale: Locale.EN,
                title: "Nuit Parisienne: The Film",
                standfirst: "Director Léa Morel captures one night in Paris—from dusk at the Palais Royal to dawn at Les Halles. A cinematic journey through our Fall/Winter collection.",
                seoTitle: "Nuit Parisienne Campaign Film | Maison Aurèle",
                seoDescription: "Watch the Nuit Parisienne campaign film. Director Léa Morel captures Paris from dusk to dawn, featuring the Fall/Winter 2025 collection.",
            },
            {
                locale: Locale.FR,
                title: "Nuit Parisienne: Le Film",
                standfirst: "La réalisatrice Léa Morel capture une nuit à Paris—du crépuscule au Palais Royal à l'aube aux Halles. Un voyage cinématique à travers notre collection Automne/Hiver.",
                seoTitle: "Film de Campagne Nuit Parisienne | Maison Aurèle",
                seoDescription: "Regardez le film de campagne Nuit Parisienne. La réalisatrice Léa Morel capture Paris du crépuscule à l'aube.",
            },
        ],
        blocks: [
            {
                type: "text",
                sortOrder: 1,
                translations: [
                    {
                        locale: Locale.EN,
                        headline: "One Night, One City, One Story",
                        body: "We gave director Léa Morel a simple brief: show us Paris as you see it. She chose the hours between 7pm and 7am—twelve hours of darkness in which the city reveals its secret self. 'Paris at night is not the Paris of photographs,' Morel explains. 'It's a city of shadows, whispers, and women who walk with intention.'"
                    },
                    {
                        locale: Locale.FR,
                        headline: "Une Nuit, Une Ville, Une Histoire",
                        body: "Nous avons donné à la réalisatrice Léa Morel un brief simple: montrez-nous Paris comme vous le voyez. Elle a choisi les heures entre 19h et 7h—douze heures d'obscurité durant lesquelles la ville révèle son moi secret. 'Paris la nuit n'est pas le Paris des photographies,' explique Morel."
                    },
                ],
            },
            {
                type: "media",
                sortOrder: 2,
                assetUrl: IMG.editorial4,
                translations: [
                    { locale: Locale.EN, caption: "Still from Nuit Parisienne: Palais Royal, 21h" },
                    { locale: Locale.FR, caption: "Image de Nuit Parisienne: Palais Royal, 21h" },
                ],
            },
            {
                type: "quote",
                sortOrder: 3,
                translations: [
                    {
                        locale: Locale.EN,
                        headline: "\"Fashion films often try to sell you something. I wanted to show you something.\"",
                        body: "— Léa Morel, Director"
                    },
                    {
                        locale: Locale.FR,
                        headline: "\"Les films de mode essaient souvent de vous vendre quelque chose. Je voulais vous montrer quelque chose.\"",
                        body: "— Léa Morel, Réalisatrice"
                    },
                ],
            },
        ],
        featuredProducts: [
            { productId: "prod-robe-eternelle", note: "Worn at 23h", sortOrder: 1 },
            { productId: "prod-manteau-nocturne", note: "Opening scene", sortOrder: 2 },
            { productId: "prod-pochette-minuit", note: "Night companion", sortOrder: 3 },
        ],
    },

    // ═══════════════════════════════════════════════════════════════
    // SILK: FROM LYON TO YOU
    // ═══════════════════════════════════════════════════════════════
    {
        id: "edit-silk-lyon",
        slug: "silk-from-lyon-to-you",
        category: EditorialCategory.JOURNAL,
        publishedAt: new Date("2025-04-10"),
        status: ProductStatus.ACTIVE,
        heroAssetUrl: IMG.editorial5,
        translations: [
            {
                locale: Locale.EN,
                title: "Silk: From Lyon to You",
                standfirst: "In the hills above Lyon, master weavers continue a tradition that began in the Renaissance. We traced the journey of our silk from cocoon to collection.",
                seoTitle: "The Journey of Lyon Silk | Maison Aurèle Journal",
                seoDescription: "Follow the journey of Maison Aurèle silk from Lyon weavers to finished garment. Renaissance tradition meets modern luxury.",
            },
            {
                locale: Locale.FR,
                title: "La Soie: De Lyon à Vous",
                standfirst: "Dans les collines au-dessus de Lyon, des maîtres tisseurs perpétuent une tradition qui remonte à la Renaissance. Nous avons retracé le voyage de notre soie, du cocon à la collection.",
                seoTitle: "Le Voyage de la Soie de Lyon | Journal Maison Aurèle",
                seoDescription: "Suivez le voyage de la soie Maison Aurèle des tisseurs lyonnais au vêtement fini.",
            },
        ],
        blocks: [
            {
                type: "text",
                sortOrder: 1,
                translations: [
                    {
                        locale: Locale.EN,
                        headline: "500 Years of Weaving",
                        body: "Lyon's silk quarter—the Croix-Rousse—was once home to 30,000 looms. Today, fewer than 100 remain. But in the workshops that survive, the craft continues unchanged. We visited Maison Bouton, our partner since 1978, where fourth-generation weaver Philippe Bouton showed us the Jacquard looms his great-grandfather used. 'The machines are old,' he says, 'but the silk they produce is eternal.'"
                    },
                    {
                        locale: Locale.FR,
                        headline: "500 Ans de Tissage",
                        body: "Le quartier de la soie de Lyon—la Croix-Rousse—abritait autrefois 30 000 métiers. Aujourd'hui, moins de 100 subsistent. Mais dans les ateliers qui survivent, le métier continue inchangé. Nous avons visité la Maison Bouton, notre partenaire depuis 1978, où le tisseur de quatrième génération Philippe Bouton nous a montré les métiers Jacquard que son arrière-grand-père utilisait."
                    },
                ],
            },
            {
                type: "media",
                sortOrder: 2,
                assetUrl: IMG.editorial4,
                translations: [
                    { locale: Locale.EN, caption: "Philippe Bouton at his Jacquard loom, Croix-Rousse" },
                    { locale: Locale.FR, caption: "Philippe Bouton à son métier Jacquard, Croix-Rousse" },
                ],
            },
        ],
        featuredProducts: [
            { productId: "prod-blouse-poetique", note: "Made with Lyon silk", sortOrder: 1 },
            { productId: "prod-foulard-soie", note: "Printed in Lyon", sortOrder: 2 },
            { productId: "prod-robe-soie", note: "25 meters of Lyon silk", sortOrder: 3 },
        ],
    },

    // ═══════════════════════════════════════════════════════════════
    // HERITAGE: 1962–2025
    // ═══════════════════════════════════════════════════════════════
    {
        id: "edit-heritage",
        slug: "heritage-1962-2025",
        category: EditorialCategory.MAISON,
        publishedAt: new Date("2025-01-15"),
        status: ProductStatus.ACTIVE,
        heroAssetUrl: IMG.editorial6,
        translations: [
            {
                locale: Locale.EN,
                title: "Heritage: 1962–2025",
                standfirst: "Six decades of quiet excellence. From our founding in a small atelier on the Left Bank to today, the principles remain unchanged: craft over speed, quality over quantity.",
                seoTitle: "Maison Aurèle Heritage | 1962–2025",
                seoDescription: "Explore six decades of Maison Aurèle history. From our founding in 1962 to today, discover the story of French couture excellence.",
            },
            {
                locale: Locale.FR,
                title: "Héritage: 1962–2025",
                standfirst: "Six décennies d'excellence tranquille. De notre fondation dans un petit atelier de la Rive Gauche jusqu'à aujourd'hui, les principes restent inchangés: le métier avant la vitesse, la qualité avant la quantité.",
                seoTitle: "Héritage Maison Aurèle | 1962–2025",
                seoDescription: "Explorez six décennies d'histoire Maison Aurèle. De notre fondation en 1962 à aujourd'hui.",
            },
        ],
        blocks: [
            {
                type: "text",
                sortOrder: 1,
                translations: [
                    {
                        locale: Locale.EN,
                        headline: "A Room Above a Café",
                        body: "In 1962, Aurèle Montfort opened her first atelier in a two-room apartment above a café on the rue de Sèvres. She had three sewing machines, no clients, and an unshakeable conviction: that French women deserved clothes that lasted. Her first collection—twelve pieces in black and camel—sold out in a week. 'I didn't design fashion,' she would later say. 'I designed permanence.'"
                    },
                    {
                        locale: Locale.FR,
                        headline: "Une Chambre Au-Dessus d'un Café",
                        body: "En 1962, Aurèle Montfort ouvre son premier atelier dans un appartement de deux pièces au-dessus d'un café rue de Sèvres. Elle avait trois machines à coudre, pas de clientes, et une conviction inébranlable: que les femmes françaises méritaient des vêtements qui durent. Sa première collection—douze pièces en noir et camel—a été épuisée en une semaine."
                    },
                ],
            },
            {
                type: "quote",
                sortOrder: 2,
                translations: [
                    {
                        locale: Locale.EN,
                        headline: "\"I didn't design fashion. I designed permanence.\"",
                        body: "— Aurèle Montfort, Founder (1962)"
                    },
                    {
                        locale: Locale.FR,
                        headline: "\"Je n'ai pas dessiné de la mode. J'ai dessiné de la permanence.\"",
                        body: "— Aurèle Montfort, Fondatrice (1962)"
                    },
                ],
            },
        ],
        featuredProducts: [
            { productId: "prod-veste-sculptee", note: "Inspired by the 1965 original", sortOrder: 1 },
        ],
    },

    // ═══════════════════════════════════════════════════════════════
    // SUMMER ON THE RIVIERA
    // ═══════════════════════════════════════════════════════════════
    {
        id: "edit-riviera",
        slug: "summer-on-the-riviera",
        category: EditorialCategory.COLLECTION,
        publishedAt: new Date("2026-03-01"),
        status: ProductStatus.ACTIVE,
        heroAssetUrl: IMG.editorial7,
        translations: [
            {
                locale: Locale.EN,
                title: "Summer on the Riviera",
                standfirst: "The Côte d'Azur collection was designed for mornings on the terrace, afternoons at sea, and evenings that never quite end. A visual diary of Mediterranean ease.",
                seoTitle: "Côte d'Azur Collection Story | Maison Aurèle",
                seoDescription: "Discover the inspiration behind the Côte d'Azur collection. Mediterranean ease meets Parisian precision.",
            },
            {
                locale: Locale.FR,
                title: "L'Été sur la Riviera",
                standfirst: "La collection Côte d'Azur a été conçue pour les matins sur la terrasse, les après-midi en mer, et les soirées qui ne finissent jamais vraiment. Un journal visuel de l'aisance méditerranéenne.",
                seoTitle: "L'Histoire de la Collection Côte d'Azur | Maison Aurèle",
                seoDescription: "Découvrez l'inspiration derrière la collection Côte d'Azur.",
            },
        ],
        blocks: [
            {
                type: "text",
                sortOrder: 1,
                translations: [
                    {
                        locale: Locale.EN,
                        headline: "The Light of the South",
                        body: "Our creative director spent three weeks in Antibes before drawing a single sketch. 'I needed to remember what summer feels like,' she explains. 'The weight of heat in the afternoon. The relief of a linen dress. The way your skin tastes like salt by evening.' The collection that emerged is our lightest yet—linens from Normandy, silks from Lyon, and a palette borrowed from the sea itself."
                    },
                    {
                        locale: Locale.FR,
                        headline: "La Lumière du Sud",
                        body: "Notre directrice de création a passé trois semaines à Antibes avant de dessiner un seul croquis. 'J'avais besoin de me rappeler ce que l'été ressent,' explique-t-elle. 'Le poids de la chaleur l'après-midi. Le soulagement d'une robe en lin. La façon dont votre peau a le goût du sel le soir.'"
                    },
                ],
            },
            {
                type: "media",
                sortOrder: 2,
                assetUrl: IMG.editorial8,
                translations: [
                    { locale: Locale.EN, caption: "Le Trench Aurèle, photographed at Cap Ferrat" },
                    { locale: Locale.FR, caption: "Le Trench Aurèle, photographié au Cap Ferrat" },
                ],
            },
        ],
        featuredProducts: [
            { productId: "prod-trench-aurele", note: "The collection hero", sortOrder: 1 },
            { productId: "prod-pantalon-fluide", note: "Linen for summer", sortOrder: 2 },
            { productId: "prod-cabas-parisien", note: "Beach to dinner", sortOrder: 3 },
        ],
    },

    // ═══════════════════════════════════════════════════════════════
    // THE ART OF BESPOKE
    // ═══════════════════════════════════════════════════════════════
    {
        id: "edit-bespoke",
        slug: "the-art-of-bespoke",
        category: EditorialCategory.JOURNAL,
        publishedAt: new Date("2025-08-01"),
        status: ProductStatus.ACTIVE,
        heroAssetUrl: IMG.editorial3,
        translations: [
            {
                locale: Locale.EN,
                title: "The Art of Bespoke",
                standfirst: "Personalization at Maison Aurèle goes beyond monograms. We spoke with our clients—and our craftsmen—about what made-to-measure truly means.",
                seoTitle: "Bespoke Services | Maison Aurèle Personalization",
                seoDescription: "Discover Maison Aurèle bespoke services. From monograms to made-to-measure, explore our personalization options.",
            },
            {
                locale: Locale.FR,
                title: "L'Art du Sur-Mesure",
                standfirst: "La personnalisation chez Maison Aurèle va au-delà des monogrammes. Nous avons parlé avec nos clientes—et nos artisans—de ce que le sur-mesure signifie vraiment.",
                seoTitle: "Services Sur-Mesure | Personnalisation Maison Aurèle",
                seoDescription: "Découvrez les services sur-mesure Maison Aurèle.",
            },
        ],
        blocks: [
            {
                type: "text",
                sortOrder: 1,
                translations: [
                    {
                        locale: Locale.EN,
                        headline: "Beyond the Monogram",
                        body: "When most luxury houses say 'personalization,' they mean initials on a bag. We mean something more: the choice of lining color on a coat, the adjustment of a sleeve length by centimeters, the option to remove a detail or add one. 'Our clients know what they want,' says our head of client services. 'Our job is to listen, then execute perfectly.'"
                    },
                    {
                        locale: Locale.FR,
                        headline: "Au-Delà du Monogramme",
                        body: "Quand la plupart des maisons de luxe disent 'personnalisation', elles veulent dire des initiales sur un sac. Nous voulons dire quelque chose de plus: le choix de la couleur de la doublure d'un manteau, l'ajustement d'une longueur de manche au centimètre près, l'option de retirer un détail ou d'en ajouter un."
                    },
                ],
            },
            {
                type: "quote",
                sortOrder: 2,
                translations: [
                    {
                        locale: Locale.EN,
                        headline: "\"The best personalization is invisible. It's when the garment feels like it was always yours.\"",
                        body: "— Client Services Director"
                    },
                    {
                        locale: Locale.FR,
                        headline: "\"La meilleure personnalisation est invisible. C'est quand le vêtement semble avoir toujours été le vôtre.\"",
                        body: "— Directrice du Service Client"
                    },
                ],
            },
        ],
        featuredProducts: [
            { productId: "prod-sac-aurele", note: "Monogram available", sortOrder: 1 },
            { productId: "prod-chemisier-aurore", note: "Initials on cuff", sortOrder: 2 },
        ],
    },
];

export default editorialPosts;
