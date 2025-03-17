// src/controllers/authController.js

import prisma from "../lib/prisma.js"; // Importar cliente de Prisma
import bcrypt from "bcryptjs"; // Hashing de contraseñas
import jwt from "jsonwebtoken"; // Manejo de tokens JWT

// Manejo de errores
const handleServerError = (res, message, error) => {
  console.error(message, error);
  return res.status(500).json({ status: "error", message });
};

// Obtener usuario por email
const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email },
    include: { role: true }, // Incluir el rol para obtener su nombre
  });
};

// Manejo del inicio de sesión
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "Usuario no encontrado." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ status: "error", message: "Contraseña incorrecta." });
    }

    const token = jwt.sign(
      { userId: user.id, roleId: user.roleId },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      status: "success",
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        roleName: user.role.name, // Devolver el nombre del rol
      },
    });
  } catch (error) {
    handleServerError(res, "Error en el inicio de sesión:", error);
  }
};

// Manejo del registro de nuevos usuarios
export const register = async (req, res) => {
  const { firstName, lastName, email, password, phone, role } = req.body;

  // Validación de campos requeridos
  if (!firstName || !lastName || !email || !password || !phone || !role) {
    return res
      .status(400)
      .json({ status: "error", message: "Todos los campos son requeridos." });
  }

  try {
    const existingUser = await findUserByEmail(email); // Verificar si el correo ya está en uso
    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "El correo electrónico ya está en uso.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash de la contraseña
    const roleRecord = await prisma.role.findUnique({ where: { name: role } });

    if (!roleRecord) {
      return res
        .status(400)
        .json({ status: "error", message: "Rol no encontrado." });
    }

    // Crear el nuevo usuario en la base de datos
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phone,
        roleId: roleRecord.id,
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

// Lógica para obtener la información del usuario autenticado
export const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: {
        role: true, // Incluir el rol para obtener el nombre
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
        roleName: user.role.name, // Devolver el nombre del rol
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
