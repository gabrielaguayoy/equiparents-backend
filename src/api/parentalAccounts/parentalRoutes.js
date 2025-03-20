// src/api/parentalAccounts/parentalRoutes.js
import express from "express";
import {
  getAllParentalAccounts,
  getParentalAccountById,
  createParentalAccount,
  updateParentalAccount, // ✅ Ahora correctamente exportado en parentalController.js
  deleteParentalAccount,
  inviteParent,
} from "./parentalController.js";
import { authenticateToken } from "../middleware/authenticate.js";

const router = express.Router();

/**
 * 📌 Rutas Protegidas (Requieren autenticación)
 */
router.use(authenticateToken);

/**
 * 📌 Rutas de Cuentas Parentales
 */
router.get("/", getAllParentalAccounts);
router.get("/:id", getParentalAccountById);
router.post("/", createParentalAccount);
router.post("/invite", inviteParent);
router.put("/:id", updateParentalAccount); // ✅ Ahora correctamente enlazado
router.delete("/:id", deleteParentalAccount);

export default router;
