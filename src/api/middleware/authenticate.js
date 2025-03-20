// src/api/middleware/authenticate.js

import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

/**
 * 📌 Genera un token JWT para autenticación
 * @param {Object} payload - Datos del usuario (Ej: `{ userId: 1, role: 'admin' }`)
 * @param {string} expiresIn - Duración del token (Ej: "7d" para 7 días)
 * @returns {string} Token JWT generado
 */
export const generateToken = (payload, expiresIn = "7d") => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

/**
 * 📌 Verifica un token JWT
 * @param {string} token - Token a verificar
 * @returns {Object | null} Retorna los datos decodificados o `null` si es inválido
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error("❌ Error al verificar token:", error);
    return null;
  }
};

/**
 * 📌 Middleware para autenticar al usuario mediante JWT
 */
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.warn("⚠️ Token no proporcionado o inválido.");
    return res.status(403).json({
      status: "error",
      message: "Acceso no autorizado. Token requerido.",
    });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("❌ Token inválido o expirado:", err.message);
      return res.status(403).json({
        status: "error",
        message: "Token inválido o expirado.",
      });
    }

    console.log("✅ Token verificado. Usuario autenticado:", user);
    req.user = {
      userId: user.userId,
      email: user.email,
      roleName: user.role,
    };

    next();
  });
};

/**
 * 📌 Middleware para verificar si el usuario es administrador
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      status: "error",
      message: "Acceso denegado. Se requieren privilegios de administrador.",
    });
  }
  next();
};
