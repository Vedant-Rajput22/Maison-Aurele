import type { Locale } from "@/lib/i18n/config";
import { MaisonHero } from "@/components/maison/maison-hero";
import { MaisonAtelierTriptych } from "@/components/maison/maison-atelier-triptych";
import { MaisonTimeline } from "@/components/maison/maison-timeline";
import { MaisonPartners } from "@/components/maison/maison-partners";
import { MaisonCTA } from "@/components/maison/maison-cta";

type LocaleParams = { locale: Locale } | Promise<{ locale: Locale }>;

// Data for the timeline component
const timeline = [
  {
    year: "1962",
    titleFr: "Atelier Faubourg",
    titleEn: "Faubourg atelier",
    bodyFr:
      "Naissance de la maison dans le 8e arrondissement, entourée de lainiers et brodeurs historiques.",
    bodyEn:
      "The house is born in the 8th arrondissement amid historic wool and embroidery masters.",
  },
  {
    year: "1978",
    titleFr: "Première collection",
    titleEn: "First collection",
    bodyFr:
      "Présentation de la première collection haute couture au Palais de Tokyo.",
    bodyEn:
      "First haute couture collection presented at Palais de Tokyo.",
  },
  {
    year: "1984",
    titleFr: "Salon rive gauche",
    titleEn: "Left bank salon",
    bodyFr: "Un salon privé ouvre la nuit pour des essayages confidentiels.",
    bodyEn: "A private salon opens for discreet night fittings.",
  },
  {
    year: "2010",
    titleFr: "Expansion mondiale",
    titleEn: "Global expansion",
    bodyFr:
      "Ouverture des ateliers de Lyon et Como, partenariats avec Lesage.",
    bodyEn:
      "Lyon and Como ateliers open, partnership with Maison Lesage established.",
  },
  {
    year: "2024",
    titleFr: "Couture numérique",
    titleEn: "Digital couture",
    bodyFr:
      "Certificats augmentés, narration immersive et livraison gants blancs dans le monde entier.",
    bodyEn:
      "Augmented certificates, immersive storytelling, and white-glove delivery worldwide.",
  },
];

// Data for the atelier chapters
const atelierChapters = [
  {
    id: "paris",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80",
    titleFr: "Paris — Faubourg",
    titleEn: "Paris — Faubourg",
    bodyFr:
      "Ligne directrice couture, moulages nocturnes et commandes sur-mesure dans notre atelier historique du 8e arrondissement.",
    bodyEn: "Couture art direction, night moulages, and bespoke commissions in our historic 8th arrondissement atelier.",
    detailsFr: [
      "Toiles et prototypes",
      "Broderie à la main",
      "Finitions haute couture",
    ],
    detailsEn: [
      "Canvas & prototyping",
      "Hand embroidery",
      "Haute couture finishes",
    ],
  },
  {
    id: "riviera",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80",
    titleFr: "Riviera — Atelier verrier",
    titleEn: "Riviera — Glass atelier",
    bodyFr:
      "Organza pressé sur plaques miroir, palettes écumées et broderies argent dans la lumière méditerranéenne.",
    bodyEn: "Organza pressed on mirrored plates, foamed palettes, silverwork bathed in Mediterranean light.",
    detailsFr: [
      "Travail du verre et cristal",
      "Techniques d'argenture",
      "Teintures naturelles",
    ],
    detailsEn: [
      "Glass & crystal work",
      "Silvering techniques",
      "Natural dyeing",
    ],
  },
  {
    id: "digital",
    image:
      "https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=1200&q=80",
    titleFr: "Studio numérique",
    titleEn: "Digital studio",
    bodyFr: "Certificats NFT, cartes sonores et modules immersifs pour une expérience e-commerce sans précédent.",
    bodyEn: "NFT certificates, sound maps, and immersive modules for an unprecedented e-commerce experience.",
    detailsFr: [
      "Authentification blockchain",
      "Expériences AR/VR",
      "Design sonore sur mesure",
    ],
    detailsEn: [
      "Blockchain authentication",
      "AR/VR experiences",
      "Bespoke sound design",
    ],
  },
];

// Stats for the timeline section
const stats = [
  { labelFr: "Ateliers partenaires", labelEn: "Partner ateliers", value: "12" },
  { labelFr: "Heures par pièce", labelEn: "Hours per piece", value: "360+" },
  { labelFr: "Routes gants blancs", labelEn: "White-glove routes", value: "18" },
  { labelFr: "Années d'héritage", labelEn: "Years of heritage", value: "62" },
];

export default async function MaisonPage({
  params,
}: {
  params: LocaleParams;
}) {
  const resolved = await params;
  const locale = resolved.locale;

  return (
    <main className="overflow-x-hidden">
      {/* Cinematic Hero with Video Background */}
      <MaisonHero locale={locale} />
      
      {/* Atelier Triptych - Three Chapters */}
      <MaisonAtelierTriptych locale={locale} chapters={atelierChapters} />
      
      {/* Heritage Timeline */}
      <MaisonTimeline locale={locale} timeline={timeline} stats={stats} />
      
      {/* Partner Ateliers */}
      <MaisonPartners locale={locale} />
      
      {/* CTA Section */}
      <MaisonCTA locale={locale} />
    </main>
  );
}
