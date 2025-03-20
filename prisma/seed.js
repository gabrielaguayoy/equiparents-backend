// prisma/seed.js

import { prisma } from "../src/api/config/database.js";

const seedRoles = async () => {
  try {
    const roles = ["admin", "parent"];

    for (const role of roles) {
      await prisma.role.upsert({
        where: { name: role },
        update: {}, // Si ya existe, no se actualiza
        create: { name: role }, // Si no existe, se crea
      });
    }

    console.log("✅ Roles cargados correctamente.");
  } catch (error) {
    console.error("❌ Error al cargar roles:", error);
  } finally {
    await prisma.$disconnect(); // 🔌 Cerrar conexión con la BD
  }
};

seedRoles();
