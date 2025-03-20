// src/api/utils/errorHandler.js

import { prisma } from "../config/database.js";

/**
 * 📌 Middleware global para manejar errores en Express
 * @param {Object} err - Objeto de error capturado
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {Object} res - Objeto de respuesta HTTP
 * @param {Function} next - Función para pasar al siguiente middleware
 */
const errorHandler = (err, req, res, next) => {
  const errorMap = {
    ValidationError: {
      status: 400,
      message: "Datos inválidos en la solicitud",
    },
    JsonWebTokenError: { status: 401, message: "Token inválido o expirado" },
    TokenExpiredError: {
      status: 401,
      message: "Token expirado, inicia sesión nuevamente",
    },
    NotFoundError: { status: 404, message: "Recurso no encontrado" },
  };

  const { status, message } = errorMap[err.name] || {
    status: err.status || 500,
    message: err.message || "Error interno del servidor",
  };

  if (process.env.NODE_ENV === "development") {
    console.error("❌ ERROR DETECTADO:", {
      status,
      message,
      path: req.originalUrl,
      method: req.method,
      stack: err.stack,
    });
  }

  res.status(status).json({
    status: "error",
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

/**
 * 📌 Función para manejar errores en servicios y controladores
 * @param {Object} res - Objeto de respuesta HTTP
 * @param {string} message - Mensaje de error
 * @param {number} statusCode - Código de estado HTTP (opcional, por defecto 500)
 * @param {Object} error - Objeto de error (opcional, para debug)
 */
export const handleServerError = (
  res,
  message,
  statusCode = 500,
  error = null
) => {
  if (process.env.NODE_ENV === "development" && error) {
    console.error(`❌ ${message}:`, error);
  }
  res.status(statusCode).json({ status: "error", message });
};

/**
 * 📌 Verifica si un usuario ya existe en la base de datos
 * @param {string} email - Correo electrónico a verificar
 * @returns {Promise<boolean>} - Retorna `true` si el usuario existe, `false` si no
 */
export const validateExistingUser = async (email) => {
  try {
    if (!prisma || !prisma.user) {
      throw new Error("Prisma no está inicializado correctamente.");
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (process.env.NODE_ENV === "development") {
      console.log("🔍 Validación de usuario:", user ? "Existe" : "No existe");
    }

    return !!user;
  } catch (error) {
    console.error("❌ Error en validateExistingUser:", error);
    return false;
  }
};

export default errorHandler;
