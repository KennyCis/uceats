import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    
    await mongoose.connect("mongodb://mongo:27017/uceats");
    console.log(">>> DB is connected");
  } catch (error) {
    console.log(error);
  }
};