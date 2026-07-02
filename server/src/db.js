import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGO_URI || "mongodb+srv://maruf333444:maruf333444@cluster0.eqz91gh.mongodb.net/maruf_portfolio";
  await mongoose.connect(uri);
  console.log("✅ MongoDB connected:", mongoose.connection.name);
}
