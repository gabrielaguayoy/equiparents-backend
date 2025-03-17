// src/api/roles/roles.js

import express from "express";
import {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
} from "../../controllers/roleController.js"; // Importar funciones del controlador

const router = express.Router();

// Rutas para roles
router.get("/", getAllRoles); // Obtener todos los roles
router.get("/:id", getRoleById); // Obtener un rol específico por ID
router.post("/", createRole); // Crear un nuevo rol
router.put("/:id", updateRole); // Actualizar un rol por ID
router.delete("/:id", deleteRole); // Eliminar un rol por ID

export default router; // Asegúrate de tener esta línea para exportar el enrutador
