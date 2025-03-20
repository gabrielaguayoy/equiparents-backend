// src/api/users/userController.js
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import { validateExistingUser, getRoleByName } from "./userService.js";
import { prisma } from "../config/database.js";
import { handleServerError } from "../utils/errorHandler.js";

/**
 * 📌 Obtener la información del usuario autenticado
 */
export const getMe = asyncHandler(async (req, res) => {
  try {
    console.log("🔍 Buscando datos del usuario autenticado...");
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: { role: true, parentalAccount: true }, // 🔥 Asegurar que parentalAccount se incluya
    });

    if (!user) {
      console.warn("⚠️ Usuario no encontrado.");
      return res
        .status(404)
        .json({ status: "error", message: "Usuario no encontrado." });
    }

    console.log("✅ Usuario encontrado:", user.email);
    res.status(200).json({
      status: "success",
      data: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        roleName: user.role?.name || "unknown",
        parentalAccountId: user.parentalAccountId, // ✅ Asegurar que esto se incluya
      },
    });
  } catch (error) {
    handleServerError(res, "Error en getMe", error);
  }
});

/**
 * 📌 Registrar un nuevo usuario con validación mejorada
 */
export const registerUser = asyncHandler(async (req, res) => {
  try {
    console.log("📝 Valores recibidos en req.body:", req.body);

    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      roleName,
      accountOption,
      invitationCode,
    } = req.body;

    console.log("🔍 Evaluando accountOption:", accountOption);

    if (!firstName || !lastName || !email || !password || !phone || !roleName) {
      return res.status(400).json({
        status: "error",
        message: "Todos los campos son obligatorios.",
      });
    }

    const role = await getRoleByName(roleName);
    if (!role) {
      return res.status(400).json({
        status: "error",
        message: "Rol no válido.",
      });
    }

    let parentalAccountId = null;

    if (role.name.toLowerCase() === "parent") {
      console.log(
        "🟢 Usuario registrado como PARENT. Evaluando cuenta parental..."
      );

      if (accountOption === "create") {
        console.log("🆕 Creando nueva cuenta parental...");
        const newAccount = await prisma.parentalAccount.create({
          data: { name: `Parental-${Date.now()}` },
        });
        parentalAccountId = newAccount.id;
        console.log(
          "✅ Nueva cuenta parental creada con ID:",
          parentalAccountId
        );
      } else if (accountOption === "use-code" && invitationCode) {
        console.log("🔍 Buscando cuenta parental con código de invitación...");
        const parentAccount = await prisma.parentalAccount.findFirst({
          where: { invitationCode },
        });

        if (!parentAccount) {
          return res.status(400).json({
            status: "error",
            message: "Código de invitación no válido.",
          });
        }
        parentalAccountId = parentAccount.id;
        console.log(
          "✅ Usuario asociado a cuenta parental con ID:",
          parentalAccountId
        );
      }
    }

    console.log("🆕 Creando usuario en la base de datos...");
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: await bcrypt.hash(password, 10),
        phone,
        roleId: role.id,
        parentalAccountId,
      },
    });

    res.status(201).json({
      status: "success",
      message: "Usuario registrado",
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        phone: newUser.phone,
        roleName: role.name,
        parentalAccountId: newUser.parentalAccountId,
      },
    });
  } catch (error) {
    handleServerError(res, "Error en el registro de usuario", error);
  }
});

/**
 * 📌 Obtener todos los usuarios (Solo Admin)
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  try {
    console.log("🔍 Cargando usuarios desde la base de datos...");
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: { select: { name: true } },
      },
    });

    res.status(200).json({
      status: "success",
      data: users.map((user) => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        roleName: user.role?.name || "Desconocido",
      })),
    });
  } catch (error) {
    handleServerError(res, "Error al obtener usuarios", error);
  }
});

/**
 * 📌 Eliminar un usuario (Solo Admin)
 */
export const deleteUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id: Number(id) } });

    res
      .status(200)
      .json({ status: "success", message: "Usuario eliminado con éxito" });
  } catch (error) {
    handleServerError(res, "Error al eliminar el usuario", error);
  }
});

/**
 * 📌 Obtener un usuario por ID
 */
export const getUserById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res
        .status(400)
        .json({ status: "error", message: "ID de usuario no válido." });
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        parentalAccountId: true,
        role: { select: { name: true } },
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
        roleName: user.role?.name || "Desconocido",
        parentalAccountId: user.parentalAccountId,
      },
    });
  } catch (error) {
    handleServerError(res, "Error al obtener el usuario", error);
  }
});

/**
 * 📌 Actualizar usuario
 */
export const updateUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, phone, roleId } = req.body;

    if (!id || isNaN(id)) {
      return res
        .status(400)
        .json({ status: "error", message: "ID de usuario no válido." });
    }

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
    handleServerError(res, "Error en updateUser", error);
  }
});
