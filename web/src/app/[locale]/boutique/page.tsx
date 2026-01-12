import type { Locale } from "@/lib/i18n/config";
import { BoutiqueHero } from "@/components/boutique/boutique-hero";
import { BoutiqueGallery } from "@/components/boutique/boutique-gallery";
import { BoutiqueServices } from "@/components/boutique/boutique-services";
import { BoutiqueLocation } from "@/components/boutique/boutique-location";
import { BoutiqueContact } from "@/components/boutique/boutique-contact";

type LocaleParams = { locale: Locale } | Promise<{ locale: Locale }>;

export default async function BoutiquePage({
  params,
}: {
  params: LocaleParams;
}) {
  const resolved = await params;
  const locale = resolved.locale;

  return (
    <main className="overflow-x-hidden">
      {/* Cinematic Hero with Rotating Gallery */}
      <BoutiqueHero locale={locale} />
      
      {/* Boutique Space Gallery */}
      <BoutiqueGallery locale={locale} />
      
      {/* Services Section */}
      <BoutiqueServices locale={locale} />
      
      {/* Location & Map */}
      <BoutiqueLocation locale={locale} />
      
      {/* Contact Form */}
      <BoutiqueContact locale={locale} />
    </main>
  );
}

