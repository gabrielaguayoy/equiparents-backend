// src/routes/index.js
import express from "express";
import userRoutes from "../api/users/users.js";
import rolesRoutes from "../api/roles/roles.js";
import childrenRoutes from "../api/children/children.js";
import parentalAccountsRoutes from "../api/parentalAccounts/parentalAccounts.js";

const router = express.Router();

// Centralizamos todas las rutas de la API
router.use("/users", userRoutes);
router.use("/roles", rolesRoutes);
router.use("/children", childrenRoutes);
router.use("/parental-accounts", parentalAccountsRoutes);

export default router;
