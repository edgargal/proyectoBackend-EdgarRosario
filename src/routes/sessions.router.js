import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../dao/models/user.js";
import bcrypt from "bcrypt";
import passport from "passport";

const router = Router();
const JWT_SECRET = "jwtSecret123";

router.get(
  "/current",
  passport.authenticate("current", { session: false }),
  (req, res) => {
    res.json({ user: req.user });
  }
);

// REGISTRO
router.post("/register", async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ error: "Usuario ya existe" });

    const user = new User({ first_name, last_name, email, age, password });
    await user.save();

    res.status(201).json({ message: "Usuario registrado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al registrar usuario" });
  }
});

// LOGIN

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Usuario no encontrado" });

    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch)
      return res.status(401).json({ error: "Contraseña incorrecta" });

    // Generar token con el role incluido
    const token = jwt.sign(
      { userId: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res
      .cookie("jwt", token, { httpOnly: true })
      .json({ message: "Login exitoso", token });
  } catch (error) {
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});

//LOGOUT
router.post("/logout", (req, res) => {
  res.clearCookie("jwt");
  res.json({ message: "Logout exitoso" });
});

export default router;
