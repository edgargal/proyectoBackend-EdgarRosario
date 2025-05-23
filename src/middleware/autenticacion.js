import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "jwtSecret123";

export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No autenticado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Guarda los datos del usuario en req
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token inválido" });
  }
};
