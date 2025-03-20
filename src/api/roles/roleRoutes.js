// src/api/roles/roleRoutes.js

import express from "express";
import {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
} from "./roleController.js";
import {
  authenticateToken,
  requireAdmin,
} from "../../middleware/authenticate.js";

const router = express.Router();

/**
 * @route   GET /api/roles
 * @desc    Obtener todos los roles disponibles
 * @access  Público
 */
// 🔹 ✅ Obtener todos los roles (ACCESO PÚBLICO, necesario para el registro)
router.get("/", getAllRoles);

// 🔹 Obtener un rol por ID (Solo administradores)
router.get("/:id", authenticateToken, requireAdmin, getRoleById);

// 🔹 Crear un nuevo rol (Solo administradores)
router.post("/", authenticateToken, requireAdmin, createRole);

// 🔹 Actualizar un rol (Solo administradores)
router.put("/:id", authenticateToken, requireAdmin, updateRole);

// 🔹 Eliminar un rol (Solo administradores)
router.delete("/:id", authenticateToken, requireAdmin, deleteRole);

export default router;
