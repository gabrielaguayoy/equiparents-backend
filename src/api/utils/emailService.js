// src/utils/emailService.js

import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

// 📌 Configurar API Key de SendGrid
if (!process.env.SENDGRID_API_KEY) {
  console.error(
    "❌ ERROR: Falta la API Key de SendGrid en las variables de entorno."
  );
  process.exit(1);
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * 📩 Enviar un correo con SendGrid
 * @param {Object} options - Opciones del correo
 * @param {string | string[]} options.to - Email(s) del destinatario
 * @param {string} options.subject - Asunto del correo
 * @param {string} options.html - Contenido en formato HTML
 * @param {string} [options.text] - Contenido en texto plano (opcional)
 * @param {Array} [options.attachments] - Lista de adjuntos (opcional)
 * @returns {Promise<void>}
 */
export const sendEmail = async ({
  to,
  subject,
  html,
  text = "",
  attachments = [],
}) => {
  try {
    if (!to || !subject || !html) {
      throw new Error("Faltan datos requeridos (to, subject, html).");
    }

    const msg = {
      to, // ✅ Soporta lista de destinatarios
      from: process.env.SENDGRID_FROM_EMAIL || "noreply@equiparents.com", // 📌 Remitente seguro
      subject,
      text,
      html,
      attachments, // ✅ Soporte para adjuntos
    };

    const response = await sgMail.send(msg);
    console.log(`✅ Email enviado a ${Array.isArray(to) ? to.join(", ") : to}`);
    console.log(
      "📨 Respuesta de SendGrid:",
      response[0]?.statusCode,
      response[0]?.headers
    );
  } catch (error) {
    console.error(
      "❌ Error al enviar email:",
      error.response?.body || error.message
    );
    throw new Error(
      "Error al enviar email. Verifica la API Key y la configuración."
    );
  }
};
