import { Router } from "express";
import Project from "../models/Project.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", async (_req, res) => {
  const projects = await Project.find().sort({ order: 1, createdAt: -1 });
  res.json(projects);
});

router.post("/", requireAuth, async (req, res) => {
  const { title, period, description, tags, link, order } = req.body;
  if (!title) return res.status(400).json({ message: "Title is required" });
  const project = await Project.create({
    title,
    period: period || "",
    description: description || "",
    link: link || "",
    order: Number(order) || 0,
    tags: Array.isArray(tags) ? tags : String(tags || "").split(",").map((t) => t.trim()).filter(Boolean)
  });
  res.status(201).json(project);
});

router.put("/:id", requireAuth, async (req, res) => {
  const project = await Project.findById(req.params.id).catch(() => null);
  if (!project) return res.status(404).json({ message: "Project not found" });
  const { title, period, description, tags, link, order } = req.body;
  if (title !== undefined) project.title = title;
  if (period !== undefined) project.period = period;
  if (description !== undefined) project.description = description;
  if (link !== undefined) project.link = link;
  if (order !== undefined) project.order = Number(order) || 0;
  if (tags !== undefined) {
    project.tags = Array.isArray(tags) ? tags : String(tags).split(",").map((t) => t.trim()).filter(Boolean);
  }
  await project.save();
  res.json(project);
});

router.delete("/:id", requireAuth, async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id).catch(() => null);
  if (!project) return res.status(404).json({ message: "Project not found" });
  res.json({ message: "Project deleted", id: project._id });
});

export default router;
