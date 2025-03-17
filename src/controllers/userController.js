// src/controllers/userController.js

import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs"; // Asegúrate de importar bcrypt si se utiliza para el registro

const handleServerError = (res, message, error) => {
  console.error(message, error);
  return res.status(500).json({ status: "error", message });
};

// Función para validar la existencia del usuario
const validateExistingUser = async (email) => {
  return (await prisma.user.findUnique({ where: { email } })) ? true : false;
};

// Función para obtener un rol por nombre
const getRoleByName = async (role) => {
  return await prisma.role.findUnique({ where: { name: role } });
};

// Obtener la información de un usuario autenticado
export const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: {
        role: true,
        parentalAccount: true, // 🔥 Asegurar que el backend devuelve la cuenta parental
      },
    });

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "Usuario no encontrado." });
    }

    res.status(200).json({
      status: "success",
      data: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        roleName: user.role.name,
        parentalAccountId: user.parentalAccountId,
        parentalAccount: user.parentalAccount, // ✅ Enviar el objeto completo
      },
    });
  } catch (error) {
    handleServerError(
      res,
      "Error al obtener la información del usuario:",
      error
    );
  }
};

// Obtener todos los usuarios
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        parentalAccountId: true, // Incluyendo parentalAccountId
        role: {
          select: { name: true }, // Solo obtener el nombre del rol
        },
      },
    });

    const formattedUsers = users.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      parentalAccountId: user.parentalAccountId,
      roleName: user.role ? user.role.name : "Desconocido", // Asegúrate de manejar el caso 'undefined'
    }));

    res.status(200).json({ status: "success", data: formattedUsers });
  } catch (error) {
    handleServerError(res, "Error al obtener usuarios:", error);
  }
};

// Obtener la información de un usuario específico
export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      include: { role: true }, // Incluir rol para obtener el nombre
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: { select: { name: true } }, // Obtener solo el nombre del rol
      },
    });

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "Usuario no encontrado." });
    }

    res
      .status(200)
      .json({ status: "success", data: { ...user, role: user.role.name } });
  } catch (error) {
    handleServerError(res, "Error al obtener el usuario:", error);
  }
};

// Registrar un nuevo usuario
export const registerUser = async (req, res) => {
  const { firstName, lastName, email, password, phone, role, invitationCode } =
    req.body;

  // Validación de campos requeridos
  if (!firstName || !lastName || !email || !password || !phone || !role) {
    return res
      .status(400)
      .json({ status: "error", message: "Todos los campos son requeridos." });
  }

  try {
    if (await validateExistingUser(email)) {
      return res.status(400).json({
        status: "error",
        message: "El correo electrónico ya está en uso.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const roleRecord = await getRoleByName(role);
    if (!roleRecord) {
      return res
        .status(400)
        .json({ status: "error", message: "Rol no encontrado." });
    }

    let parentalAccountId = null;

    // Función para generar un nombre de cuenta único
    const generateUniqueAccountName = () => {
      const randomStr = Math.random().toString(36).substring(2, 7); // Generar 5 caracteres aleatorios
      const year = new Date().getFullYear().toString().slice(-2); // Últimos dos dígitos del año
      return `${randomStr}.${year}`;
    };

    const uniqueName = generateUniqueAccountName(); // Implementa esta función

    // Lógica para crear cuentas parentales
    if (roleRecord.name === "parent") {
      const parentalAccount = await prisma.parentalAccount.create({
        data: {
          name: uniqueName,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      parentalAccountId = parentalAccount.id; // Asociar el nuevo usuario a la cuenta parental
    } else if (invitationCode) {
      const parentAccount = await prisma.parentalAccount.findUnique({
        where: { invitationCode },
      });
      if (!parentAccount) {
        return res.status(400).json({
          status: "error",
          message: "Código de invitación no válido.",
        });
      }
      parentalAccountId = parentAccount.id; // Asignar parentalAccountId solo si se encontró
    }

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phone,
        roleId: roleRecord.id,
        parentalAccountId,
      },
    });

    res.status(201).json({
      status: "success",
      message: "Usuario creado exitosamente",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        roleId: user.roleId,
      },
    });
  } catch (error) {
    handleServerError(res, "Error al crear el usuario:", error);
  }
};

// Actualizar un usuario
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, phone, roleId } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        firstName,
        lastName,
        email,
        phone,
        roleId,
        updatedAt: new Date(),
      },
    });
    res.status(200).json({
      status: "success",
      message: "Usuario actualizado con éxito",
      user: updatedUser,
    });
  } catch (error) {
    handleServerError(res, "Error al actualizar el usuario:", error);
  }
};

// Eliminar un usuario
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.user.delete({ where: { id: Number(id) } });
    res
      .status(200)
      .json({ status: "success", message: "Usuario eliminado con éxito" });
  } catch (error) {
    handleServerError(res, "Error al eliminar el usuario:", error);
  }
};
