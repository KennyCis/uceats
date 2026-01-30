import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js"; // Import JWT generator
import { OAuth2Client } from "google-auth-library"; // Import Google Client
import dotenv from "dotenv";

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper to construct image URL
const getImageUrl = (req) => {
    if (!req.file) return null;
    return `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
};

// --- REGISTER ---
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
      termsAccepted: termsAccepted === 'true', // FormData converts boolean to string
      image: imageUrl // send photo
    });

    const userSaved = await newUser.save();

    // GENERATE TOKEN (Important: Login immediately after register)
    const token = await createAccessToken({ id: userSaved._id });

    res.json({
      id: userSaved._id,
      name: userSaved.name,
      email: userSaved.email,
      role: userSaved.role,
      image: userSaved.image, 
      createdAt: userSaved.createdAt,
      token: token // Send token to frontend
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- LOGIN ---
export const login = async (req, res) => {
    const { email, password, role } = req.body; 

    try {
        const userFound = await User.findOne({ email });
        if (!userFound) return res.status(400).json({ message: "User not found" });

        // Optional: strict role check
        if (role && userFound.role !== role) {
            return res.status(400).json({ message: `Role mismatch: User is ${userFound.role}, not ${role}` });
        }

        const isMatch = await bcrypt.compare(password, userFound.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid password" });

        // GENERATE TOKEN
        const token = await createAccessToken({ id: userFound._id });

        res.json({
            id: userFound._id,
            name: userFound.name,
            email: userFound.email,
            role: userFound.role,
            birthdate: userFound.birthdate, 
            image: userFound.image,
            token: token // Send token to frontend
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- GOOGLE LOGIN (NEW) ---
export const googleLogin = async (req, res) => {
    const { token } = req.body; 

    try {
        // 1. Verify token with Google
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { name, email, picture } = ticket.getPayload();

        // 2. Check if user exists in DB
        let user = await User.findOne({ email });

        // 3. If not exists, create it (Auto-Register)
        if (!user) {
            // Generate random secure password
            const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const passwordHash = await bcrypt.hash(randomPassword, 10);

            user = new User({
                name: name,
                email: email,
                password: passwordHash,
                image: picture, // Use Google's profile picture
                role: "student", // VALID NOW: "student" is in the Schema enum
                termsAccepted: true, // Assumed accepted by using the app
                birthdate: null // VALID NOW: birthdate is not required in Schema
            });
            await user.save();
        }

        // 4. Generate JWT for our app
        const accessToken = await createAccessToken({ id: user._id });

        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image,
            token: accessToken,
        });

    } catch (error) {
        console.error("Google Auth Error:", error);
        res.status(400).json({ message: "Google authentication failed" });
    }
};

// --- UPDATE PROFILE ---
export const updateProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, birthdate, password } = req.body;

        const updates = { name, email, birthdate };

        if (password && password.trim() !== "") {
            updates.password = await bcrypt.hash(password, 10);
        }

        // send photo
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