// src/api/children/childController.js

import {
  fetchAllChildren,
  fetchChildById,
  createNewChild,
  updateExistingChild,
  removeChild,
} from "./childService.js";
import asyncHandler from "express-async-handler";
import { prisma } from "../../config/database.js"; //

/**
 * 📌 Obtener todos los hijos asociados a la cuenta parental del usuario autenticado
 */
export const getAllChildren = async (req, res) => {
  try {
    const children = await fetchAllChildren(req.user.parentalAccountId);
    res.status(200).json({ status: "success", data: children });
  } catch (error) {
    console.error("❌ Error al obtener los hijos:", error);
    res
      .status(500)
      .json({ status: "error", message: "Error al obtener los hijos." });
  }
};

/**
 * 📌 Obtener un hijo específico por ID
 */
export const getChildById = async (req, res) => {
  const { id } = req.params;

  try {
    const child = await fetchChildById(id);
    if (!child) {
      return res
        .status(404)
        .json({ status: "error", message: "Hijo no encontrado." });
    }
    res.status(200).json({ status: "success", data: child });
  } catch (error) {
    console.error("❌ Error al obtener el hijo:", error);
    res
      .status(500)
      .json({ status: "error", message: "Error interno del servidor." });
  }
};

/**
 * 📌 Crear un nuevo hijo (Solo padres con cuenta parental)
 */
export const createChild = asyncHandler(async (req, res) => {
  try {
    const { name, dateOfBirth, parentalAccountId } = req.body;

    if (!name || !dateOfBirth || !parentalAccountId) {
      return res.status(400).json({
        status: "error",
        message: "Todos los campos son obligatorios.",
      });
    }

    // ✅ Verificar si la cuenta parental existe
    const parentalAccount = await prisma.parentalAccount.findUnique({
      where: { id: Number(parentalAccountId) },
    });

    if (!parentalAccount) {
      return res.status(400).json({
        status: "error",
        message: "Cuenta parental no encontrada.",
      });
    }

    // ✅ Crear el hijo
    const newChild = await prisma.child.create({
      data: {
        name,
        dateOfBirth: new Date(dateOfBirth),
        parentalAccountId: Number(parentalAccountId),
      },
    });

    console.log("✅ Hijo creado con éxito:", newChild);
    res.status(201).json({
      status: "success",
      message: "Hijo creado correctamente.",
      data: newChild,
    });
  } catch (error) {
    console.error("❌ Error en createChild:", error);
    res.status(500).json({
      status: "error",
      message: "Error al crear el hijo.",
    });
  }
});

/**
 * 📌 Actualizar un hijo
 */
export const updateChild = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { name, dateOfBirth } = req.body;

    if (!id || isNaN(id)) {
      return res
        .status(400)
        .json({ status: "error", message: "ID no válido." });
    }

    // ✅ Convertir fecha a ISO-8601 antes de enviarla a Prisma
    const formattedDate = new Date(dateOfBirth).toISOString();

    const updatedChild = await prisma.child.update({
      where: { id: Number(id) },
      data: {
        name,
        dateOfBirth: formattedDate, // ✅ Ahora en formato correcto
      },
    });

    res.status(200).json({
      status: "success",
      message: "Hijo actualizado correctamente.",
      data: updatedChild,
    });
  } catch (error) {
    console.error("❌ Error en updateChild:", error);
    res
      .status(500)
      .json({ status: "error", message: "Error al actualizar el hijo." });
  }
});

/**
 * 📌 Eliminar un hijo
 */
export const deleteChild = async (req, res) => {
  const { id } = req.params;

  try {
    await removeChild(id);
    res
      .status(200)
      .json({ status: "success", message: "Hijo eliminado con éxito." });
  } catch (error) {
    console.error("❌ Error al eliminar el hijo:", error);
    res
      .status(500)
      .json({ status: "error", message: "Error al eliminar el hijo." });
  }
};
