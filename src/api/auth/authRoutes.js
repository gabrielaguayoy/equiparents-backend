// src/api/auth/authRoutes.js
import express from "express";
import rateLimit from "express-rate-limit";
import { login, logout, refreshToken } from "./authController.js";
import { authenticateToken } from "../../middleware/authenticate.js";

const router = express.Router();

// 📌 Limita intentos de inicio de sesión para evitar fuerza bruta
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Máximo 5 intentos
  message: "Demasiados intentos de inicio de sesión. Intente más tarde.",
});

router.post("/login", loginLimiter, login);
router.post("/logout", logout);
router.get("/refresh", authenticateToken, refreshToken);

export default router;
