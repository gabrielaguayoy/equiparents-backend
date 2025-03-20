// src/api/children/childService.js

import { prisma } from "../../config/database.js";

/**
 * 📌 Obtener todos los hijos de una cuenta parental
 */
export const fetchAllChildren = async (parentalAccountId) => {
  return await prisma.child.findMany({
    where: { parentalAccountId },
    select: { id: true, name: true, dateOfBirth: true },
  });
};

/**
 * 📌 Obtener un hijo por ID
 */
export const fetchChildById = async (id) => {
  return await prisma.child.findUnique({
    where: { id: Number(id) },
    select: {
      id: true,
      name: true,
      dateOfBirth: true,
      parentalAccountId: true,
    },
  });
};

/**
 * 📌 Crear un nuevo hijo
 */
export const createNewChild = async (
  name,
  dateOfBirth,
  parentalAccountId,
  userId
) => {
  return await prisma.child.create({
    data: { name, dateOfBirth, parentalAccountId, userId },
  });
};

/**
 * 📌 Actualizar los datos de un hijo
 */
export const updateExistingChild = async (id, updateData) => {
  return await prisma.child.update({
    where: { id: Number(id) },
    data: { ...updateData, updatedAt: new Date() },
  });
};

/**
 * 📌 Eliminar un hijo por ID
 */
export const removeChild = async (id) => {
  return await prisma.child.delete({ where: { id: Number(id) } });
};
