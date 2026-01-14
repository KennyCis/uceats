import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["client", "admin", "staff"], default: "client" },
  birthdate: { type: Date, required: true },
  termsAccepted: { type: Boolean, required: true },
  image: { type: String, default: null } 
}, {
  timestamps: true
});

export default mongoose.model("User", userSchema);