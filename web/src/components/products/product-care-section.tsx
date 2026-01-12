"use client";

import { motion } from "framer-motion";
import { Shield, Droplets, Wind, Sparkles, Sun, Package } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

type Props = {
  locale: Locale;
  careInstructions: unknown;
  originCountry?: string | null;
};

const COPY = {
  en: {
    care: "Care & material",
    origin: "Origin",
    certificate: "Certificate of authenticity",
    crafted: "Crafted in",
    parisianAtelier: "Parisian atelier",
    careTitle: "Preserve the beauty",
    careSubtitle: "Expert care recommendations to maintain your piece for generations.",
    defaultCare: [
      "Store in the provided dust bag when not in use",
      "Avoid direct sunlight and extreme temperatures",
      "Clean gently with a soft, dry cloth",
      "Professional cleaning recommended for stubborn marks",
    ],
    authenticityDesc: "Each piece is accompanied by a certificate of authenticity, ensuring its provenance and craftsmanship heritage.",
  },
  fr: {
    care: "Soin & matière",
    origin: "Origine",
    certificate: "Certificat d'authenticité",
    crafted: "Fabriqué en",
    parisianAtelier: "atelier parisien",
    careTitle: "Préserver la beauté",
    careSubtitle: "Recommandations d'entretien expert pour maintenir votre pièce pour les générations.",
    defaultCare: [
      "Rangez dans le sac à poussière fourni lorsque vous ne l'utilisez pas",
      "Évitez la lumière directe du soleil et les températures extrêmes",
      "Nettoyez délicatement avec un chiffon doux et sec",
      "Nettoyage professionnel recommandé pour les marques tenaces",
    ],
    authenticityDesc: "Chaque pièce est accompagnée d'un certificat d'authenticité, garantissant sa provenance et son héritage artisanal.",
  },
  ar: {
    care: "العناية والمواد",
    origin: "الأصل",
    certificate: "شهادة الأصالة",
    crafted: "صُنع في",
    parisianAtelier: "أتيليه باريس",
    careTitle: "الحفاظ على الجمال",
    careSubtitle: "توصيات العناية الخبيرة للحفاظ على قطعتك للأجيال.",
    defaultCare: [
      "احفظها في الحقيبة المقدمة عند عدم الاستخدام",
      "تجنب أشعة الشمس المباشرة ودرجات الحرارة القصوى",
      "نظفها برفق بقطعة قماش ناعمة وجافة",
      "يُنصح بالتنظيف المهني للبقع الصعبة",
    ],
    authenticityDesc: "كل قطعة مصحوبة بشهادة أصالة، تضمن مصدرها وتراثها الحرفي.",
  },
} as const;

const CARE_ICONS = [
  { icon: Droplets, label: "Moisture protection" },
  { icon: Sun, label: "UV protection" },
  { icon: Wind, label: "Proper ventilation" },
  { icon: Package, label: "Secure storage" },
];

function parseCareInstructions(care: unknown, defaultSteps: string[]): string[] {
  if (!care) return defaultSteps;

  if (Array.isArray(care)) {
    return care.length > 0 ? care as string[] : defaultSteps;
  }

  if (typeof care === "string") {
    return care.trim() ? [care] : defaultSteps;
  }

  if (typeof care === "object" && care !== null && "steps" in care) {
    const obj = care as { steps?: unknown };
    if (Array.isArray(obj.steps)) {
      return obj.steps.length > 0 ? obj.steps as string[] : defaultSteps;
    }
  }

  return defaultSteps;
}

export function ProductCareSection({ locale, careInstructions, originCountry }: Props) {
  const copy = COPY[locale] || COPY.en;
  const steps = parseCareInstructions(careInstructions, [...copy.defaultCare]);

  return (
    <ScrollReveal>
      <section className="relative overflow-hidden border-t border-ink/10 bg-[var(--parchment)]">
        {/* Decorative background */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,255,255,0.9),transparent_60%)]" />

        <div className="relative mx-auto max-w-screen-2xl px-6 py-20 md:px-12">
          <div className="grid gap-10 rounded-[2.5rem] border border-ink/8 bg-white/90 p-10 shadow-[0_40px_120px_rgba(16,10,8,0.1)] backdrop-blur-sm md:grid-cols-[0.55fr_0.45fr]">
            {/* Left: Care instructions */}
            <div className="space-y-8">
              <div>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-[0.6rem] uppercase tracking-[0.6em] text-ink/50"
                >
                  {copy.care}
                </motion.p>
                <motion.h2
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="mt-2 font-display text-2xl"
                >
                  {copy.careTitle}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="mt-2 text-sm text-ink/60"
                >
                  {copy.careSubtitle}
                </motion.p>
              </div>

              {/* Care steps */}
              <ul className="space-y-4">
                {steps.map((step, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + idx * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-amber-200 text-xs font-medium text-amber-800">
                      {idx + 1}
                    </div>
                    <p className="pt-0.5 text-sm leading-relaxed text-ink/75">{step}</p>
                  </motion.li>
                ))}
              </ul>

              {/* Care icons row */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-4 pt-4"
              >
                {CARE_ICONS.map(({ icon: Icon, label }, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-2 shadow-sm"
                  >
                    <Icon size={14} className="text-ink/50" />
                    <span className="text-[0.6rem] uppercase tracking-wider text-ink/60">{label}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: Origin & Certificate */}
            <div className="space-y-6 border-t border-ink/10 pt-8 md:border-l md:border-t-0 md:pl-10 md:pt-0">
              {/* Origin */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <p className="text-[0.6rem] uppercase tracking-[0.6em] text-ink/50">{copy.origin}</p>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-100 via-amber-200 to-amber-300 shadow-inner" />
                  <div>
                    <p className="text-[0.55rem] uppercase tracking-[0.4em] text-ink/40">{copy.crafted}</p>
                    <p className="font-display text-lg">
                      {originCountry ?? copy.parisianAtelier}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Certificate */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="rounded-[1.5rem] border border-ink/10 bg-gradient-to-br from-[var(--parchment)] to-white p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-ink/10 bg-white">
                    <Shield size={20} className="text-ink/60" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[0.6rem] uppercase tracking-[0.5em] text-ink/50">
                      {copy.certificate}
                    </p>
                    <p className="text-sm leading-relaxed text-ink/70">{copy.authenticityDesc}</p>
                  </div>
                </div>

                {/* Certificate visual */}
                <div className="mt-6 flex items-center gap-3">
                  <Sparkles size={14} className="text-amber-500" />
                  <div className="h-px flex-1 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200" />
                  <Sparkles size={14} className="text-amber-500" />
                </div>
              </motion.div>

              {/* Heritage seal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-center"
              >
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-dashed border-ink/15 bg-white/50">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-ink/10 bg-white shadow-inner">
                    <span className="text-center font-display text-[0.5rem] uppercase leading-tight tracking-wider text-ink/60">
                      Maison
                      <br />
                      Aurèle
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
