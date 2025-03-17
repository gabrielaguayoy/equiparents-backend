// src/middleware/validateRequest.js

import { validationResult } from "express-validator";

// Middleware para validar datos antes de ejecutar el controlador
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "error",
      message: "Error en la validación de los datos.",
      errors: errors.array(),
    });
  }
  next();
};

export default validateRequest;
