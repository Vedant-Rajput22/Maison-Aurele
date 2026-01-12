import type { Metadata } from "next";
import { ReactNode } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdminUser } from "@/lib/auth/admin";

export const metadata: Metadata = {
  title: "Maison Aurèle · Admin",
  description: "Atelier control for products, collections, and editorial.",
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await requireAdminUser();
  return <AdminShell user={user}>{children}</AdminShell>;
}
