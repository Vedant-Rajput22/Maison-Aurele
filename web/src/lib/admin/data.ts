import { prisma } from "@/lib/prisma";
import {
  FulfillmentStatus,
  Locale,
  OrderStatus,
  PaymentStatus,
  Currency,
  ProductStatus,
  Promotion,
} from "@prisma/client";

export type AdminOverview = {
  products: number;
  drops: number;
  appointments: number;
  approvals: number;
};

export type AdminProductRow = {
  id: string;
  slug: string;
  name: string;
  status: ProductStatus;
  locales: Locale[];
  issues: string[];
};

export type AdminCollectionRow = {
  id: string;
  slug: string;
  title: string;
  status: ProductStatus;
  releaseDate?: Date | null;
  locales: Locale[];
  dropTitle?: string | null;
};

export type AdminHomepageModuleRow = {
  id: string;
  slug: string;
  type: string;
  locale: Locale;
  status: "Active" | "Scheduled" | "Ended";
  sortOrder: number;
};

export type AdminHomepageModuleDetail = AdminHomepageModuleRow & {
  config: unknown;
  activeFrom?: Date | null;
  activeTo?: Date | null;
};

export type AdminEditorialRow = {
  id: string;
  slug: string;
  title: string;
  status: ProductStatus;
  locales: Locale[];
  scheduled?: Date | null;
};

export type AdminOrderRow = {
  id: string;
  number: string;
  status: OrderStatus;
  fulfillmentStatus: FulfillmentStatus;
  customer?: string | null;
  totalCents: number;
};

export type AdminOrderAddress = {
  firstName: string;
  lastName: string;
  line1: string;
  line2?: string | null;
  city: string;
  region?: string | null;
  postalCode: string;
  country: string;
  phone?: string | null;
};

export type AdminOrderItem = {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  unitPriceCents: number;
  monogram?: string | null;
  personalizationNotes?: string | null;
  color?: string | null;
  size?: string | null;
};

export type AdminOrderEvent = {
  id: string;
  createdAt: Date;
  type: "payment" | "note";
  title: string;
  detail?: string | null;
};

export type AdminOrderDetail = AdminOrderRow & {
  paymentStatus: PaymentStatus;
  currency: Currency;
  placedAt: Date;
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  dutiesCents: number;
  personalizationFeeCents: number;
  whiteGlove: boolean;
  shippingAddress?: AdminOrderAddress | null;
  billingAddress?: AdminOrderAddress | null;
  items: AdminOrderItem[];
  events: AdminOrderEvent[];
};

export type AdminDropRow = {
  id: string;
  title: string;
  window: string;
  waitlist: number;
  locale?: Locale | null;
  status: "Scheduled" | "Live" | "Draft";
};

export type AdminAppointmentRow = {
  id: string;
  guest: string;
  when: Date;
  boutique: string;
  status: string;
};

export type AdminPromotionRow = Promotion & { localeLabel: string };

export type AdminOpsSignals = {
  lowStock: number;
  waitlist: number;
  scheduledDrops: number;
};

function localeCoverage(locales: Locale[]): Locale[] {
  return Array.from(new Set(locales));
}

export async function getAdminOverview(): Promise<AdminOverview> {
  const [products, drops, appointments, approvals] = await Promise.all([
    prisma.product.count({ where: { status: ProductStatus.ACTIVE } }),
    prisma.limitedDrop.count(),
    prisma.appointment.count({ where: { appointmentAt: { gte: new Date() } } }),
    prisma.product.count({ where: { status: ProductStatus.DRAFT } }),
  ]);

  return { products, drops, appointments, approvals };
}

export async function getAdminProducts(): Promise<AdminProductRow[]> {
  const products = await prisma.product.findMany({
    orderBy: { updatedAt: "desc" },
    take: 50,
    include: {
      translations: true,
      media: { take: 1 },
    },
  });

  return products.map((product) => {
    const locales = localeCoverage(product.translations.map((t) => t.locale));
    const missingLocales = [Locale.EN, Locale.FR].filter((locale) => !locales.includes(locale));
    const issues = [] as string[];

    if (missingLocales.length) {
      issues.push(`Missing ${missingLocales.join(" & ")}`);
    }

    if (product.media.length === 0) {
      issues.push("No media uploaded");
    }

    if (issues.length === 0) {
      issues.push("—");
    }

    const name =
      product.translations.find((t) => t.locale === Locale.EN)?.name ??
      product.translations[0]?.name ??
      product.slug;

    return {
      id: product.id,
      slug: product.slug,
      name,
      status: product.status,
      locales,
      issues,
    };
  });
}

export async function getAdminCollections(): Promise<AdminCollectionRow[]> {
  const collections = await prisma.collection.findMany({
    orderBy: { releaseDate: "desc" },
    include: {
      translations: true,
      drops: { orderBy: { startsAt: "desc" }, take: 1 },
    },
    take: 30,
  });

  return collections.map((collection) => {
    const locales = localeCoverage(collection.translations.map((t) => t.locale));
    const name =
      collection.translations.find((t) => t.locale === Locale.EN)?.title ??
      collection.translations[0]?.title ??
      collection.slug;
    const drop = collection.drops[0];

    return {
      id: collection.id,
      slug: collection.slug,
      title: name,
      status: collection.status,
      releaseDate: collection.releaseDate,
      locales,
      dropTitle: drop?.title ?? null,
    };
  });
}

export async function getAdminHomepageModules(): Promise<AdminHomepageModuleRow[]> {
  const now = new Date();
  const modules = await prisma.homepageModule.findMany({
    orderBy: [{ sortOrder: "asc" }],
    take: 100,
  });

  return modules.map((module) => {
    const status: "Active" | "Scheduled" | "Ended" =
      module.activeFrom && module.activeFrom > now
        ? "Scheduled"
        : module.activeTo && module.activeTo < now
          ? "Ended"
          : "Active";

    return {
      id: module.id,
      slug: module.slug,
      type: module.type,
      locale: module.locale,
      status,
      sortOrder: module.sortOrder,
    };
  });
}

export async function getAdminHomepageModule(id: string): Promise<AdminHomepageModuleDetail> {
  const now = new Date();
  const module = await prisma.homepageModule.findUnique({ where: { id } });
  if (!module) {
    throw new Error("Homepage module not found");
  }

  const status: "Active" | "Scheduled" | "Ended" =
    module.activeFrom && module.activeFrom > now
      ? "Scheduled"
      : module.activeTo && module.activeTo < now
        ? "Ended"
        : "Active";

  return {
    id: module.id,
    slug: module.slug,
    type: module.type,
    locale: module.locale,
    status,
    sortOrder: module.sortOrder,
    config: module.config,
    activeFrom: module.activeFrom,
    activeTo: module.activeTo,
  };
}

export async function getAdminEditorialPosts(): Promise<AdminEditorialRow[]> {
  const posts = await prisma.editorialPost.findMany({
    orderBy: [{ publishedAt: "desc" }, { slug: "asc" }],
    include: {
      translations: true,
    },
    take: 50,
  });

  return posts.map((post) => {
    const locales = localeCoverage(post.translations.map((t) => t.locale));
    const title =
      post.translations.find((t) => t.locale === Locale.EN)?.title ??
      post.translations[0]?.title ??
      post.slug;

    return {
      id: post.id,
      slug: post.slug,
      title,
      status: post.status,
      locales,
      scheduled: post.publishedAt,
    };
  });
}

export async function getAdminOrders(): Promise<AdminOrderRow[]> {
  const orders = await prisma.order.findMany({
    orderBy: { placedAt: "desc" },
    take: 30,
    include: {
      user: true,
    },
  });

  return orders.map((order) => ({
    id: order.id,
    number: order.number,
    status: order.status,
    fulfillmentStatus: order.fulfillmentStatus,
    customer: order.user?.firstName ?? order.user?.email ?? null,
    totalCents: order.totalCents,
  }));
}

export async function getAdminOrderDetail(id: string): Promise<AdminOrderDetail | null> {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      shippingAddress: true,
      billingAddress: true,
      items: {
        include: {
          variant: true,
        },
      },
      payments: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!order) return null;

  const customer = order.user?.firstName ?? order.user?.email ?? null;

  const items: AdminOrderItem[] = order.items.map((item) => ({
    id: item.id,
    name: item.productName,
    sku: item.variant.sku,
    quantity: item.quantity,
    unitPriceCents: item.unitPriceCents,
    monogram: item.monogram,
    personalizationNotes: item.personalizationNotes,
    color: item.variant.color,
    size: item.variant.size,
  }));

  const events: AdminOrderEvent[] = [
    {
      id: `placed-${order.id}`,
      createdAt: order.placedAt,
      type: "note",
      title: "Order placed",
      detail: order.number,
    },
    ...order.payments.map((payment) => ({
      id: payment.id,
      createdAt: payment.createdAt,
      type: payment.provider === "ops-note" ? ("note" as const) : ("payment" as const),
      title: payment.provider === "ops-note" ? "Operations note" : `${payment.provider} ${payment.status}`,
      detail:
        payment.provider === "ops-note"
          ? (payment.data as { note?: string })?.note ?? null
          : `${payment.amountCents / 100} ${payment.currency}`,
    })),
  ];

  return {
    id: order.id,
    number: order.number,
    status: order.status,
    fulfillmentStatus: order.fulfillmentStatus,
    paymentStatus: order.paymentStatus,
    currency: order.currency,
    placedAt: order.placedAt,
    subtotalCents: order.subtotalCents,
    shippingCents: order.shippingCents,
    taxCents: order.taxCents,
    dutiesCents: order.dutiesCents ?? 0,
    personalizationFeeCents: order.personalizationFeeCents ?? 0,
    totalCents: order.totalCents,
    whiteGlove: order.whiteGlove,
    customer,
    shippingAddress: order.shippingAddress ?? null,
    billingAddress: order.billingAddress ?? null,
    items,
    events,
  };
}

export async function getAdminDrops(): Promise<AdminDropRow[]> {
  const drops = await prisma.limitedDrop.findMany({
    orderBy: { startsAt: "desc" },
    include: {
      _count: {
        select: { waitlistEntries: true },
      },
    },
    take: 20,
  });

  const now = new Date();

  return drops.map((drop) => {
    const status: "Scheduled" | "Live" | "Draft" =
      drop.startsAt > now ? "Scheduled" : drop.endsAt && drop.endsAt < now ? "Draft" : "Live";
    const window = drop.endsAt
      ? `${drop.startsAt.toLocaleDateString()} – ${drop.endsAt.toLocaleDateString()}`
      : `${drop.startsAt.toLocaleDateString()}`;

    return {
      id: drop.id,
      title: drop.title,
      window,
      waitlist: drop._count.waitlistEntries,
      locale: drop.locale ?? null,
      status,
    };
  });
}

export async function getAdminAppointments(): Promise<AdminAppointmentRow[]> {
  const appointments = await prisma.appointment.findMany({
    orderBy: { appointmentAt: "asc" },
    where: { appointmentAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
    take: 30,
  });

  return appointments.map((appt) => ({
    id: appt.id,
    guest: appt.notes || appt.concierge || appt.userId || "Client",
    when: appt.appointmentAt,
    boutique: appt.boutique,
    status: appt.status,
  }));
}

export async function getAdminPromotions(): Promise<AdminPromotionRow[]> {
  const promos = await prisma.promotion.findMany({
    orderBy: { startsAt: "desc" },
    take: 20,
  });

  return promos.map((promo) => ({
    ...promo,
    localeLabel: promo.locale ? `${promo.locale}` : "All",
  }));
}

export async function getAdminOpsSignals(): Promise<AdminOpsSignals> {
  const now = new Date();
  const [lowStock, waitlist, drops] = await Promise.all([
    prisma.inventory.count({ where: { quantity: { lte: 2 } } }),
    prisma.waitlistEntry.count({ where: { status: "pending" } }),
    prisma.limitedDrop.count({ where: { startsAt: { gt: now } } }),
  ]);

  return {
    lowStock,
    waitlist,
    scheduledDrops: drops,
  };
}
