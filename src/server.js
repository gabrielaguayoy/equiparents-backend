// src/server.js

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import * as Sentry from "@sentry/node";
import dotenv from "dotenv";
import errorHandler from "./api/utils/errorHandler.js";
import { connectDB, prisma } from "./api/config/database.js";

// 📌 Cargar variables de entorno antes de cualquier otra configuración
dotenv.config();

// 🔹 Importar rutas
import userRoutes from "./api/users/userRoutes.js";
import authRoutes from "./api/auth/authRoutes.js";
import parentalRoutes from "./api/parentalAccounts/parentalRoutes.js";
import inviteRoutes from "./api/parentalAccounts/inviteRoutes.js";
import childRoutes from "./api/children/childRoutes.js";
import roleRoutes from "./api/roles/roleRoutes.js";

// 🔥 Inicializar Express
const app = express();

// 🛡️ Seguridad y optimización de performance
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production" ? process.env.ALLOWED_ORIGIN : "*", // En producción, solo permitir dominios específicos
    credentials: true,
  })
);
app.use(helmet());
app.use(compression()); // Comprime respuestas para mejorar rendimiento
app.use(express.json()); // Permite recibir JSON en las solicitudes
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// 📌 Inicializar Sentry solo si está habilitado en el entorno
if (process.env.ENABLE_SENTRY === "true") {
  Sentry.init({ dsn: process.env.SENTRY_DSN });
  app.use(Sentry.Handlers.requestHandler());
}

// 📌 Definir rutas
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/parental-accounts", parentalRoutes);
app.use("/api/invite", inviteRoutes);
app.use("/api/children", childRoutes);
app.use("/api/roles", roleRoutes);

// 📌 Capturar errores con Sentry antes de manejar errores globales
if (process.env.ENABLE_SENTRY === "true") {
  app.use(Sentry.Handlers.errorHandler());
}

// 🔥 Middleware global de manejo de errores
app.use(errorHandler);

// 🚀 Iniciar Servidor solo si la base de datos se conecta correctamente
const PORT = process.env.PORT || 5000;

connectDB()
  .then(async () => {
    try {
      const test = await prisma.user.findMany(); // Verificar conexión con la base de datos
      console.log(
        "✅ Conexión con la base de datos OK. Usuarios encontrados:",
        test.length
      );
    } catch (error) {
      console.error("❌ Error al conectar con la base de datos:", error);
      process.exit(1);
    }

    app.listen(PORT, () =>
      console.log(`✅ Servidor corriendo en: http://localhost:${PORT}`)
    );
  })
  .catch((error) => {
    console.error("❌ No se pudo iniciar el servidor:", error);
    process.exit(1);
  });

// 🔌 Manejo de cierre seguro del servidor
const gracefulShutdown = async (signal) => {
  console.log(`🛑 ${signal} detectado, cerrando servidor...`);
  try {
    await prisma.$disconnect();
    console.log("✅ Base de datos desconectada.");
  } catch (error) {
    console.error(
      "❌ Error al cerrar la conexión con la base de datos:",
      error
    );
  } finally {
    process.exit(0);
  }
};

// 📌 Manejo de señales del sistema para cerrar correctamente
["SIGINT", "SIGTERM"].forEach((signal) =>
  process.on(signal, () => gracefulShutdown(signal))
);
