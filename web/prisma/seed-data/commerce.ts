/**
 * Maison Aurèle – Commerce Seed Data
 * Promotions, Limited Drops, Sample Orders
 */

import { Locale } from "@prisma/client";

export interface PromotionSeed {
    id: string;
    code: string;
    description: string;
    discountType: "percentage" | "amount" | "shipping";
    discountValue: number;
    startsAt: Date;
    endsAt: Date | null;
    usageLimit: number | null;
    locale: Locale | null;
    limitedEditionOnly: boolean;
}

export interface LimitedDropSeed {
    id: string;
    collectionId: string;
    title: string;
    startsAt: Date;
    endsAt: Date | null;
    waitlistOpen: boolean;
    locale: Locale | null;
}

export interface AppointmentSeed {
    id: string;
    locale: Locale;
    boutique: string;
    appointmentAt: Date;
    status: string;
    services: string;
    notes: string;
    concierge: string;
}

export const promotions: PromotionSeed[] = [
    {
        id: "promo-bienvenue",
        code: "BIENVENUE",
        description: "Welcome to Maison Aurèle — 10% off your first order",
        discountType: "percentage",
        discountValue: 10,
        startsAt: new Date("2025-01-01"),
        endsAt: null,
        usageLimit: null,
        locale: null,
        limitedEditionOnly: false,
    },
    {
        id: "promo-premiere",
        code: "PREMIERE",
        description: "€200 off orders over €2,000 — Atelier Première collection launch",
        discountType: "amount",
        discountValue: 20000, // cents
        startsAt: new Date("2025-01-01"),
        endsAt: new Date("2025-12-31"),
        usageLimit: 500,
        locale: null,
        limitedEditionOnly: false,
    },
    {
        id: "promo-aurele25",
        code: "AURELE25",
        description: "15% off limited edition pieces only",
        discountType: "percentage",
        discountValue: 15,
        startsAt: new Date("2025-11-01"),
        endsAt: new Date("2025-12-31"),
        usageLimit: 100,
        locale: null,
        limitedEditionOnly: true,
    },
    {
        id: "promo-livraison",
        code: "LIVRAISON",
        description: "Complimentary shipping on all orders — France",
        discountType: "shipping",
        discountValue: 0,
        startsAt: new Date("2025-01-01"),
        endsAt: null,
        usageLimit: null,
        locale: Locale.FR,
        limitedEditionOnly: false,
    },
    {
        id: "promo-nuitparisienne",
        code: "NUITPARISIENNE",
        description: "Early access — 10% off Nuit Parisienne collection",
        discountType: "percentage",
        discountValue: 10,
        startsAt: new Date("2025-09-01"),
        endsAt: new Date("2025-09-30"),
        usageLimit: 200,
        locale: null,
        limitedEditionOnly: false,
    },
];

export const limitedDrops: LimitedDropSeed[] = [
    {
        id: "drop-minuit-dore",
        collectionId: "col-minuit-dore",
        title: "Minuit Doré — Limited Edition Launch",
        startsAt: new Date("2025-11-01T10:00:00Z"),
        endsAt: new Date("2025-11-30T23:59:59Z"),
        waitlistOpen: true,
        locale: null,
    },
    {
        id: "drop-calais-lace",
        collectionId: "col-nuit-parisienne",
        title: "La Robe Dentelle — Exclusive Pre-Order",
        startsAt: new Date("2025-10-15T10:00:00Z"),
        endsAt: new Date("2025-10-31T23:59:59Z"),
        waitlistOpen: true,
        locale: null,
    },
];

export const sampleAppointments: AppointmentSeed[] = [
    {
        id: "apt-001",
        locale: Locale.FR,
        boutique: "Paris — Faubourg Saint-Honoré",
        appointmentAt: new Date("2025-02-15T14:00:00Z"),
        status: "confirmed",
        services: "Private Viewing, Made-to-Measure Consultation",
        notes: "Client interested in bespoke outerwear. Has purchased Le Manteau Nocturne previously.",
        concierge: "Marie-Claire Dubois",
    },
    {
        id: "apt-002",
        locale: Locale.EN,
        boutique: "Paris — Faubourg Saint-Honoré",
        appointmentAt: new Date("2025-02-20T11:00:00Z"),
        status: "requested",
        services: "Wardrobe Consultation",
        notes: "New client from London. Referred by existing client.",
        concierge: "Marie-Claire Dubois",
    },
    {
        id: "apt-003",
        locale: Locale.FR,
        boutique: "Paris — Faubourg Saint-Honoré",
        appointmentAt: new Date("2025-03-01T15:30:00Z"),
        status: "confirmed",
        services: "Atelier Tour, Private Viewing",
        notes: "VIP client — 5+ years. Annual wardrobe refresh.",
        concierge: "Jean-Pierre Martin",
    },
];

export default { promotions, limitedDrops, sampleAppointments };
