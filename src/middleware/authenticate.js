// src/middleware/authenticate.js

import jwt from "jsonwebtoken";

// Middleware para autenticar el token JWT
export const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Obtén el token del encabezado

  if (!token) {
    return res
      .status(401)
      .json({ message: "Acceso no autorizado: no se proporcionó token." }); // Mensaje detallado si no hay token
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("Token no válido:", err.message);
      return res
        .status(403)
        .json({ message: "Acceso prohibido: token no válido." }); // Mensaje detallado si el token no es válido
    }

    req.user = user; // Almacena los datos del usuario para este request
    next(); // Continúa al siguiente middleware o ruta
  });
};
