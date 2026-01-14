import User from "../models/User.model.js";
import bcrypt from "bcryptjs";

const getImageUrl = (req) => {
    if (!req.file) return null;
    return `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
};

export const register = async (req, res) => {
  const { name, email, password, role, birthdate, termsAccepted } = req.body;

  try {
    const userFound = await User.findOne({ email });
    if (userFound) return res.status(400).json(["The email is already in use"]);

    const passwordHash = await bcrypt.hash(password, 10);
    
    let imageUrl = null;
    if (req.file) {
        imageUrl = getImageUrl(req);
    }

    const newUser = new User({
      name,
      email,
      password: passwordHash,
      role,
      birthdate,
      termsAccepted: termsAccepted === 'true', // FormData convert boolean a string
      image: imageUrl //send photo
    });

    const userSaved = await newUser.save();

    res.json({
      id: userSaved._id,
      name: userSaved.name,
      email: userSaved.email,
      role: userSaved.role,
      image: userSaved.image, //back image
      createdAt: userSaved.createdAt
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
    const { email, password, role } = req.body; 

    try {
        const userFound = await User.findOne({ email });
        if (!userFound) return res.status(400).json({ message: "User not found" });

        if (userFound.role !== role) {
            return res.status(400).json({ message: `Role mismatch: User is ${userFound.role}, not ${role}` });
        }

        const isMatch = await bcrypt.compare(password, userFound.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid password" });

        res.json({
            id: userFound._id,
            name: userFound.name,
            email: userFound.email,
            role: userFound.role,
            birthdate: userFound.birthdate, //profail
            image: userFound.image          //avatar
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const updateProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, birthdate, password } = req.body;

        const updates = { name, email, birthdate };

        if (password && password.trim() !== "") {
            updates.password = await bcrypt.hash(password, 10);
        }

        //send photo
        if (req.file) {
            updates.image = getImageUrl(req);
        }

        const userUpdated = await User.findByIdAndUpdate(id, updates, { new: true });
        
        if (!userUpdated) return res.status(404).json({ message: "User not found" });

        res.json({
            id: userUpdated._id,
            name: userUpdated.name,
            email: userUpdated.email,
            role: userUpdated.role,
            birthdate: userUpdated.birthdate,
            image: userUpdated.image
        });
    } catch (error) {
        return res.status(500).json({ message: "Error updating profile" });
    }
};