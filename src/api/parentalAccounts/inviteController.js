// src/api/parentalAccounts/inviteController.js

import {
  createInvitation,
  validateInvitationCode,
  linkUserToParentalAccount,
} from "./inviteService.js";

/**
 * 📌 Enviar una invitación a otro progenitor
 */
export const sendInvitation = async (req, res) => {
  try {
    const { email, firstName } = req.body;
    const user = req.user; // Usuario autenticado

    // 🔍 Validaciones
    if (!user?.parentalAccountId) {
      return res.status(403).json({
        status: "error",
        message:
          "Debes tener una cuenta parental para invitar a otro progenitor.",
      });
    }

    if (!email || !firstName) {
      return res.status(400).json({
        status: "error",
        message: "El email y el nombre son obligatorios.",
      });
    }

    // 🚀 Crear la invitación
    const invitation = await createInvitation(
      email,
      firstName,
      user.parentalAccountId
    );

    return res.status(200).json({
      status: "success",
      message: "Invitación enviada exitosamente.",
      data: invitation,
    });
  } catch (error) {
    console.error("❌ Error al enviar la invitación:", error);
    return res.status(500).json({
      status: "error",
      message: "No se pudo enviar la invitación.",
    });
  }
};

/**
 * 📌 Aceptar una invitación con código
 */
export const acceptInvitation = async (req, res) => {
  try {
    const { invitationCode, email } = req.body;

    // 🔍 Validaciones
    if (!invitationCode || !email) {
      return res.status(400).json({
        status: "error",
        message: "Código de invitación y email son obligatorios.",
      });
    }

    // 🔄 Validar la invitación
    const parentalAccountId = await validateInvitationCode(
      invitationCode,
      email
    );

    if (!parentalAccountId) {
      return res.status(400).json({
        status: "error",
        message: "Código de invitación inválido o expirado.",
      });
    }

    // 🔗 Asociar el usuario a la cuenta parental
    const updatedUser = await linkUserToParentalAccount(
      email,
      parentalAccountId
    );

    return res.status(200).json({
      status: "success",
      message: "Invitación aceptada correctamente.",
      data: updatedUser,
    });
  } catch (error) {
    console.error("❌ Error al aceptar la invitación:", error);
    return res.status(500).json({
      status: "error",
      message: "No se pudo aceptar la invitación.",
    });
  }
};
