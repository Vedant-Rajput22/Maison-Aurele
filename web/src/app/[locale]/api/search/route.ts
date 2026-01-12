import { NextResponse, type NextRequest } from "next/server";
import type { Locale } from "@/lib/i18n/config";
import { isLocale } from "@/lib/i18n/config";
import { searchProducts } from "@/lib/data/search";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ locale: string }> },
) {
  const { locale } = await context.params;
  if (!isLocale(locale)) {
    return NextResponse.json({ results: [] }, { status: 400 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";

  try {
    const results = await searchProducts(query, locale as Locale, 6);
    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search error", error);
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}
