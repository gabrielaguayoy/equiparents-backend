// prisma/seed.js

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const roles = [
    { name: "admin", description: "Administrador del sistema" },
    { name: "parent", description: "Usuario que tiene hijos" },
  ];

  const rolePromises = roles.map((role) =>
    prisma.role.create({
      data: role,
    })
  );

  await Promise.all(rolePromises);
  console.log("Roles seeded");
}

main()
  .catch((e) => {
    console.error("Error seeding roles:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
