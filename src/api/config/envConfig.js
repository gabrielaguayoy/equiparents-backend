// src/config/envConfig.js

import dotenv from "dotenv";

// 📌 Carga las variables de entorno
dotenv.config();

// 📌 Validación de variables requeridas
const requiredEnvVars = ["DATABASE_URL", "PORT", "JWT_SECRET"];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    console.error(`❌ FALTA VARIABLE DE ENTORNO: ${envVar}`);
    process.exit(1);
  }
});

/**
 * 📌 Configuración centralizada de variables de entorno
 */
export const config = {
  PORT: process.env.PORT || 5000,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  NODE_ENV: process.env.NODE_ENV || "development",
};

export default config;
