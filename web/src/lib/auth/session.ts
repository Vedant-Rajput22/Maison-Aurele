import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return null;
  }
  const { id, email, firstName, lastName, role } = session.user;
  return {
    id,
    email: email ?? null,
    firstName: firstName ?? null,
    lastName: lastName ?? null,
    role: role ?? null,
  };
}

export async function getCurrentUserId() {
  const user = await getCurrentUser();
  return user?.id ?? null;
}
