import mongoose from "mongoose";
import { createError } from "../middlewares/common/errorHandler.js";

export default async function connectDB() {
  try {
    // mongoose.set("strictQuery", false);
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Database connected: ${conn.connection.host}`);
  } catch (error) {
    throw createError("Failed to connect database", 500);
  }
}
