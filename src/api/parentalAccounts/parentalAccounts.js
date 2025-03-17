// src/api/parentalAccounts/parentalAccounts.js

import express from "express";
import {
  getAllParentalAccounts,
  getParentalAccountById,
  createParentalAccount,
  updateParentalAccount,
  deleteParentalAccount,
  addChildToParentalAccount,
} from "../../controllers/parentalAccountController.js";

const router = express.Router();

router.get("/", getAllParentalAccounts);
router.get("/:id", getParentalAccountById);
router.post("/", createParentalAccount);
router.put("/:id", updateParentalAccount);
router.delete("/:id", deleteParentalAccount);
router.post("/:parentalAccountId/children", addChildToParentalAccount);

router.post("/:id/children", async (req, res) => {
  const { id } = req.params; // ID de la cuenta parental
  const { childId } = req.body; // ID del niño a agregar

  try {
    console.log(
      `🔍 Agregando hijo con ID ${childId} a la cuenta parental ${id}`
    );

    // Verificar si la cuenta parental existe
    const parentalAccount = await prisma.parentalAccount.findUnique({
      where: { id: Number(id) },
    });

    if (!parentalAccount) {
      console.error(`❌ Cuenta parental con ID ${id} no encontrada.`);
      return res.status(404).json({
        status: "error",
        message: "Cuenta parental no encontrada",
      });
    }

    // Verificar si el niño existe
    const child = await prisma.child.findUnique({
      where: { id: Number(childId) },
    });

    if (!child) {
      console.error(`❌ Niño con ID ${childId} no encontrado.`);
      return res.status(404).json({
        status: "error",
        message: "Niño no encontrado",
      });
    }

    // Agregar el hijo a la cuenta parental
    const updatedChild = await prisma.child.update({
      where: { id: Number(childId) },
      data: { parentalAccountId: Number(id) },
    });

    console.log(
      `✅ Hijo ${childId} agregado correctamente a la cuenta parental ${id}`
    );

    return res.status(200).json({
      status: "success",
      message: "Hijo agregado a la cuenta parental",
      data: updatedChild,
    });
  } catch (error) {
    console.error("❌ Error interno del servidor:", error);
    res.status(500).json({
      status: "error",
      message: "Error interno del servidor.",
      details: error.message, // 👀 Muestra detalles del error
    });
  }
});

export default router;
