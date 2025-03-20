// src/api/parentalAccounts/parentalService.js
import { prisma } from "../config/database.js";

/**
 * 📌 Genera un nombre único para una cuenta parental.
 * @returns {string} Nombre único basado en un string aleatorio y año actual.
 */
export const generateUniqueAccountName = () => {
  const randomStr = Math.random().toString(36).substring(2, 7);
  const year = new Date().getFullYear().toString().slice(-2);
  return `EQP-${randomStr}.${year}`;
};

/**
 * 📌 Crea una nueva cuenta parental o asocia a un usuario con una existente
 * @param {number} userId - ID del usuario que crea la cuenta parental
 * @param {string|null} inviteCode - Código de invitación opcional
 */
export const createParentalAccount = async (userId, inviteCode = null) => {
  try {
    return await prisma.$transaction(async (prisma) => {
      if (inviteCode) {
        const existingAccount = await prisma.parentalAccount.findUnique({
          where: { inviteCode },
        });
        if (!existingAccount) throw new Error("Código de invitación inválido.");

        return await prisma.user.update({
          where: { id: userId },
          data: { parentalAccountId: existingAccount.id },
        });
      }

      const uniqueName = generateUniqueAccountName();
      return await prisma.parentalAccount.create({
        data: {
          name: uniqueName,
          users: { connect: { id: userId } },
          inviteCode: Math.random().toString(36).substring(2, 10).toUpperCase(),
        },
      });
    });
  } catch (error) {
    console.error("❌ Error creando cuenta parental:", error);
    throw new Error("Error al crear cuenta parental");
  }
};
