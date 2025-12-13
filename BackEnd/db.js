import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/RECAI");

    console.log("✅ CONNECTED TO DB NAME:", mongoose.connection.name);
    console.log("✅ FULL CONNECTION STRING DB:", mongoose.connection.db.databaseName);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

export default connectDB;
