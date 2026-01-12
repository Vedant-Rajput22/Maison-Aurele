import { redirect } from "next/navigation";
import { defaultLocale } from "@/lib/i18n/config";
import { getCurrentUser } from "@/lib/auth/session";

const ADMIN_ROLES = new Set(["ADMIN", "EDITOR", "MERCHANDISER"]);

export async function requireAdminUser() {
  const user = await getCurrentUser();
  if (!user?.role || !ADMIN_ROLES.has(user.role)) {
    // send to the default locale account page
    redirect(`/${defaultLocale}/account`);
  }
  return user;
}
