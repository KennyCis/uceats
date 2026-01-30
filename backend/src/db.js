import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const dbUrl = process.env.MONGODB_URI || "mongodb://localhost:27017/uceats";
    
    await mongoose.connect(dbUrl);

    console.log(`>>> DB is connected to: ${dbUrl}`);
    
  } catch (error) {
    console.log("Error connecting to DB:", error);
  }
};