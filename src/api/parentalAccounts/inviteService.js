// src/api/parentalAccounts/inviteService.js

import { prisma } from "../config/database.js";
import crypto from "crypto";

/**
 * 📌 Genera un código de invitación único (con verificación de colisión)
 */
const generateInvitationCode = async () => {
  let code;
  let exists;

  do {
    code = crypto.randomBytes(5).toString("hex");
    exists = await prisma.invitation.findUnique({
      where: { invitationCode: code },
    });
  } while (exists);

  return code;
};

/**
 * 📌 Crea una invitación para un progenitor
 */
export const createInvitation = async (email, firstName, parentalAccountId) => {
  try {
    const invitationCode = await generateInvitationCode();

    const invitation = await prisma.invitation.create({
      data: {
        email,
        firstName,
        invitationCode,
        parentalAccountId,
        createdAt: new Date(),
      },
    });

    return invitation;
  } catch (error) {
    console.error("❌ Error al crear la invitación:", error);
    throw new Error("No se pudo generar la invitación.");
  }
};

/**
 * 📌 Valida si un código de invitación es válido
 */
export const validateInvitationCode = async (invitationCode, email) => {
  try {
    const invitation = await prisma.invitation.findFirst({
      where: { invitationCode, email },
    });

    return invitation ? invitation.parentalAccountId : null;
  } catch (error) {
    console.error("❌ Error al validar la invitación:", error);
    throw new Error("Error al validar la invitación.");
  }
};

/**
 * 📌 Vincula un usuario a una cuenta parental tras aceptar la invitación
 */
export const linkUserToParentalAccount = async (email, parentalAccountId) => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new Error("Usuario no encontrado.");
    }

    return await prisma.user.update({
      where: { email },
      data: { parentalAccountId },
    });
  } catch (error) {
    console.error("❌ Error al vincular usuario a la cuenta parental:", error);
    throw new Error("Error al vincular usuario a la cuenta parental.");
  }
};
