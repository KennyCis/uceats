import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";
import { OAuth2Client } from "google-auth-library";
import { sendWelcomeEmail } from "../libs/mailer.js";
import dotenv from "dotenv";

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
            termsAccepted: termsAccepted === 'true',
            image: imageUrl
        });

        const userSaved = await newUser.save();

        const token = await createAccessToken({ id: userSaved._id });

        res.cookie("token", token, {
            sameSite: "lax",
            secure: false,
            httpOnly: false
        });

        res.json({
            id: userSaved._id,
            name: userSaved.name,
            email: userSaved.email,
            role: userSaved.role,
            image: userSaved.image, 
            createdAt: userSaved.createdAt,
            token: token
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

        if (role && userFound.role !== role) {
            return res.status(400).json({ message: `Role mismatch: User is ${userFound.role}, not ${role}` });
        }

        const isMatch = await bcrypt.compare(password, userFound.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid password" });

        const token = await createAccessToken({ id: userFound._id });

        res.cookie("token", token, {
            sameSite: "lax",
            secure: false,
            httpOnly: false
        });

        res.json({
            id: userFound._id,
            name: userFound.name,
            email: userFound.email,
            role: userFound.role,
            birthdate: userFound.birthdate, 
            image: userFound.image,
            token: token
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const googleLogin = async (req, res) => {
    const { token } = req.body; 

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { name, email, picture } = ticket.getPayload();
        let user = await User.findOne({ email });

        if (!user) {
            const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const passwordHash = await bcrypt.hash(randomPassword, 10);

            user = new User({
                name: name,
                email: email,
                password: passwordHash,
                image: picture, 
                role: "student", 
                termsAccepted: true, 
                birthdate: null 
            });
            await user.save();

            console.log("Sending welcome email to new user...");
            sendWelcomeEmail(user.email, user.name); 
        }

        const accessToken = await createAccessToken({ id: user._id });

        res.cookie("token", accessToken, {
            sameSite: "lax",
            secure: false,
            httpOnly: false
        });

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

export const updateProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, birthdate, password } = req.body;

        const updates = { name, email, birthdate };

        if (password && password.trim() !== "") {
            updates.password = await bcrypt.hash(password, 10);
        }

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