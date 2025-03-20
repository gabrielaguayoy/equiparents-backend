// src/api/parentalAccounts/inviteRoutes.js

import express from "express";
import { sendInvitation, acceptInvitation } from "./inviteController.js";
import { authenticateToken } from "../../middleware/authenticate.js";

const router = express.Router();

/**
 * 📌 Enviar una invitación a otro progenitor
 */
router.post("/send", authenticateToken, sendInvitation);

/**
 * 📌 Aceptar una invitación con código
 */
router.post("/accept", acceptInvitation);

export default router;
