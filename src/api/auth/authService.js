// src/api/auth/authService.js

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/database.js";

/**
 * 🔐 Genera un token JWT seguro.
 * @param {Object} user - Usuario autenticado
 * @returns {String} Token JWT
 */
export const generateToken = ({ id, email, role }) => {
  return jwt.sign(
    { userId: id, email, role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" } // ⏳ Token expira en 1 hora
  );
};

/**
 * 🔍 Autentica a un usuario y valida su contraseña.
 * @param {String} email - Email del usuario
 * @param {String} password - Contraseña en texto plano
 * @returns {Object|null} Usuario autenticado o null si es inválido
 */
export const authenticateUser = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { role: true }, // 🛡️ Incluye el rol del usuario
  });

  if (!user) return null;

  const isMatch = await bcrypt.compare(password, user.password);
  return isMatch ? user : null;
};

/**
 * 🔄 Refresca el token JWT si es válido.
 * @param {String} token - Token expirado o a punto de expirar
 * @returns {String|null} Nuevo token o null si es inválido
 */
export const refreshAuthToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return generateToken({
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    });
  } catch (error) {
    console.warn("⚠️ Intento de refresco con token inválido:", error.message);
    return null; // ❌ Token inválido o expirado
  }
};
