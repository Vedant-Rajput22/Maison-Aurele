import type { Locale } from "@/lib/i18n/config";
import { AppointmentsContent } from "@/components/appointments/appointments-content";

type LocaleParams = { locale: Locale } | Promise<{ locale: Locale }>;

export default async function AppointmentsPage({
  params,
}: {
  params: LocaleParams;
}) {
  const resolved = await params;
  const locale = resolved.locale;

  return <AppointmentsContent locale={locale} />;
}
