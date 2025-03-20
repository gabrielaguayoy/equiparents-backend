// src/api/auth/authController.js
import bcrypt from "bcryptjs"; // ✅ Solo se usa en el backend
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { getUserByEmail } from "../users/userService.js"; // ✅ Importación correcta

/**
 * 📌 Genera un token JWT seguro
 * @param {Object} param0 - Datos del usuario
 * @returns {String} Token JWT
 */
const generateToken = ({ id, email, role }) => {
  return jwt.sign({ userId: id, email, role }, process.env.JWT_SECRET, {
    expiresIn: "2h", // 🔹 Ampliado tiempo de expiración
    algorithm: "HS256",
  });
};

/**
 * 📌 Iniciar sesión
 * @route POST /api/auth/login
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      status: "error",
      message: "Email y contraseña son obligatorios.",
    });
  }

  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return res
        .status(401)
        .json({ status: "error", message: "Credenciales inválidas." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ status: "error", message: "Credenciales inválidas." });
    }

    if (!user.role || !user.role.name) {
      return res
        .status(500)
        .json({ status: "error", message: "Error interno del servidor." });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role.name,
    });

    return res.status(200).json({
      status: "success",
      message: "Inicio de sesión exitoso.",
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role.name,
        parentalAccountId: user.parentalAccountId,
      },
    });
  } catch (error) {
    console.error("❌ Error en login:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Error interno del servidor." });
  }
});

/**
 * 📌 Cerrar sesión
 * @route POST /api/auth/logout
 */
export const logout = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json({ status: "success", message: "Sesión cerrada correctamente." });
});

/**
 * 📌 Refrescar token JWT
 * @route GET /api/auth/refresh
 */
export const refreshToken = asyncHandler(async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ status: "error", message: "Token requerido." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const newToken = generateToken({
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    });

    return res.status(200).json({ status: "success", token: newToken });
  } catch (error) {
    console.error("❌ Error al refrescar token:", error);
    return res
      .status(401)
      .json({ status: "error", message: "Token inválido o expirado." });
  }
});
