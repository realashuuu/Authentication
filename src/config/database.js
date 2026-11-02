import config from "./config.js";
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);

    console.log("Connected to DB");
  } catch (error) {
    console.error("Error connecting to DB:", error.message);

    process.exit(1);
  }
};
