"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";

interface PersonalizationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: { monogram: string; notes?: string }) => void;
    productName: string;
    maxLength?: number;
    locale: Locale;
}

const COPY = {
    en: {
        title: "Personalize Your Piece",
        subtitle: "Add a monogram to make this piece uniquely yours",
        monogramLabel: "Monogram",
        monogramPlaceholder: "ABC",
        monogramHint: "Up to {max} characters (letters only)",
        notesLabel: "Special instructions",
        notesPlaceholder: "Any specific requests for your monogram...",
        preview: "Preview",
        cancel: "Cancel",
        confirm: "Add Personalization",
        fee: "Personalization fee: +€30",
        crafted: "Hand-embroidered in our Paris atelier",
    },
    fr: {
        title: "Personnalisez Votre Pièce",
        subtitle: "Ajoutez un monogramme pour rendre cette pièce unique",
        monogramLabel: "Monogramme",
        monogramPlaceholder: "ABC",
        monogramHint: "Jusqu'à {max} caractères (lettres uniquement)",
        notesLabel: "Instructions spéciales",
        notesPlaceholder: "Toute demande spécifique pour votre monogramme...",
        preview: "Aperçu",
        cancel: "Annuler",
        confirm: "Ajouter la personnalisation",
        fee: "Frais de personnalisation : +30 €",
        crafted: "Brodé à la main dans notre atelier parisien",
    },
} as const;

export function PersonalizationModal({
    isOpen,
    onClose,
    onConfirm,
    productName,
    maxLength = 3,
    locale,
}: PersonalizationModalProps) {
    const copy = COPY[locale];
    const [monogram, setMonogram] = useState("");
    const [notes, setNotes] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleMonogramChange = (value: string) => {
        // Only allow letters
        const cleaned = value.toUpperCase().replace(/[^A-Z]/g, "");
        if (cleaned.length <= maxLength) {
            setMonogram(cleaned);
            setError(null);
        }
    };

    const handleConfirm = () => {
        if (monogram.length === 0) {
            setError(locale === "fr" ? "Veuillez entrer un monogramme" : "Please enter a monogram");
            return;
        }
        onConfirm({ monogram, notes: notes.trim() || undefined });
        setMonogram("");
        setNotes("");
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                        className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[2rem] bg-white shadow-[0_40px_120px_rgba(0,0,0,0.3)]"
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between border-b border-ink/10 px-8 py-6">
                            <div>
                                <div className="flex items-center gap-2">
                                    <Sparkles size={16} className="text-[var(--gilded-rose)]" />
                                    <h2 className="font-display text-2xl text-ink">{copy.title}</h2>
                                </div>
                                <p className="mt-1 text-sm text-ink/60">{copy.subtitle}</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/10 text-ink/50 transition-colors hover:bg-ink/5 hover:text-ink"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-8">
                            {/* Product Name */}
                            <p className="text-xs uppercase tracking-[0.4em] text-ink/40 mb-6">
                                {productName}
                            </p>

                            {/* Monogram Input */}
                            <div className="mb-6">
                                <label className="block text-xs uppercase tracking-[0.3em] text-ink/50 mb-2">
                                    {copy.monogramLabel}
                                </label>
                                <input
                                    type="text"
                                    value={monogram}
                                    onChange={(e) => handleMonogramChange(e.target.value)}
                                    placeholder={copy.monogramPlaceholder}
                                    className="w-full rounded-xl border border-ink/15 bg-white px-5 py-4 text-center font-display text-4xl tracking-[0.3em] text-ink placeholder:text-ink/20 outline-none focus:border-ink/30 focus:shadow-[0_0_0_4px_rgba(38,24,14,0.05)]"
                                    style={{ letterSpacing: "0.3em" }}
                                />
                                <p className="mt-2 text-xs text-ink/40 text-center">
                                    {copy.monogramHint.replace("{max}", String(maxLength))}
                                </p>
                            </div>

                            {/* Preview */}
                            {monogram && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-6 rounded-2xl bg-[var(--parchment)] p-6 text-center"
                                >
                                    <p className="text-xs uppercase tracking-[0.5em] text-ink/30 mb-3">
                                        {copy.preview}
                                    </p>
                                    <div className="inline-flex items-center justify-center rounded-xl bg-ink/5 px-8 py-4">
                                        <span className="font-display text-3xl tracking-[0.4em] text-ink">
                                            {monogram}
                                        </span>
                                    </div>
                                </motion.div>
                            )}

                            {/* Notes */}
                            <div className="mb-6">
                                <label className="block text-xs uppercase tracking-[0.3em] text-ink/50 mb-2">
                                    {copy.notesLabel}
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder={copy.notesPlaceholder}
                                    rows={2}
                                    className="w-full resize-none rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/30 outline-none focus:border-ink/30"
                                />
                            </div>

                            {/* Error */}
                            {error && (
                                <p className="mb-4 text-xs text-red-600 text-center">{error}</p>
                            )}

                            {/* Fee Notice */}
                            <div className="mb-6 flex items-center justify-center gap-2 text-xs text-ink/50">
                                <span className="text-[var(--gilded-rose)]">✦</span>
                                <span>{copy.fee}</span>
                            </div>

                            {/* Crafted Notice */}
                            <p className="mb-8 text-center text-xs italic text-ink/40">
                                {copy.crafted}
                            </p>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={onClose}
                                    className="flex-1 rounded-xl border border-ink/15 px-6 py-3 text-xs uppercase tracking-[0.3em] text-ink/60 transition-colors hover:bg-ink/5"
                                >
                                    {copy.cancel}
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    disabled={!monogram}
                                    className="flex-1 rounded-xl bg-ink px-6 py-3 text-xs uppercase tracking-[0.3em] text-white transition-colors hover:bg-ink/90 disabled:opacity-40"
                                >
                                    {copy.confirm}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
