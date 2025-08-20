import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const dbconnect = async () => {
  try {
    // const mongoUri = 'mongodb+srv://vivekchaturvedi013:Vivek%401997@cluster0.ysfsv34.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    if (!process.env.MONGO_URI) {
      throw new Error("MongoDB URI not found in environment variables");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};