"use server";

import { hash } from "bcryptjs";
import type { Locale } from "@/lib/i18n/config";
import { prisma } from "@/lib/prisma";
import { Locale as DbLocale } from "@prisma/client";

type RegisterInput = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  locale: Locale;
};

export async function registerAccount(input: RegisterInput) {
  const email = input.email?.toLowerCase().trim();
  const password = input.password?.trim();

  if (!email || !password) {
    return { ok: false, error: "Email and password are required." };
  }

  if (password.length < 8) {
    return { ok: false, error: "Password must be at least 8 characters." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { ok: false, error: "An account already exists for this email." };
  }

  const passwordHash = await hash(password, 12);

  const dbLocale: DbLocale = input.locale === "fr" ? DbLocale.FR : DbLocale.EN;

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      firstName: input.firstName?.trim() || null,
      lastName: input.lastName?.trim() || null,
      locale: dbLocale,
    },
  });

  return { ok: true, userId: user.id };
}
