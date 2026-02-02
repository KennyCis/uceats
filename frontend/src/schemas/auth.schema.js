import { z } from "zod";

// --- LOGIN SCHEMA ---
export const loginSchema = z.object({
  role: z.enum(["client", "admin"]),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

// --- REGISTER SCHEMA ---
export const registerSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name is too long" }),
  
  role: z.enum(["client", "admin"]),
  
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email format" }),
  
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  
  date: z
    .string()
    .refine((date) => new Date(date).toString() !== 'Invalid Date', { message: "Valid birthdate is required" }),

  // File validation (checks if FileList has items)
  file: z
    .any()
    .refine((files) => files?.length > 0, "Profile photo is required"),

  // Checkbox must be true
  conditions: z
    .boolean()
    .refine((val) => val === true, { message: "You must accept the terms" }),
});