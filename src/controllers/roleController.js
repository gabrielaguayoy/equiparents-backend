// src/controllers/roles.js

import prisma from "../lib/prisma.js"; // Importar el cliente de Prisma

// Obtener todos los roles
export const getAllRoles = async (req, res) => {
  try {
    const roles = await prisma.role.findMany(); // Obtener todos los roles de la base de datos
    res.status(200).json({ status: "success", data: roles }); // Devuelve la lista de roles
  } catch (error) {
    console.error("Error al obtener roles:", error);
    res
      .status(500)
      .json({ status: "error", message: "Error al obtener roles" }); // Manejo de errores
  }
};

// Obtener un rol específico por ID
export const getRoleById = async (req, res) => {
  const { id } = req.params; // Obtener el ID desde los parámetros

  try {
    const role = await prisma.role.findUnique({
      where: { id: Number(id) },
    });

    if (!role) {
      return res
        .status(404)
        .json({ status: "error", message: "Rol no encontrado" });
    }

    res.status(200).json({ status: "success", data: role }); // Devuelve la información del rol
  } catch (error) {
    console.error("Error al obtener el rol:", error);
    res
      .status(500)
      .json({ status: "error", message: "Error al obtener el rol" });
  }
};

// Crear un nuevo rol
export const createRole = async (req, res) => {
  const { name, description } = req.body; // Captura los datos necesarios

  if (!name || !description) {
    return res.status(400).json({
      status: "error",
      message: "Nombre y descripción son requeridos",
    });
  }

  try {
    const role = await prisma.role.create({
      data: {
        name,
        description, // Puedes incluir más campos según tu modelo de datos
      },
    });
    res.status(201).json({
      status: "success",
      message: "Rol creado exitosamente",
      data: role,
    }); // Devuelve el nuevo rol creado
  } catch (error) {
    console.error("Error al crear el rol:", error);
    res.status(500).json({ status: "error", message: "Error al crear el rol" });
  }
};

// Actualizar un rol
export const updateRole = async (req, res) => {
  const { id } = req.params; // Obtener el ID desde los parámetros
  const { name, description } = req.body; // Obtener los nuevos datos

  if (!name && !description) {
    return res.status(400).json({
      status: "error",
      message: "Es necesario proporcionar al menos un campo para actualizar",
    });
  }

  try {
    const updatedRole = await prisma.role.update({
      where: { id: Number(id) },
      data: {
        ...(name !== undefined && { name }), // Solo actualiza si se proporciona un nuevo nombre
        ...(description !== undefined && { description }), // Solo actualiza si se proporciona una nueva descripción
      },
    });
    res.status(200).json({
      status: "success",
      message: "Rol actualizado con éxito",
      data: updatedRole,
    });
  } catch (error) {
    console.error("Error al actualizar el rol:", error);
    res
      .status(500)
      .json({ status: "error", message: "Error al actualizar el rol" });
  }
};

// Eliminar un rol
export const deleteRole = async (req, res) => {
  const { id } = req.params; // Obtener el ID desde los parámetros

  try {
    await prisma.role.delete({
      where: { id: Number(id) },
    });
    res
      .status(200)
      .json({ status: "success", message: "Rol eliminado con éxito" });
  } catch (error) {
    console.error("Error al eliminar el rol:", error);
    res
      .status(500)
      .json({ status: "error", message: "Error al eliminar el rol" });
  }
};
