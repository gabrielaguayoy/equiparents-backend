// src/api/children/children.js

import express from "express";
import { body, param } from "express-validator"; // ✅ Validaciones
import {
  getAllChildren,
  getChildById,
  createChild,
  updateChild,
  deleteChild,
} from "../../controllers/childController.js";
import validateRequest from "../../middleware/validateRequest.js"; // Middleware para validaciones

const router = express.Router();

// 📌 Obtener todos los hijos
router.get("/", getAllChildren);

// 📌 Obtener un hijo por ID con validación
router.get(
  "/:id",
  param("id").isInt().withMessage("El ID debe ser un número entero válido."),
  validateRequest,
  getChildById
);

// 📌 Crear un nuevo hijo con validaciones
router.post(
  "/",
  [
    body("name").notEmpty().withMessage("El nombre es obligatorio."),
    body("dateOfBirth")
      .isISO8601()
      .withMessage("La fecha de nacimiento debe ser en formato ISO8601."),
    body("parentalAccountId")
      .isInt()
      .withMessage("El parentalAccountId debe ser un número entero."),
    body("userId").isInt().withMessage("El userId debe ser un número entero."),
  ],
  validateRequest,
  createChild
);

// 📌 Actualizar un hijo con validaciones
router.put(
  "/:id",
  [
    param("id").isInt().withMessage("El ID debe ser un número entero válido."),
    body("name")
      .optional()
      .notEmpty()
      .withMessage("El nombre no puede estar vacío."),
    body("dateOfBirth")
      .optional()
      .isISO8601()
      .withMessage("La fecha de nacimiento debe ser en formato ISO8601."),
  ],
  validateRequest,
  updateChild
);

// 📌 Eliminar un hijo con validación de ID
router.delete(
  "/:id",
  param("id").isInt().withMessage("El ID debe ser un número entero válido."),
  validateRequest,
  deleteChild
);

// 📌 Manejo de rutas inexistentes
router.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Ruta no encontrada en /api/children.",
  });
});

export default router;
