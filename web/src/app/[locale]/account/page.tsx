import { notFound, redirect } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { ClientSuite } from "@/components/account/client-suite";

type Params = { locale: Locale } | Promise<{ locale: Locale }>;

export default async function AccountPage({ params }: { params: Params }) {
  const resolved = await params;
  if (!isLocale(resolved.locale)) {
    notFound();
  }
  const locale = resolved.locale;
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect(`/${locale}/login`);
  }

  const profile = await prisma.user.findUnique({
    where: { id: currentUser.id },
    include: {
      addresses: {
        orderBy: [{ isDefault: "desc" }, { label: "asc" }],
      },
      orders: {
        orderBy: { placedAt: "desc" },
        take: 10,
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: {
                    include: {
                      media: {
                        include: { asset: true },
                        orderBy: { sortOrder: "asc" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!profile) {
    redirect(`/${locale}/login`);
  }

  return <ClientSuite profile={profile} locale={locale} />;
}
