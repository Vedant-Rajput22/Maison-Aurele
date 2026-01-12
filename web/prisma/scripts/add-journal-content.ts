import "dotenv/config";
import { prisma } from "../../src/lib/prisma";
import { Locale } from "@prisma/client";

/**
 * Add Journal Content Script
 * 
 * This script adds rich body content (paragraphs) to existing editorial posts
 * without reseeding all data. It updates the bodyRichText field in translations.
 */

// Rich text content for each journal post
const JOURNAL_CONTENT: Record<string, { en: string[]; fr: string[] }> = {
    "les-mains-de-latelier": {
        en: [
            "In the quiet hours before dawn, when the streets of Paris are still wrapped in shadow, the atelier of Maison Aurèle comes alive. The soft glow from workshop windows on the rue du Faubourg Saint-Honoré signals the beginning of another day of creation.",
            "Marguerite, our première d'atelier, has been with us since 1987. Her hands have shaped thousands of garments, each stitch a testament to decades of devotion to the craft. 'I don't count the years,' she says, her needle moving with practiced precision. 'I count the stitches. And there are always more stitches to make.'",
            "The apprenticeship at Maison Aurèle takes seven years—not because we measure time, but because excellence takes the time it takes. Each new artisan sits beside a master for five years before they touch a client garment. This is not training; this is cultivation.",
            "In an age of instant everything, we choose the slow path. We choose the human hand over the mechanical arm. We choose imperfection that speaks of humanity over perfection that speaks of nothing at all.",
            "The maison is not merely a place where clothes are made. It is a sanctuary where traditions are kept, where knowledge passes from hand to hand, where the art of making beautiful things remains sacred.",
        ],
        fr: [
            "Dans les heures calmes avant l'aube, quand les rues de Paris sont encore enveloppées d'ombre, l'atelier de la Maison Aurèle s'éveille. La douce lueur des fenêtres de l'atelier rue du Faubourg Saint-Honoré marque le début d'une nouvelle journée de création.",
            "Marguerite, notre première d'atelier, est avec nous depuis 1987. Ses mains ont façonné des milliers de vêtements, chaque point un témoignage de décennies de dévouement au métier. 'Je ne compte pas les années,' dit-elle, son aiguille se mouvant avec une précision exercée. 'Je compte les points. Et il y a toujours plus de points à faire.'",
            "L'apprentissage chez Maison Aurèle dure sept ans—non pas parce que nous mesurons le temps, mais parce que l'excellence prend le temps qu'il faut. Chaque nouvel artisan s'assoit à côté d'un maître pendant cinq ans avant de toucher un vêtement client. Ce n'est pas de la formation; c'est de la cultivation.",
            "À une époque où tout est instantané, nous choisissons le chemin lent. Nous choisissons la main humaine plutôt que le bras mécanique. Nous choisissons l'imperfection qui parle d'humanité plutôt que la perfection qui ne dit rien du tout.",
            "La maison n'est pas simplement un lieu où l'on fabrique des vêtements. C'est un sanctuaire où les traditions sont préservées, où le savoir passe de main en main, où l'art de faire de belles choses reste sacré.",
        ],
    },
    "nuit-parisienne-the-film": {
        en: [
            "We gave director Léa Morel a simple brief: show us Paris as you see it. She chose the hours between seven in the evening and seven in the morning—twelve hours of darkness during which the city reveals its secret self.",
            "'Paris at night is not the Paris of photographs,' Morel explains from her editing suite in the Marais. 'It's a city of shadows, whispers, and women who walk with intention. I wanted to capture that energy—the feeling of being the only person awake in a city of millions.'",
            "The film follows three women through a single night: a gallery owner closing her exhibition, a writer finishing her manuscript at an all-night café, and a dancer leaving her final rehearsal. Their paths never cross, yet together they weave a portrait of nocturnal Paris.",
            "Each woman wears pieces from our Fall/Winter collection—not as costume, but as armor for the night ahead. The Manteau Nocturne appears in the opening scene, its cashmere catching the light of passing cars. The Robe Éternelle floats through the Palais Royal at midnight.",
            "Morel shot entirely on film, a deliberate choice that lends the imagery a dreamlike quality. 'Digital is too perfect,' she says. 'Film breathes. It has memory. Like the clothes themselves.'",
        ],
        fr: [
            "Nous avons donné à la réalisatrice Léa Morel un brief simple: montrez-nous Paris comme vous le voyez. Elle a choisi les heures entre dix-neuf heures et sept heures du matin—douze heures d'obscurité pendant lesquelles la ville révèle son moi secret.",
            "'Paris la nuit n'est pas le Paris des photographies,' explique Morel depuis sa salle de montage dans le Marais. 'C'est une ville d'ombres, de murmures, et de femmes qui marchent avec intention. Je voulais capturer cette énergie—le sentiment d'être la seule personne éveillée dans une ville de millions.'",
            "Le film suit trois femmes à travers une seule nuit: une galeriste fermant son exposition, une écrivaine terminant son manuscrit dans un café de nuit, et une danseuse quittant sa dernière répétition. Leurs chemins ne se croisent jamais, pourtant ensemble elles tissent un portrait du Paris nocturne.",
            "Chaque femme porte des pièces de notre collection Automne/Hiver—non comme costume, mais comme armure pour la nuit à venir. Le Manteau Nocturne apparaît dans la scène d'ouverture, son cachemire captant la lumière des voitures qui passent. La Robe Éternelle flotte à travers le Palais Royal à minuit.",
            "Morel a tourné entièrement sur pellicule, un choix délibéré qui confère aux images une qualité onirique. 'Le numérique est trop parfait,' dit-elle. 'La pellicule respire. Elle a de la mémoire. Comme les vêtements eux-mêmes.'",
        ],
    },
    "silk-from-lyon-to-you": {
        en: [
            "Lyon's silk quarter—the Croix-Rousse—was once home to thirty thousand looms. Today, fewer than one hundred remain. But in the workshops that survive, the craft continues unchanged, passed down through generations of weavers who speak of thread as others speak of wine.",
            "We visited Maison Bouton, our partner since 1978, where fourth-generation weaver Philippe Bouton showed us the Jacquard looms his great-grandfather used. The machines are old, their wooden frames worn smooth by a century of hands. But the silk they produce is eternal.",
            "'Every thread has a personality,' Philippe explains, guiding a skein of raw silk through his fingers. 'This one wants to be folded. This one wants to flow. You must listen to what the material tells you.'",
            "Our journey began at dawn in a mulberry grove outside the city, where silkworms spin their cocoons in the same rhythm they have for millennia. From there to the reeling house, where the silk is unwound—a process so delicate it requires complete silence.",
            "When the final bolt of silk arrives at our atelier in Paris, it carries with it the memory of every hand that touched it. This is what we mean by provenance. Not a certificate, but a story woven into every fiber.",
        ],
        fr: [
            "Le quartier de la soie de Lyon—la Croix-Rousse—abritait autrefois trente mille métiers. Aujourd'hui, moins de cent subsistent. Mais dans les ateliers qui survivent, le métier continue inchangé, transmis de génération en génération de tisseurs qui parlent du fil comme d'autres parlent du vin.",
            "Nous avons visité la Maison Bouton, notre partenaire depuis 1978, où le tisseur de quatrième génération Philippe Bouton nous a montré les métiers Jacquard que son arrière-grand-père utilisait. Les machines sont anciennes, leurs cadres de bois polis par un siècle de mains. Mais la soie qu'elles produisent est éternelle.",
            "'Chaque fil a une personnalité,' explique Philippe, guidant un écheveau de soie brute entre ses doigts. 'Celui-ci veut être plié. Celui-là veut couler. Il faut écouter ce que la matière vous dit.'",
            "Notre voyage a commencé à l'aube dans un bosquet de mûriers en périphérie de la ville, où les vers à soie filent leurs cocons au même rythme depuis des millénaires. De là à la filature, où la soie est dévidée—un processus si délicat qu'il requiert un silence complet.",
            "Quand la dernière pièce de soie arrive à notre atelier à Paris, elle porte avec elle la mémoire de chaque main qui l'a touchée. C'est ce que nous entendons par provenance. Non pas un certificat, mais une histoire tissée dans chaque fibre.",
        ],
    },
    "heritage-1962-2025": {
        en: [
            "In 1962, Aurèle Montfort opened her first atelier in a two-room apartment above a café on the rue de Sèvres. She had three sewing machines, no clients, and an unshakeable conviction: that French women deserved clothes that lasted.",
            "Her first collection—twelve pieces in black and camel—sold out in a week. 'I didn't design fashion,' she would later say. 'I designed permanence.'",
            "The decades that followed saw the maison grow from that modest atelier to a workshop on the Faubourg Saint-Honoré, but certain principles never changed. Quality over quantity. Craft over speed. The human hand over the machine.",
            "When Aurèle retired in 1998, she left behind not just a collection of patterns and techniques, but a philosophy. 'Make clothes that women will want to keep,' she wrote in her final letter to the atelier. 'Make clothes that their daughters will want to inherit.'",
            "Today, as we navigate the complexities of modern fashion, we return again and again to those founding principles. In an industry obsessed with the new, we choose to invest in the eternal. In a world of disposable everything, we make clothes that last.",
        ],
        fr: [
            "En 1962, Aurèle Montfort ouvre son premier atelier dans un appartement de deux pièces au-dessus d'un café rue de Sèvres. Elle avait trois machines à coudre, pas de clientes, et une conviction inébranlable: que les femmes françaises méritaient des vêtements qui durent.",
            "Sa première collection—douze pièces en noir et camel—a été épuisée en une semaine. 'Je n'ai pas dessiné de la mode,' dirait-elle plus tard. 'J'ai dessiné de la permanence.'",
            "Les décennies qui ont suivi ont vu la maison grandir de ce modeste atelier à un workshop rue du Faubourg Saint-Honoré, mais certains principes n'ont jamais changé. La qualité avant la quantité. Le métier avant la vitesse. La main humaine avant la machine.",
            "Quand Aurèle a pris sa retraite en 1998, elle a laissé derrière elle non seulement une collection de patrons et de techniques, mais une philosophie. 'Faites des vêtements que les femmes voudront garder,' a-t-elle écrit dans sa dernière lettre à l'atelier. 'Faites des vêtements que leurs filles voudront hériter.'",
            "Aujourd'hui, alors que nous naviguons les complexités de la mode moderne, nous revenons encore et encore à ces principes fondateurs. Dans une industrie obsédée par le nouveau, nous choisissons d'investir dans l'éternel. Dans un monde où tout est jetable, nous faisons des vêtements qui durent.",
        ],
    },
    "summer-on-the-riviera": {
        en: [
            "Our creative director spent three weeks in Antibes before drawing a single sketch. 'I needed to remember what summer feels like,' she explains. 'The weight of heat in the afternoon. The relief of a linen dress. The way your skin tastes like salt by evening.'",
            "The collection that emerged is our lightest yet—linens from Normandy, silks from Lyon, and a palette borrowed from the sea itself. Azure. Sand. The pink of bougainvillea at dusk.",
            "Each piece was designed with a specific moment in mind: the morning walk to the market, the long lunch in the shade, the evening aperitif as the sun sinks toward the horizon. Clothes for living, not for looking.",
            "We photographed the collection at Cap Ferrat, in a villa that hasn't changed since the 1960s. The models wore minimal makeup and no shoes. We wanted to capture not fashion, but a feeling—the particular lightness that comes from days spent near the water.",
            "The Côte d'Azur collection isn't about escape. It's about arrival—at the life you've been working toward, the vacation you've earned, the version of yourself that exists only in summer.",
        ],
        fr: [
            "Notre directrice de création a passé trois semaines à Antibes avant de dessiner un seul croquis. 'J'avais besoin de me rappeler ce que l'été ressent,' explique-t-elle. 'Le poids de la chaleur l'après-midi. Le soulagement d'une robe en lin. La façon dont votre peau a le goût du sel le soir.'",
            "La collection qui en a résulté est notre plus légère à ce jour—des lins de Normandie, des soies de Lyon, et une palette empruntée à la mer elle-même. Azur. Sable. Le rose des bougainvilliers au crépuscule.",
            "Chaque pièce a été conçue avec un moment précis en tête: la promenade matinale au marché, le long déjeuner à l'ombre, l'apéritif du soir quand le soleil descend vers l'horizon. Des vêtements pour vivre, pas pour paraître.",
            "Nous avons photographié la collection au Cap Ferrat, dans une villa qui n'a pas changé depuis les années 1960. Les mannequins portaient un maquillage minimal et pas de chaussures. Nous voulions capturer non pas la mode, mais un sentiment—cette légèreté particulière qui vient des jours passés près de l'eau.",
            "La collection Côte d'Azur n'est pas une question d'évasion. C'est une question d'arrivée—à la vie vers laquelle vous avez travaillé, aux vacances que vous avez méritées, à la version de vous-même qui n'existe qu'en été.",
        ],
    },
    "the-art-of-bespoke": {
        en: [
            "When most luxury houses say 'personalization,' they mean initials on a bag. We mean something more: the choice of lining color on a coat, the adjustment of a sleeve length by centimeters, the option to remove a detail or add one.",
            "True bespoke begins with a conversation. Our client advisors spend hours understanding not just measurements, but lifestyles. Where do you work? How do you travel? What makes you feel powerful?",
            "From there, we create what we call a 'silhouette profile'—a document that lives with us as long as you remain a client. It evolves as you evolve, capturing preferences that go beyond size to encompass proportion, posture, and personality.",
            "The fitting process is sacred. Three appointments, each building on the last. The first establishes structure. The second refines movement. The third ensures perfection. We've been known to remake a garment entirely if the third fitting reveals something off.",
            "'The best personalization is invisible,' says our head of client services. 'It's when the garment feels like it was always yours—like it couldn't have been made for anyone else.'",
        ],
        fr: [
            "Quand la plupart des maisons de luxe disent 'personnalisation', elles veulent dire des initiales sur un sac. Nous voulons dire quelque chose de plus: le choix de la couleur de la doublure d'un manteau, l'ajustement d'une longueur de manche au centimètre près, l'option de retirer un détail ou d'en ajouter un.",
            "Le vrai sur-mesure commence par une conversation. Nos conseillers clients passent des heures à comprendre non seulement les mesures, mais les styles de vie. Où travaillez-vous? Comment voyagez-vous? Qu'est-ce qui vous fait vous sentir puissante?",
            "De là, nous créons ce que nous appelons un 'profil silhouette'—un document qui vit avec nous aussi longtemps que vous restez cliente. Il évolue comme vous évoluez, capturant des préférences qui vont au-delà de la taille pour englober la proportion, la posture et la personnalité.",
            "Le processus d'essayage est sacré. Trois rendez-vous, chacun construisant sur le précédent. Le premier établit la structure. Le deuxième affine le mouvement. Le troisième assure la perfection. Nous avons été connus pour refaire entièrement un vêtement si le troisième essayage révèle quelque chose qui ne va pas.",
            "'La meilleure personnalisation est invisible,' dit notre directrice du service client. 'C'est quand le vêtement semble avoir toujours été le vôtre—comme s'il n'avait pu être fait pour personne d'autre.'",
        ],
    },
};

function toRichText(paragraphs: string[]): object[] {
    return paragraphs.map((text) => ({
        type: "paragraph",
        children: [{ text }],
    }));
}

async function main() {
    console.log("📝 Adding content to journal posts...\n");

    for (const [slug, content] of Object.entries(JOURNAL_CONTENT)) {
        const post = await prisma.editorialPost.findUnique({
            where: { slug },
            include: { translations: true },
        });

        if (!post) {
            console.log(`⚠️  Post not found: ${slug}`);
            continue;
        }

        // Update EN translation
        const enTranslation = post.translations.find((t) => t.locale === Locale.EN);
        if (enTranslation) {
            await prisma.editorialTranslation.update({
                where: { id: enTranslation.id },
                data: {
                    bodyRichText: toRichText(content.en),
                },
            });
            console.log(`✅ Updated EN content for: ${slug}`);
        }

        // Update FR translation
        const frTranslation = post.translations.find((t) => t.locale === Locale.FR);
        if (frTranslation) {
            await prisma.editorialTranslation.update({
                where: { id: frTranslation.id },
                data: {
                    bodyRichText: toRichText(content.fr),
                },
            });
            console.log(`✅ Updated FR content for: ${slug}`);
        }
    }

    console.log("\n✨ Journal content added successfully!");
}

main()
    .catch((err) => {
        console.error("❌ Update failed:", err);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
