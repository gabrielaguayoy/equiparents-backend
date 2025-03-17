// src/api/users/users.js

import express from "express";
import {
  getMe,
  getAllUsers,
  getUserById,
  registerUser,
  updateUser,
  deleteUser,
} from "../../controllers/userController.js";
import { login } from "../../controllers/authController.js";
import { authenticateToken } from "../../middleware/authenticate.js";

const router = express.Router();

/**
 * Rutas para la API de usuarios
 */

// Obtener información del usuario autenticado
router.get("/me", authenticateToken, getMe);

// Obtener todos los usuarios
router.get("/", getAllUsers);

// Obtener un usuario específico por ID
router.get("/:id", getUserById);

// Registrar un nuevo usuario
router.post("/register", registerUser);

// Iniciar sesión
router.post("/login", login);

// Actualizar un usuario existente
router.put("/:id", authenticateToken, updateUser); // Asegúrate de agregar seguridad a la actualización

// Eliminar un usuario existente
router.delete("/:id", authenticateToken, deleteUser); // Asegúrate de agregar seguridad a la eliminación

export default router;
