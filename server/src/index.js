import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./db.js";
import authRoutes from "./routes/auth.js";
import certificateRoutes from "./routes/certificates.js";
import projectRoutes from "./routes/projects.js";
import messageRoutes from "./routes/messages.js";
import Certificate from "./models/Certificate.js";
import Project from "./models/Project.js";
import Message from "./models/Message.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "https://protfolio-maruf-3.onrender.com"}));
app.use(express.json());

// Static: certificate images, profile photo, downloadable CV
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

// Public stats for the hero ledger / admin overview
app.get("/api/stats", async (_req, res) => {
  const [certificates, projects, messages, unread] = await Promise.all([
    Certificate.countDocuments(),
    Project.countDocuments(),
    Message.countDocuments(),
    Message.countDocuments({ read: false })
  ]);
  res.json({ certificates, projects, messages, unread });
});

app.use("/api/auth", authRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/messages", messageRoutes);

// Error handler (multer errors etc.)
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(400).json({ message: err.message || "Something went wrong" });
});

const PORT = process.env.PORT || 5000;
connectDB()
  .then(() => app.listen(PORT, () => console.log(`🚀 API running at http://localhost:${PORT}`)))
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
