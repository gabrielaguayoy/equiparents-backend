// src/controllers/childController.js

import prisma from "../lib/prisma.js";

// ✅ Función para manejar errores del servidor
const handleServerError = (res, message, error) => {
  console.error(`❌ ${message}`, error);
  return res.status(500).json({ status: "error", message });
};

// 📌 Obtener todos los hijos
export const getAllChildren = async (req, res) => {
  try {
    const children = await prisma.child.findMany({
      select: {
        id: true,
        name: true,
        dateOfBirth: true,
        parentalAccountId: true,
        userId: true,
      },
    });
    res.status(200).json({ status: "success", data: children });
  } catch (error) {
    handleServerError(res, "Error al obtener los hijos.", error);
  }
};

// 📌 Obtener un hijo por ID
export const getChildById = async (req, res) => {
  const { id } = req.params;

  try {
    const child = await prisma.child.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        name: true,
        dateOfBirth: true,
        parentalAccountId: true,
        userId: true,
      },
    });

    if (!child) {
      return res.status(404).json({
        status: "error",
        message: `Hijo con ID ${id} no encontrado.`,
      });
    }

    res.status(200).json({ status: "success", data: child });
  } catch (error) {
    handleServerError(res, "Error al obtener el hijo.", error);
  }
};

// 📌 Crear un nuevo hijo
export const createChild = async (req, res) => {
  const { name, dateOfBirth, parentalAccountId, userId } = req.body;

  try {
    if (!name || !dateOfBirth || !parentalAccountId || !userId) {
      return res.status(400).json({
        status: "error",
        message: "Todos los campos son requeridos.",
      });
    }

    const formattedDate = new Date(dateOfBirth); // ✅ Convertir string a Date

    if (isNaN(formattedDate.getTime())) {
      return res.status(400).json({
        status: "error",
        message: "Fecha de nacimiento inválida. Use el formato YYYY-MM-DD.",
      });
    }

    const child = await prisma.child.create({
      data: {
        name,
        dateOfBirth: formattedDate, // ✅ Usar Date en vez de string
        parentalAccountId,
        userId,
      },
    });

    res.status(201).json({
      status: "success",
      message: "Hijo creado exitosamente",
      data: child,
    });
  } catch (error) {
    console.error("Error al crear el hijo:", error);
    res.status(500).json({
      status: "error",
      message: "Error al crear el hijo",
    });
  }
};

// 📌 Actualizar datos de un hijo
export const updateChild = async (req, res) => {
  const { id } = req.params;
  const { name, dateOfBirth } = req.body;

  try {
    const child = await prisma.child.update({
      where: { id: Number(id) },
      data: {
        ...(name && { name }),
        ...(dateOfBirth && { dateOfBirth: new Date(dateOfBirth) }),
      },
    });

    res.status(200).json({
      status: "success",
      message: "Hijo actualizado con éxito",
      data: child,
    });
  } catch (error) {
    handleServerError(res, "Error al actualizar el hijo.", error);
  }
};

// 📌 Eliminar un hijo
export const deleteChild = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.child.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({
      status: "success",
      message: "Hijo eliminado con éxito",
    });
  } catch (error) {
    handleServerError(res, "Error al eliminar el hijo.", error);
  }
};
