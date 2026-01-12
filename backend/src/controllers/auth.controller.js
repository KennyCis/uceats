import User from "../models/User.model.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  const { name, email, password, role, birthdate, termsAccepted } = req.body;

  try {
    // 1. Encriptar la contraseña (¡Seguridad primero!)
    const passwordHash = await bcrypt.hash(password, 10);

    // 2. Crear el nuevo usuario con el modelo
    const newUser = new User({
      name,
      email,
      password: passwordHash,
      role,
      birthdate,
      termsAccepted
    });

    // 3. Guardar en MongoDB
    const userSaved = await newUser.save();

    // 4. Responder al frontend
    res.json({
      id: userSaved._id,
      name: userSaved.name,
      email: userSaved.email,
      message: "¡Usuario creado con éxito! 🎉"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};