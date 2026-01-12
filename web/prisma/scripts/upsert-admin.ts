import "dotenv/config";
import { hash } from "bcryptjs";
import { prisma } from "../../src/lib/prisma";

const email = process.env.ADMIN_EMAIL ?? "admin@maison.test";


async function main() {
  if (!process.env.DIRECT_URL) {
    throw new Error("DIRECT_URL must be set (same as your postgres URL)");
  }


  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    throw new Error("ADMIN_PASSWORD environment variable must be set");
  }

  const passwordHash = await hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: { role: "ADMIN", passwordHash },
    create: {
      email,
      passwordHash,
      role: "ADMIN",
      firstName: "Maison",
      lastName: "Admin",
      locale: "EN",
      marketingOptIn: false,
    },
  });

  console.log("Admin ready:", email, password);
}

main()
  .catch((err) => {
    console.error("Admin upsert failed", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
