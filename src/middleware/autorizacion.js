export const authorize = (allowedRoles) => {
  return (req, res, next) => {
    // El usuario debería estar ya autenticado con req.user
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "No autenticado" });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: "No autorizado" });
    }

    next();
  };
};
