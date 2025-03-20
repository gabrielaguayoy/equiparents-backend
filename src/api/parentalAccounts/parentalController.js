// src/api/parentalAccounts/parentalController.js
import { prisma } from "../config/database.js";
import asyncHandler from "express-async-handler";
import {
  generateUniqueAccountName,
  createParentalAccount as createParentalAccountService,
} from "./parentalService.js";

/**
 * 📌 Obtener todas las cuentas parentales
 */
export const getAllParentalAccounts = asyncHandler(async (req, res) => {
  try {
    const accounts = await prisma.parentalAccount.findMany({
      include: {
        users: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        children: true,
      },
    });

    return res.status(200).json({ status: "success", data: accounts });
  } catch (error) {
    console.error("❌ Error al obtener cuentas parentales:", error);
    res.status(500).json({
      status: "error",
      message: "Error al obtener cuentas parentales.",
    });
  }
});

/**
 * 📌 Crear una nueva cuenta parental
 */
export const createParentalAccount = asyncHandler(async (req, res) => {
  try {
    const { userId, inviteCode } = req.body;

    if (!userId) {
      return res
        .status(400)
        .json({ status: "error", message: "Falta userId en la solicitud." });
    }

    const newAccount = await createParentalAccountService(userId, inviteCode);

    return res.status(201).json({
      status: "success",
      message: "Cuenta parental creada exitosamente",
      data: newAccount,
    });
  } catch (error) {
    console.error("❌ Error al crear cuenta parental:", error);
    res
      .status(500)
      .json({ status: "error", message: "Error al crear cuenta parental." });
  }
});

/**
 * 📌 Obtener una cuenta parental por ID.
 */
export const getParentalAccountById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const account = await prisma.parentalAccount.findUnique({
      where: { id: Number(id) },
      include: { users: true, children: true },
    });

    if (!account) {
      return res
        .status(404)
        .json({ status: "error", message: "Cuenta parental no encontrada." });
    }

    return res.status(200).json({ status: "success", data: account });
  } catch (error) {
    console.error("❌ Error al obtener cuenta parental:", error);
    res
      .status(500)
      .json({ status: "error", message: "Error interno del servidor." });
  }
});

/**
 * 📌 Eliminar una cuenta parental.
 */
export const deleteParentalAccount = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.parentalAccount.delete({ where: { id: Number(id) } });
    return res.status(200).json({
      status: "success",
      message: "Cuenta parental eliminada correctamente.",
    });
  } catch (error) {
    console.error("❌ Error al eliminar cuenta parental:", error);
    res.status(500).json({
      status: "error",
      message: "Error al eliminar la cuenta parental.",
    });
  }
});

/**
 * 📩 Invitar a otro padre a la cuenta parental
 */
export const inviteParent = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const { parentalAccountId } = req.user; // Asegurar que el usuario está autenticado y tiene cuenta parental

  if (!email) {
    return res
      .status(400)
      .json({ status: "error", message: "El correo es obligatorio." });
  }

  try {
    // Verificar si el usuario ya está registrado
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ status: "error", message: "El usuario ya está registrado." });
    }

    // Generar código de invitación único
    const invitationCode = Math.random()
      .toString(36)
      .substring(2, 10)
      .toUpperCase();

    // Guardar la invitación en la base de datos
    await prisma.invitation.create({
      data: {
        email,
        parentalAccountId,
        invitationCode,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Expira en 7 días
      },
    });

    console.log(
      `📩 Invitación enviada a ${email} con código: ${invitationCode}`
    );

    res.status(200).json({
      status: "success",
      message: "Invitación enviada correctamente.",
      invitationCode,
    });
  } catch (error) {
    console.error("❌ Error al invitar a otro padre:", error);
    res
      .status(500)
      .json({ status: "error", message: "Error al enviar la invitación." });
  }
});

/**
 * 📌 Actualizar una cuenta parental
 */
export const updateParentalAccount = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id || isNaN(id)) {
      return res
        .status(400)
        .json({ status: "error", message: "ID de cuenta parental no válido." });
    }

    const updatedAccount = await prisma.parentalAccount.update({
      where: { id: Number(id) },
      data: { ...updateData, updatedAt: new Date() },
    });

    res.status(200).json({
      status: "success",
      message: "Cuenta parental actualizada correctamente.",
      data: updatedAccount,
    });
  } catch (error) {
    console.error("❌ Error al actualizar cuenta parental:", error);
    res.status(500).json({
      status: "error",
      message: "Error al actualizar la cuenta parental.",
    });
  }
});
