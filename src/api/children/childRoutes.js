// src/api/children/childRoutes.js

import express from "express";
import {
  getAllChildren,
  getChildById,
  createChild,
  updateChild,
  deleteChild,
} from "./childController.js";
import { authenticateToken } from "../middleware/authenticate.js";

const router = express.Router();

/**
 * 📌 Obtener todos los hijos de la cuenta parental
 */
router.get("/", authenticateToken, getAllChildren);

/**
 * 📌 Obtener un hijo por ID
 */
router.get("/:id", authenticateToken, getChildById);

/**
 * 📌 Crear un nuevo hijo
 */
router.post("/", authenticateToken, createChild);

/**
 * 📌 Actualizar datos de un hijo
 */
router.put("/:id", authenticateToken, updateChild);

/**
 * 📌 Eliminar un hijo
 */
router.delete("/:id", authenticateToken, deleteChild);

export default router;
