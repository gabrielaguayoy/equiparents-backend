// src/api/roles/roleController.js

import asyncHandler from "express-async-handler";
import {
  getAllRoles as fetchAllRoles,
  getRoleById as fetchRoleById,
  createRole as addRole,
  updateRole as modifyRole,
  deleteRole as removeRole,
} from "./roleService.js";

/**
 * 📌 Obtener todos los roles
 */
export const getAllRoles = asyncHandler(async (req, res) => {
  const roles = await fetchAllRoles();
  res.status(200).json({ status: "success", data: roles });
});

/**
 * 📌 Obtener un rol por ID
 */
export const getRoleById = asyncHandler(async (req, res) => {
  const role = await fetchRoleById(req.params.id);
  if (!role) {
    return res
      .status(404)
      .json({ status: "error", message: "Rol no encontrado" });
  }
  res.status(200).json({ status: "success", data: role });
});

/**
 * 📌 Crear un nuevo rol
 */
export const createRole = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    return res
      .status(400)
      .json({ status: "error", message: "Nombre y descripción requeridos" });
  }

  const newRole = await addRole({ name, description });
  res.status(201).json({
    status: "success",
    message: "Rol creado exitosamente",
    data: newRole,
  });
});

/**
 * 📌 Actualizar un rol
 */
export const updateRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  if (!name && !description) {
    return res.status(400).json({
      status: "error",
      message: "Debe proporcionar datos para actualizar",
    });
  }

  const updatedRole = await modifyRole(id, { name, description });
  res.status(200).json({
    status: "success",
    message: "Rol actualizado exitosamente",
    data: updatedRole,
  });
});

/**
 * 📌 Eliminar un rol
 */
export const deleteRole = asyncHandler(async (req, res) => {
  await removeRole(req.params.id);
  res
    .status(200)
    .json({ status: "success", message: "Rol eliminado exitosamente" });
});
