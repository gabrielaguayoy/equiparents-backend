// src/middleware/validateRequest.js

import { validationResult } from "express-validator";

/**
 * 📌 Middleware de validación de solicitudes
 * @param {Array} validations - Reglas de validación de `express-validator`
 * @returns {Function} Middleware de validación
 */
export const validateRequest = (validations) => {
  return async (req, res, next) => {
    // Ejecuta las validaciones antes de procesar la solicitud
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "error",
        message: "Errores en la validación de datos",
        errors: errors.array().map((err) => ({
          field: err.param,
          message: err.msg,
        })),
      });
    }

    next(); // ✅ Pasa al siguiente middleware si no hay errores
  };
};
