import User from "../models/User.model.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  const { name, email, password, role, birthdate, termsAccepted } = req.body;

  try {
    
    const passwordHash = await bcrypt.hash(password, 10);

    
    const newUser = new User({
      name,
      email,
      password: passwordHash,
      role,
      birthdate,
      termsAccepted
    });

    
    const userSaved = await newUser.save();

    
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

export const login = async (req, res) => {
    
    const { email, password, role } = req.body; 

    console.log("Login try");
    console.log(`Datos -> Email: ${email}, Rol: ${role}`);

    try {
        
        const userFound = await User.findOne({ email });
        
        if (!userFound) {
            console.log(" Error: User no search DB.");
            return res.status(400).json({ message: "User not found" });
        }
        
        console.log(`User search in BD -> Name: ${userFound.name}, Rol real: ${userFound.role}`);

        
        if (userFound.role !== role) {
            console.log(` Error: Invalid Rol`);
            return res.status(400).json({ message: `Role mismatch: User is ${userFound.role}, not ${role}` });
        }

        // 4. Verificamos la contraseña
        const isMatch = await bcrypt.compare(password, userFound.password);
        if (!isMatch) {
            console.log(" Error: Invalid password");
            return res.status(400).json({ message: "Invalid password" });
        }

        
        console.log("Login .");
        res.json({
            id: userFound._id,
            name: userFound.name,
            email: userFound.email,
            role: userFound.role
        });

    } catch (error) {
        console.log(" Error of server:", error.message);
        res.status(500).json({ message: error.message });
    }
};