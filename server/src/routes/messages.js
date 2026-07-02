import { Router } from "express";
import Message from "../models/Message.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Public: send a message from the contact form
router.post("/", async (req, res) => {
  const { name, email, subject, body } = req.body || {};
  if (!name || !email || !body) {
    return res.status(400).json({ message: "Name, email and message are required" });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: "Please enter a valid email address" });
  }
  const msg = await Message.create({ name, email, subject: subject || "", body });
  res.status(201).json({ message: "Message sent", id: msg._id });
});

// Admin: list messages (newest first)
router.get("/", requireAuth, async (_req, res) => {
  const messages = await Message.find().sort({ createdAt: -1 });
  res.json(messages);
});

// Admin: mark read / unread
router.put("/:id/read", requireAuth, async (req, res) => {
  const msg = await Message.findById(req.params.id).catch(() => null);
  if (!msg) return res.status(404).json({ message: "Message not found" });
  msg.read = !msg.read;
  await msg.save();
  res.json(msg);
});

// Admin: delete
router.delete("/:id", requireAuth, async (req, res) => {
  const msg = await Message.findByIdAndDelete(req.params.id).catch(() => null);
  if (!msg) return res.status(404).json({ message: "Message not found" });
  res.json({ message: "Message deleted", id: msg._id });
});

export default router;
