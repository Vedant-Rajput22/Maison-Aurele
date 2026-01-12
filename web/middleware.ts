import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, locales } from "@/lib/i18n/config";

export function middleware(req: NextRequest) {
  const { pathname, origin, search } = req.nextUrl;

  // Redirect locale-prefixed admin paths to the canonical /admin to avoid double layouts/nav.
  for (const locale of locales) {
    const localeAdminPrefix = `/${locale}/admin`;
    if (pathname === localeAdminPrefix || pathname.startsWith(`${localeAdminPrefix}/`)) {
      return NextResponse.redirect(`${origin}${pathname.replace(`/${locale}`, "")}${search}`);
    }
  }

  const isPublicAsset =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/assets") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/admin" ||
    pathname.startsWith("/admin/");

  const isLocalePath = locales.some((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`));

  if (!isPublicAsset && !isLocalePath) {
    return NextResponse.redirect(`${origin}/${defaultLocale}${pathname}${search}`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
