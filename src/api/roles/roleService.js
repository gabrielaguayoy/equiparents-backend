// src/api/roles/roleService.js

import { prisma } from "../config/database.js";

/**
 * 📌 Obtener todos los roles
 * @returns {Promise<Array>} - Lista de roles
 */
export const getAllRoles = async () => {
  return prisma.role.findMany();
};

/**
 * 📌 Obtener un rol por ID
 * @param {number} id - ID del rol
 * @returns {Promise<Object|null>} - Rol encontrado o `null` si no existe
 */
export const getRoleById = async (id) => {
  return prisma.role.findUnique({
    where: { id: Number(id) },
  });
};

/**
 * 📌 Crear un nuevo rol
 * @param {Object} roleData - Datos del rol
 * @returns {Promise<Object>} - Rol creado
 */
export const createRole = async (roleData) => {
  return prisma.role.create({
    data: roleData,
  });
};

/**
 * 📌 Actualizar un rol por ID
 * @param {number} id - ID del rol
 * @param {Object} roleData - Datos a actualizar
 * @returns {Promise<Object>} - Rol actualizado
 */
export const updateRole = async (id, roleData) => {
  return prisma.role.update({
    where: { id: Number(id) },
    data: roleData,
  });
};

/**
 * 📌 Eliminar un rol por ID
 * @param {number} id - ID del rol
 * @returns {Promise<Object>} - Confirmación de eliminación
 */
export const deleteRole = async (id) => {
  return prisma.role.delete({
    where: { id: Number(id) },
  });
};
