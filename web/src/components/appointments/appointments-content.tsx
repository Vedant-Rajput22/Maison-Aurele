"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Sparkles } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";

const APPOINTMENT_VIDEO = {
  webm: "/assets/media/appointments-champagne-loop.webm",
  mp4: "/assets/media/appointments-champagne-loop.mp4",
};

const COPY = {
  en: {
    kicker: "By invitation",
    title: "Private appointment",
    subtitle: "Experience the essence of Maison Aurèle in an intimate setting tailored to your desires.",
    note: "We confirm every appointment with a detailed map, material heritage report, and personalization options.",
    submit: "Request appointment",
    services: {
      title: "Concierge services",
      items: [
        { icon: MapPin, label: "Faubourg salon visit" },
        { icon: Calendar, label: "Virtual consultation" },
        { icon: Sparkles, label: "Bespoke fitting" },
        { icon: Clock, label: "After-hours preview" },
      ],
    },
    form: {
      name: "Full name",
      email: "Email address",
      phone: "Phone (optional)",
      preferences: "Share your preferences: salon, virtual, silhouettes of interest...",
      date: "Preferred date",
    },
  },
  fr: {
    kicker: "Sur invitation",
    title: "Rendez-vous privé",
    subtitle: "Vivez l'essence de la Maison Aurèle dans un cadre intime, façonné selon vos désirs.",
    note: "Nous confirmons chaque rendez-vous avec un plan détaillé, l'héritage des matières et les options de personnalisation.",
    submit: "Demander un rendez-vous",
    services: {
      title: "Services de conciergerie",
      items: [
        { icon: MapPin, label: "Visite au salon du Faubourg" },
        { icon: Calendar, label: "Consultation virtuelle" },
        { icon: Sparkles, label: "Essayage sur mesure" },
        { icon: Clock, label: "Aperçu en soirée privée" },
      ],
    },
    form: {
      name: "Nom complet",
      email: "Adresse email",
      phone: "Téléphone (optionnel)",
      preferences: "Indiquez vos préférences : salon, virtuel, silhouettes qui vous intéressent...",
      date: "Date souhaitée",
    },
  },
} as const;

export function AppointmentsContent({ locale }: { locale: Locale }) {
  const copy = COPY[locale] || COPY.en;

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Video background */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover"
        >
          <source src={APPOINTMENT_VIDEO.webm} type="video/webm" />
          <source src={APPOINTMENT_VIDEO.mp4} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-noir/70 via-noir/50 to-noir/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 py-32 md:px-12">
        <div className="mx-auto max-w-screen-xl">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
            {/* Left: Header content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-px w-12 bg-white/30" />
                  <span className="text-[0.6rem] uppercase tracking-[0.5em] text-white/50">
                    {copy.kicker}
                  </span>
                </div>

                <h1 className="font-display text-5xl leading-[1.1] text-white md:text-6xl">
                  {copy.title}
                </h1>

                <p className="max-w-md text-lg leading-relaxed text-white/70">
                  {copy.subtitle}
                </p>
              </div>

              {/* Services grid */}
              <div className="space-y-4">
                <p className="text-[0.55rem] uppercase tracking-[0.5em] text-white/40">
                  {copy.services.title}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {copy.services.items.map((service) => (
                    <motion.div
                      key={service.label}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm"
                    >
                      <service.icon size={18} className="text-[var(--gilded-rose)]" />
                      <span className="text-xs text-white/80">{service.label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right: Form */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <form className="space-y-6 rounded-[2.5rem] border border-white/10 bg-white/5 px-8 py-10 backdrop-blur-xl">
                <div className="space-y-1">
                  <p className="text-[0.5rem] uppercase tracking-[0.5em] text-white/40">
                    {locale === "fr" ? "Formulaire de demande" : "Request form"}
                  </p>
                  <h2 className="font-display text-2xl text-white">
                    {locale === "fr" ? "Planifier votre visite" : "Schedule your visit"}
                  </h2>
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder={copy.form.name}
                    className="w-full rounded-full border border-white/10 bg-white/5 px-6 py-4 text-sm text-white placeholder-white/40 outline-none transition focus:border-white/30 focus:bg-white/10"
                  />
                  <input
                    type="email"
                    placeholder={copy.form.email}
                    className="w-full rounded-full border border-white/10 bg-white/5 px-6 py-4 text-sm text-white placeholder-white/40 outline-none transition focus:border-white/30 focus:bg-white/10"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="tel"
                      placeholder={copy.form.phone}
                      className="w-full rounded-full border border-white/10 bg-white/5 px-6 py-4 text-sm text-white placeholder-white/40 outline-none transition focus:border-white/30 focus:bg-white/10"
                    />
                    <input
                      type="date"
                      placeholder={copy.form.date}
                      className="w-full rounded-full border border-white/10 bg-white/5 px-6 py-4 text-sm text-white placeholder-white/40 outline-none transition focus:border-white/30 focus:bg-white/10"
                    />
                  </div>
                  <textarea
                    placeholder={copy.form.preferences}
                    rows={4}
                    className="w-full rounded-3xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-white placeholder-white/40 outline-none transition focus:border-white/30 focus:bg-white/10"
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full rounded-full bg-white px-8 py-4 text-xs uppercase tracking-[0.4em] text-ink transition hover:bg-white/90"
                >
                  {copy.submit}
                </motion.button>

                <p className="text-center text-[0.65rem] text-white/40">
                  {copy.note}
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="pointer-events-none fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-noir to-transparent" />
    </div>
  );
}
