import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authRequired = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1] || req.headers.token;

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  // FIX: Changed 'TOKEN_SECRET' to 'JWT_SECRET' to match your jwt.js file
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = user;
    next();
  });
};