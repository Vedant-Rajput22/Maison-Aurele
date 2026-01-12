"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Navigation, Clock, Phone, Mail, ExternalLink, ChevronDown } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

type Props = {
  locale: Locale;
};

const COPY = {
  en: {
    kicker: "Find us",
    title: "Visit our boutique",
    flagship: {
      name: "Paris Flagship",
      address: "31 Rue du Faubourg Saint-Honoré",
      city: "75008 Paris, France",
      hours: [
        { days: "Tuesday - Friday", time: "11:00 — 19:30" },
        { days: "Saturday", time: "10:00 — 20:00" },
        { days: "Sunday - Monday", time: "Closed" },
      ],
      phone: "+33 (0)1 86 95 24 01",
      email: "boutique@maison-aurele.fr",
    },
    getDirections: "Get directions",
    callBoutique: "Call boutique",
    privateAppointment: "Private appointment",
    appointmentNote: "Available outside regular hours",
    nearbyTitle: "Nearby landmarks",
    nearby: [
      "Élysée Palace — 2 min walk",
      "Place de la Concorde — 8 min walk",
      "Champs-Élysées — 5 min walk",
    ],
    transport: "Getting here",
    transportOptions: [
      { type: "Metro", details: "Concorde (Lines 1, 8, 12) or Madeleine (Lines 8, 12, 14)" },
      { type: "Parking", details: "Parking Bergson, 24 Rue Royale" },
    ],
  },
  fr: {
    kicker: "Nous trouver",
    title: "Visitez notre boutique",
    flagship: {
      name: "Boutique Paris",
      address: "31 Rue du Faubourg Saint-Honoré",
      city: "75008 Paris, France",
      hours: [
        { days: "Mardi - Vendredi", time: "11h00 — 19h30" },
        { days: "Samedi", time: "10h00 — 20h00" },
        { days: "Dimanche - Lundi", time: "Fermé" },
      ],
      phone: "+33 (0)1 86 95 24 01",
      email: "boutique@maison-aurele.fr",
    },
    getDirections: "Itinéraire",
    callBoutique: "Appeler",
    privateAppointment: "Rendez-vous privé",
    appointmentNote: "Disponible en dehors des heures régulières",
    nearbyTitle: "À proximité",
    nearby: [
      "Palais de l'Élysée — 2 min à pied",
      "Place de la Concorde — 8 min à pied",
      "Champs-Élysées — 5 min à pied",
    ],
    transport: "Comment venir",
    transportOptions: [
      { type: "Métro", details: "Concorde (Lignes 1, 8, 12) ou Madeleine (Lignes 8, 12, 14)" },
      { type: "Parking", details: "Parking Bergson, 24 Rue Royale" },
    ],
  },
} as const;

export function BoutiqueLocation({ locale }: Props) {
  const copy = COPY[locale] || COPY.en;
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <ScrollReveal>
      <section className="relative overflow-hidden bg-white py-32">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(247,242,234,0.5),transparent_60%)]" />

        <div className="relative mx-auto max-w-screen-2xl px-6 md:px-12">
          {/* Header */}
          <div className="mb-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-[0.6rem] uppercase tracking-[0.6em] text-ink/40">
                {copy.kicker}
              </span>
              <h2 className="mt-4 font-display text-4xl md:text-5xl">{copy.title}</h2>
            </motion.div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
            {/* Left: Info card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {/* Main info card */}
              <div className="rounded-[2.5rem] border border-ink/8 bg-gradient-to-br from-[var(--parchment)]/50 to-white p-8 shadow-[0_30px_80px_rgba(16,10,8,0.08)]">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-display text-2xl">{copy.flagship.name}</p>
                    <div className="mt-2 flex items-center gap-2 text-ink/60">
                      <MapPin size={14} />
                      <span className="text-sm">{copy.flagship.address}</span>
                    </div>
                    <p className="ml-5 text-sm text-ink/60">{copy.flagship.city}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--gilded-rose)]/10">
                    <MapPin size={20} className="text-[var(--gilded-rose)]" />
                  </div>
                </div>

                {/* Hours */}
                <div className="mt-8 space-y-3 border-t border-ink/10 pt-6">
                  <div className="flex items-center gap-2 text-ink/50">
                    <Clock size={14} />
                    <span className="text-[0.6rem] uppercase tracking-[0.4em]">Hours</span>
                  </div>
                  {copy.flagship.hours.map((hour, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-ink/60">{hour.days}</span>
                      <span className={hour.time === "Closed" || hour.time === "Fermé" ? "text-ink/40" : "text-ink"}>
                        {hour.time}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Contact */}
                <div className="mt-8 grid gap-4 border-t border-ink/10 pt-6 sm:grid-cols-2">
                  <a
                    href={`tel:${copy.flagship.phone.replace(/\s/g, "")}`}
                    className="flex items-center gap-3 rounded-xl border border-ink/10 px-4 py-3 transition hover:border-ink/20 hover:bg-ink/5"
                  >
                    <Phone size={16} className="text-ink/50" />
                    <span className="text-sm">{copy.flagship.phone}</span>
                  </a>
                  <a
                    href={`mailto:${copy.flagship.email}`}
                    className="flex items-center gap-3 rounded-xl border border-ink/10 px-4 py-3 transition hover:border-ink/20 hover:bg-ink/5"
                  >
                    <Mail size={16} className="text-ink/50" />
                    <span className="text-sm">{copy.flagship.email}</span>
                  </a>
                </div>

                {/* Actions */}
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <a
                    href="https://maps.google.com/?q=31+Rue+du+Faubourg+Saint-Honoré,+Paris"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-4 text-xs uppercase tracking-[0.3em] text-white transition hover:bg-ink/90"
                  >
                    <Navigation size={14} />
                    {copy.getDirections}
                    <ExternalLink size={12} className="opacity-50" />
                  </a>
                  <a
                    href={`/${locale}/appointments`}
                    className="flex items-center justify-center gap-2 rounded-full border border-ink/20 px-6 py-4 text-xs uppercase tracking-[0.3em] text-ink transition hover:bg-ink/5"
                  >
                    {copy.privateAppointment}
                  </a>
                </div>

                <p className="mt-4 text-center text-[0.6rem] uppercase tracking-[0.4em] text-ink/40">
                  {copy.appointmentNote}
                </p>
              </div>

              {/* Expandable sections */}
              <div className="space-y-3">
                {/* Nearby */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="rounded-2xl border border-ink/8 bg-white overflow-hidden"
                >
                  <button
                    onClick={() => toggleSection("nearby")}
                    className="flex w-full items-center justify-between px-6 py-4 text-left transition hover:bg-ink/5"
                  >
                    <span className="font-display text-lg">{copy.nearbyTitle}</span>
                    <ChevronDown
                      size={18}
                      className={`text-ink/40 transition-transform ${
                        expandedSection === "nearby" ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {expandedSection === "nearby" && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-2 border-t border-ink/10 px-6 pb-4 pt-3">
                          {copy.nearby.map((item, index) => (
                            <p key={index} className="text-sm text-ink/60">{item}</p>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Transport */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="rounded-2xl border border-ink/8 bg-white overflow-hidden"
                >
                  <button
                    onClick={() => toggleSection("transport")}
                    className="flex w-full items-center justify-between px-6 py-4 text-left transition hover:bg-ink/5"
                  >
                    <span className="font-display text-lg">{copy.transport}</span>
                    <ChevronDown
                      size={18}
                      className={`text-ink/40 transition-transform ${
                        expandedSection === "transport" ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {expandedSection === "transport" && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-3 border-t border-ink/10 px-6 pb-4 pt-3">
                          {copy.transportOptions.map((option, index) => (
                            <div key={index}>
                              <p className="text-[0.6rem] uppercase tracking-[0.4em] text-ink/40">{option.type}</p>
                              <p className="mt-1 text-sm text-ink/60">{option.details}</p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            </motion.div>

            {/* Right: Map */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-[4/3] overflow-hidden rounded-[2.5rem] border border-ink/8 bg-[var(--parchment)] shadow-[0_30px_80px_rgba(16,10,8,0.08)] lg:aspect-auto lg:min-h-[600px]"
            >
              {/* Placeholder map */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.2158746582397!2d2.3164!3d48.8698!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66fc45c1a1a1b%3A0x1!2s31%20Rue%20du%20Faubourg%20Saint-Honor%C3%A9%2C%2075008%20Paris!5e0!3m2!1sen!2sfr!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "grayscale(100%) contrast(1.1)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Boutique Location"
              />

              {/* Map overlay with pin */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col items-center"
                >
                  <div className="rounded-full bg-[var(--gilded-rose)] p-3 shadow-lg">
                    <MapPin size={24} className="text-white" />
                  </div>
                  <div className="mt-1 h-8 w-px bg-gradient-to-b from-[var(--gilded-rose)] to-transparent" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
