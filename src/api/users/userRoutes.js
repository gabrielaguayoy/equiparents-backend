// src/api/users/userRoutes.js
import express from "express";
import {
  getMe,
  getAllUsers,
  getUserById,
  registerUser,
  updateUser,
  deleteUser,
} from "./userController.js";
import { login } from "../auth/authController.js";
import { authenticateToken } from "../middleware/authenticate.js";

const router = express.Router();

/**
 * 📌 Middleware para validar roles
 */
const authorizeRole = (role) => (req, res, next) => {
  if (!req.user || req.user.roleName !== role) {
    return res.status(403).json({
      status: "error",
      message: `Acceso denegado. Se requiere rol de ${role}.`,
    });
  }
  next();
};

/**
 * 📌 Middleware para validar acceso propio o de administrador
 */
const authorizeSelfOrAdmin = (req, res, next) => {
  const userId = parseInt(req.params.id, 10);
  if (isNaN(userId)) {
    return res.status(400).json({
      status: "error",
      message: "ID de usuario no válido.",
    });
  }

  if (req.user.roleName !== "admin" && req.user.userId !== userId) {
    return res.status(403).json({
      status: "error",
      message: "No tienes permisos para realizar esta acción.",
    });
  }
  next();
};

/**
 * 📌 Rutas de Autenticación (No requieren token)
 */
router.post("/register", registerUser);
router.post("/login", login);

/**
 * 📌 Middleware de Autenticación (Protege rutas siguientes)
 */
router.use(authenticateToken);

/**
 * 📌 Obtener información del usuario autenticado
 */
router.get("/me", getMe);

/**
 * 📌 Obtener todos los usuarios (Solo Administradores)
 */
router.get("/", authorizeRole("admin"), getAllUsers);

/**
 * 📌 Obtener un usuario por ID (Solo Admins y el propio usuario)
 */
router.get("/:id", authorizeSelfOrAdmin, getUserById);

/**
 * 📌 Actualizar usuario (Solo Admins y el propio usuario)
 */
router.put("/:id", authorizeSelfOrAdmin, updateUser);

/**
 * 📌 Eliminar usuario (Solo Administradores)
 */
router.delete("/:id", authorizeRole("admin"), deleteUser);

export default router;
