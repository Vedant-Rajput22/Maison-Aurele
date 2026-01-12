import type { Locale as AppLocale } from "./config";
import type { Locale as DbLocale } from "@prisma/client";

export function toDbLocale(locale: AppLocale): DbLocale {
  return locale.toUpperCase() as DbLocale;
}

