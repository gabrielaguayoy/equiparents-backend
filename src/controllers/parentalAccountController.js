// src/controllers/parentalAccountController.js

import prisma from "../lib/prisma.js";
import asyncHandler from "express-async-handler"; // Manejo automático de errores

// Obtener todas las cuentas parentales
export const getAllParentalAccounts = asyncHandler(async (req, res) => {
  const parentalAccounts = await prisma.parentalAccount.findMany({
    include: { users: true, children: true },
  });

  res.status(200).json({ status: "success", data: parentalAccounts });
});

// Obtener una cuenta parental por ID
export const getParentalAccountById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const parentalAccount = await prisma.parentalAccount.findUnique({
    where: { id: Number(id) },
    include: { users: true, children: true },
  });

  if (!parentalAccount) {
    res
      .status(404)
      .json({ status: "error", message: "Cuenta parental no encontrada" });
    return;
  }

  res.status(200).json({ status: "success", data: parentalAccount });
});

// Generar un nombre único para la cuenta parental
const generateUniqueAccountName = () => {
  const randomStr = Math.random().toString(36).substring(2, 7);
  const year = new Date().getFullYear().toString().slice(-2);
  return `${randomStr}.${year}`;
};

// Crear una nueva cuenta parental
export const createParentalAccount = asyncHandler(async (req, res) => {
  const uniqueName = generateUniqueAccountName();

  const newParentalAccount = await prisma.parentalAccount.create({
    data: { name: uniqueName },
  });

  res.status(201).json({
    status: "success",
    message: "Cuenta parental creada exitosamente",
    data: newParentalAccount,
  });
});

// Actualizar una cuenta parental
export const updateParentalAccount = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body; // Solo permitimos actualizar el `name`

  const updatedAccount = await prisma.parentalAccount.update({
    where: { id: Number(id) },
    data: { name, updatedAt: new Date() },
  });

  res.status(200).json({
    status: "success",
    message: "Cuenta parental actualizada con éxito",
    data: updatedAccount,
  });
});

// Eliminar una cuenta parental
export const deleteParentalAccount = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await prisma.parentalAccount.delete({
    where: { id: Number(id) },
  });

  res.status(200).json({
    status: "success",
    message: "Cuenta parental eliminada con éxito",
  });
});

// Agregar hijo a una cuenta parental
export const addChildToParentalAccount = async (req, res) => {
  const { parentalAccountId } = req.params; // Obtener ID de cuenta parental
  const { childId } = req.body; // Obtener ID del hijo

  try {
    // Verificar si la cuenta parental existe
    const parentalAccount = await prisma.parentalAccount.findUnique({
      where: { id: Number(parentalAccountId) },
    });

    if (!parentalAccount) {
      return res
        .status(404)
        .json({ status: "error", message: "Cuenta parental no encontrada." });
    }

    // Actualizar el hijo para que pertenezca a la cuenta parental
    const updatedChild = await prisma.child.update({
      where: { id: Number(childId) },
      data: { parentalAccountId: parentalAccount.id },
    });

    return res.status(200).json({
      status: "success",
      message: "Hijo agregado a la cuenta parental con éxito.",
      data: updatedChild,
    });
  } catch (error) {
    console.error("Error al agregar hijo a la cuenta parental:", error);
    res
      .status(500)
      .json({ status: "error", message: "Error interno del servidor." });
  }
};
