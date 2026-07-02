import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Certificate from "../models/Certificate.js";
import { requireAuth } from "../middleware/auth.js";
import { uploadCertificateImage } from "../middleware/upload.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = Router();

// Public: list all certificates
router.get("/", async (_req, res) => {
  const certs = await Certificate.find().sort({ order: 1, createdAt: -1 });
  res.json(certs);
});

// Public: single certificate
router.get("/:id", async (req, res) => {
  const cert = await Certificate.findById(req.params.id).catch(() => null);
  if (!cert) return res.status(404).json({ message: "Certificate not found" });
  res.json(cert);
});

// Admin: create (multipart with optional image)
router.post("/", requireAuth, uploadCertificateImage.single("image"), async (req, res) => {
  const { title, issuer, category, issueDate, credentialId, description, featured, order } = req.body;
  if (!title || !issuer) return res.status(400).json({ message: "Title and issuer are required" });

  const cert = await Certificate.create({
    title,
    issuer,
    category: category || "Other",
    issueDate: issueDate || "",
    credentialId: credentialId || "",
    description: description || "",
    featured: featured === "true" || featured === true,
    order: Number(order) || 0,
    image: req.file ? `/uploads/certificates/${req.file.filename}` : ""
  });
  res.status(201).json(cert);
});

// Admin: update
router.put("/:id", requireAuth, uploadCertificateImage.single("image"), async (req, res) => {
  const cert = await Certificate.findById(req.params.id).catch(() => null);
  if (!cert) return res.status(404).json({ message: "Certificate not found" });

  const fields = ["title", "issuer", "category", "issueDate", "credentialId", "description"];
  fields.forEach((f) => { if (req.body[f] !== undefined) cert[f] = req.body[f]; });
  if (req.body.featured !== undefined) cert.featured = req.body.featured === "true" || req.body.featured === true;
  if (req.body.order !== undefined) cert.order = Number(req.body.order) || 0;
  if (req.file) cert.image = `/uploads/certificates/${req.file.filename}`;

  await cert.save();
  res.json(cert);
});

// Admin: delete (also removes uploaded image file)
router.delete("/:id", requireAuth, async (req, res) => {
  const cert = await Certificate.findByIdAndDelete(req.params.id).catch(() => null);
  if (!cert) return res.status(404).json({ message: "Certificate not found" });

  if (cert.image?.startsWith("/uploads/")) {
    const filePath = path.join(__dirname, "..", "..", cert.image);
    fs.promises.unlink(filePath).catch(() => {});
  }
  res.json({ message: "Certificate deleted", id: cert._id });
});

export default router;
