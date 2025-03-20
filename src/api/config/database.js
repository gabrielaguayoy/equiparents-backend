// src/api/config/database.js

import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "info", "warn", "error"]
      : ["warn", "error"],
});

/**
 * 📌 Conectar a la base de datos
 */
export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Conectado a la base de datos");
  } catch (error) {
    console.error("❌ No se pudo conectar a la base de datos:", error);
    process.exit(1);
  }
};

/**
 * 📌 Cierra la conexión a la base de datos
 */
export const disconnectDB = async () => {
  try {
    await prisma.$disconnect();
    console.log("🔌 Desconectado de la base de datos");
  } catch (error) {
    console.error("❌ Error al cerrar la conexión:", error);
  }
};
