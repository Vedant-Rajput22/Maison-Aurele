"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Phone, Calendar, MapPin, ArrowRight, Check } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

type Props = {
  locale: Locale;
};

const COPY = {
  en: {
    kicker: "Contact us",
    title: "Begin your journey",
    subtitle: "Our concierge team is at your service to assist with any inquiry",
    form: {
      name: "Full name",
      email: "Email address",
      phone: "Phone (optional)",
      interest: "I'm interested in...",
      interests: [
        "Private consultation",
        "Bespoke creation",
        "Virtual appointment",
        "Private event",
        "General inquiry",
      ],
      message: "Your message",
      submit: "Send message",
      sending: "Sending...",
      success: "Message sent successfully. We'll be in touch shortly.",
    },
    directContact: {
      title: "Direct contact",
      phone: {
        label: "Call our concierge",
        value: "+33 (0)1 86 95 24 01",
      },
      email: {
        label: "Email us",
        value: "concierge@maison-aurele.fr",
      },
    },
    appointment: {
      title: "Schedule an appointment",
      description: "Book a private consultation at our boutique",
      cta: "Book now",
    },
    note: "Response within 24 hours",
  },
  fr: {
    kicker: "Contactez-nous",
    title: "Commencez votre voyage",
    subtitle: "Notre équipe conciergerie est à votre service pour toute demande",
    form: {
      name: "Nom complet",
      email: "Adresse email",
      phone: "Téléphone (optionnel)",
      interest: "Je suis intéressé(e) par...",
      interests: [
        "Consultation privée",
        "Création sur mesure",
        "Rendez-vous virtuel",
        "Événement privé",
        "Demande générale",
      ],
      message: "Votre message",
      submit: "Envoyer le message",
      sending: "Envoi en cours...",
      success: "Message envoyé avec succès. Nous vous contacterons bientôt.",
    },
    directContact: {
      title: "Contact direct",
      phone: {
        label: "Appelez notre concierge",
        value: "+33 (0)1 86 95 24 01",
      },
      email: {
        label: "Écrivez-nous",
        value: "concierge@maison-aurele.fr",
      },
    },
    appointment: {
      title: "Prendre rendez-vous",
      description: "Réservez une consultation privée dans notre boutique",
      cta: "Réserver",
    },
    note: "Réponse sous 24 heures",
  },
} as const;

export function BoutiqueContact({ locale }: Props) {
  const copy = COPY[locale] || COPY.en;
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    interest: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    setFormState({ name: "", email: "", phone: "", interest: "", message: "" });
    
    // Reset success message after delay
    setTimeout(() => setIsSuccess(false), 5000);
  };

  return (
    <ScrollReveal>
      <section className="relative overflow-hidden bg-[var(--onyx)] py-32 text-white">
        {/* Subtle texture */}
        <div className="pointer-events-none absolute inset-0 opacity-5">
          <svg className="h-full w-full">
            <pattern id="grain" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="0.5" fill="currentColor" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grain)" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-screen-2xl px-6 md:px-12">
          {/* Header */}
          <div className="mb-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-[0.6rem] uppercase tracking-[0.6em] text-white/40">
                {copy.kicker}
              </span>
              <h2 className="mt-4 font-display text-4xl md:text-5xl lg:text-6xl">{copy.title}</h2>
              <p className="mx-auto mt-6 max-w-xl text-white/50">{copy.subtitle}</p>
            </motion.div>
          </div>

          <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name & Email */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="group">
                    <label className="mb-2 block text-[0.6rem] uppercase tracking-[0.4em] text-white/40">
                      {copy.form.name}
                    </label>
                    <input
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      className="w-full border-b border-white/20 bg-transparent pb-3 text-white outline-none transition-colors placeholder:text-white/30 focus:border-[var(--gilded-rose)]"
                    />
                  </div>
                  <div className="group">
                    <label className="mb-2 block text-[0.6rem] uppercase tracking-[0.4em] text-white/40">
                      {copy.form.email}
                    </label>
                    <input
                      type="email"
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      className="w-full border-b border-white/20 bg-transparent pb-3 text-white outline-none transition-colors placeholder:text-white/30 focus:border-[var(--gilded-rose)]"
                    />
                  </div>
                </div>

                {/* Phone & Interest */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="group">
                    <label className="mb-2 block text-[0.6rem] uppercase tracking-[0.4em] text-white/40">
                      {copy.form.phone}
                    </label>
                    <input
                      type="tel"
                      value={formState.phone}
                      onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                      className="w-full border-b border-white/20 bg-transparent pb-3 text-white outline-none transition-colors placeholder:text-white/30 focus:border-[var(--gilded-rose)]"
                    />
                  </div>
                  <div className="group">
                    <label className="mb-2 block text-[0.6rem] uppercase tracking-[0.4em] text-white/40">
                      {copy.form.interest}
                    </label>
                    <select
                      value={formState.interest}
                      onChange={(e) => setFormState({ ...formState, interest: e.target.value })}
                      className="w-full cursor-pointer border-b border-white/20 bg-transparent pb-3 text-white outline-none transition-colors focus:border-[var(--gilded-rose)]"
                    >
                      <option value="" className="bg-[var(--onyx)]">—</option>
                      {copy.form.interests.map((interest) => (
                        <option key={interest} value={interest} className="bg-[var(--onyx)]">
                          {interest}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="group">
                  <label className="mb-2 block text-[0.6rem] uppercase tracking-[0.4em] text-white/40">
                    {copy.form.message}
                  </label>
                  <textarea
                    rows={4}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className="w-full resize-none border-b border-white/20 bg-transparent pb-3 text-white outline-none transition-colors placeholder:text-white/30 focus:border-[var(--gilded-rose)]"
                  />
                </div>

                {/* Submit */}
                <div className="flex items-center justify-between pt-4">
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group flex items-center gap-3 rounded-full bg-white px-10 py-5 text-xs uppercase tracking-[0.3em] text-[var(--onyx)] transition-all hover:bg-white/90 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="h-4 w-4 rounded-full border-2 border-[var(--onyx)]/30 border-t-[var(--onyx)]"
                        />
                        {copy.form.sending}
                      </>
                    ) : (
                      <>
                        <Send size={16} className="transition-transform group-hover:translate-x-1" />
                        {copy.form.submit}
                      </>
                    )}
                  </motion.button>
                  <span className="hidden text-[0.6rem] uppercase tracking-[0.4em] text-white/30 sm:block">
                    {copy.note}
                  </span>
                </div>

                {/* Success message */}
                <AnimatePresence>
                  {isSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-3 rounded-xl bg-white/10 px-5 py-4"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20">
                        <Check size={16} className="text-green-400" />
                      </div>
                      <p className="text-sm text-white/80">{copy.form.success}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>

            {/* Right column - Direct contact */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Direct contact card */}
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
                <h3 className="font-display text-2xl">{copy.directContact.title}</h3>
                
                <div className="mt-8 space-y-6">
                  {/* Phone */}
                  <a
                    href={`tel:${copy.directContact.phone.value.replace(/\s/g, "")}`}
                    className="group flex items-center gap-4"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 transition-colors group-hover:bg-[var(--gilded-rose)]/20">
                      <Phone size={18} className="text-white/60 transition-colors group-hover:text-[var(--gilded-rose)]" />
                    </div>
                    <div>
                      <p className="text-[0.6rem] uppercase tracking-[0.4em] text-white/40">
                        {copy.directContact.phone.label}
                      </p>
                      <p className="mt-1 font-display text-lg group-hover:text-[var(--gilded-rose)] transition-colors">
                        {copy.directContact.phone.value}
                      </p>
                    </div>
                  </a>

                  {/* Email */}
                  <a
                    href={`mailto:${copy.directContact.email.value}`}
                    className="group flex items-center gap-4"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 transition-colors group-hover:bg-[var(--gilded-rose)]/20">
                      <Send size={18} className="text-white/60 transition-colors group-hover:text-[var(--gilded-rose)]" />
                    </div>
                    <div>
                      <p className="text-[0.6rem] uppercase tracking-[0.4em] text-white/40">
                        {copy.directContact.email.label}
                      </p>
                      <p className="mt-1 font-display text-lg group-hover:text-[var(--gilded-rose)] transition-colors">
                        {copy.directContact.email.value}
                      </p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Appointment card */}
              <motion.div
                whileHover={{ y: -4 }}
                className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[var(--gilded-rose)]/20 to-transparent p-8"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--gilded-rose)]/20">
                      <Calendar size={20} className="text-[var(--gilded-rose)]" />
                    </div>
                    <h3 className="mt-6 font-display text-2xl">{copy.appointment.title}</h3>
                    <p className="mt-2 text-sm text-white/50">{copy.appointment.description}</p>
                  </div>
                </div>
                
                <a
                  href={`/${locale}/appointments`}
                  className="mt-6 inline-flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.4em] text-[var(--gilded-rose)] transition-colors hover:text-white"
                >
                  {copy.appointment.cta}
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </a>

                {/* Decorative gradient */}
                <div className="pointer-events-none absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-[var(--gilded-rose)]/10 blur-3xl" />
              </motion.div>

              {/* Address */}
              <div className="flex items-center gap-3 text-white/40">
                <MapPin size={14} />
                <span className="text-sm">31 Rue du Faubourg Saint-Honoré, 75008 Paris</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
