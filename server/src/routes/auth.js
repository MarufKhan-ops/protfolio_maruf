import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

  const admin = await Admin.findOne({ email: String(email).toLowerCase() });
  if (!admin) return res.status(401).json({ message: "Invalid email or password" });

  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid email or password" });

  const token = jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: "12h" });
  res.json({ token, admin: { email: admin.email, name: admin.name } });
});

router.get("/me", requireAuth, (req, res) => res.json({ admin: req.admin }));

export default router;
