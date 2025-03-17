// src/server.js
import express from "express";
import cors from "cors";
import morgan from "morgan";
import * as Sentry from "@sentry/node";
import dotenv from "dotenv";
import routes from "./routes/index.js"; // Importar todas las rutas centralizadas
import { errorHandler } from "./middleware/errorHandler.js"; // Importar middleware de manejo de errores

dotenv.config(); // Cargar variables de entorno

const app = express();

// Configurar Sentry solo si está habilitado y el DSN está presente
if (process.env.ENABLE_SENTRY === "true" && process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }), // Captura solicitudes HTTP
    ],
    tracesSampleRate: 1.0, // Ajusta según necesidades
  });

  app.use(Sentry.Handlers.requestHandler()); // Middleware para capturar errores de request
}

// Middleware base
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Ruta de verificación del servidor
app.get("/", (req, res) => res.send("🚀 Servidor en funcionamiento"));

// Usar rutas centralizadas desde `routes/index.js`
app.use("/api", routes);

// Captura errores con Sentry antes del manejador de errores general
if (process.env.ENABLE_SENTRY === "true") {
  app.use(Sentry.Handlers.errorHandler()); // Captura errores para Sentry
}

// Manejo global de errores
app.use(errorHandler);

// Manejar métodos no permitidos
app.use((req, res) => {
  res.status(405).json({ status: "error", message: "Método no permitido" });
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en: http://localhost:${PORT}`);
});
