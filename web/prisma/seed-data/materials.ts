/**
 * Maison Aurèle – Luxury Materials Seed Data
 * 
 * Premium materials sourced from the finest European ateliers and global origins.
 * Each material includes provenance and sustainability credentials.
 */

export interface MaterialSeedData {
  id: string;
  name: string;
  origin: string;
  sustainabilityNotes: string;
}

export const materials: MaterialSeedData[] = [
  {
    id: "mat-cashmere",
    name: "Cashmere",
    origin: "Inner Mongolia, China",
    sustainabilityNotes: "Sourced from certified nomadic herders practicing regenerative grazing. Each garment uses fiber from a single herd, ensuring full traceability. Our cashmere is certified by the Sustainable Fibre Alliance.",
  },
  {
    id: "mat-silk",
    name: "Soie de Lyon",
    origin: "Lyon, France",
    sustainabilityNotes: "Woven in Lyon's historic silk quarter by master craftsmen continuing a 500-year tradition. Our silk comes from mulberry silkworms raised without pesticides, certified Oeko-Tex Standard 100.",
  },
  {
    id: "mat-virgin-wool",
    name: "Virgin Wool",
    origin: "Biella, Italy",
    sustainabilityNotes: "Premium Merino wool sourced from certified Australian farms practicing responsible land stewardship. Spun and woven in Biella's renowned mills using zero-discharge water treatment.",
  },
  {
    id: "mat-linen",
    name: "Lin de Normandie",
    origin: "Normandy, France",
    sustainabilityNotes: "Cultivated in the temperate climate of Normandy without irrigation. European Flax® certified, naturally biodegradable. Processed using traditional retting methods that require no chemicals.",
  },
  {
    id: "mat-calais-lace",
    name: "Dentelle de Calais",
    origin: "Calais, France",
    sustainabilityNotes: "Crafted on century-old Leavers looms—the last of their kind—by third-generation artisans. Each meter requires eight hours of meticulous work. This is true French patrimoine.",
  },
  {
    id: "mat-nappa-leather",
    name: "Nappa Leather",
    origin: "Tuscany, Italy",
    sustainabilityNotes: "Full-grain calfskin from Leather Working Group Gold-rated tanneries. Vegetable-tanned using chestnut extracts, a process taking 40 days per hide. Chrome-free and fully traceable.",
  },
  {
    id: "mat-cotton-egyptian",
    name: "Coton Égyptien",
    origin: "Nile Delta, Egypt",
    sustainabilityNotes: "Extra-long staple Giza 87 cotton, hand-picked to preserve fiber integrity. Our partner farms use drip irrigation reducing water use by 60%. GOTS certified organic.",
  },
  {
    id: "mat-velvet",
    name: "Velours de Lyon",
    origin: "Lyon, France",
    sustainabilityNotes: "Silk-cotton velvet woven on Jacquard looms dating to 1850. Part of Lyon's UNESCO-recognized textile heritage. Natural dyes derived from botanical sources.",
  },
];

export default materials;
