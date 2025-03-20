import { prisma } from "./src/config/database.js";

const testPrisma = async () => {
  try {
    console.log("✅ Probando conexión a la base de datos...");
    const users = await prisma.user.findMany();
    console.log("👤 Usuarios encontrados:", users);
  } catch (error) {
    console.error("❌ Error al ejecutar Prisma:", error);
  } finally {
    await prisma.$disconnect();
  }
};

testPrisma();
