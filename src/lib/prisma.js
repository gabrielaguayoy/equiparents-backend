// src/lib/prisma.js

import { PrismaClient } from "@prisma/client";

let prisma;

if (process.env.NODE_ENV === "development") {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma; // Utiliza la instancia global en desarrollo
} else {
  prisma = new PrismaClient(); // Nueva instancia en producción
}

export default prisma;
