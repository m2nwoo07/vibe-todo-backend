import { Router } from "express";
import { Todo } from "../models/Todo.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 }).lean();
    res.json(todos);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const title = req.body?.title;
    if (typeof title !== "string" || !title.trim()) {
      res.status(400).json({ error: "title이 필요합니다." });
      return;
    }
    const todo = await Todo.create({ title: title.trim() });
    res.status(201).json(todo);
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(400).json({ error: err.message });
      return;
    }
    next(err);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const title = req.body?.title;
    if (typeof title !== "string" || !title.trim()) {
      res.status(400).json({ error: "title이 필요합니다." });
      return;
    }
    const todo = await Todo.findByIdAndUpdate(
      id,
      { title: title.trim() },
      { new: true, runValidators: true }
    ).lean();
    if (!todo) {
      res.status(404).json({ error: "할 일을 찾을 수 없습니다." });
      return;
    }
    res.json(todo);
  } catch (err) {
    if (err.name === "CastError") {
      res.status(400).json({ error: "잘못된 id입니다." });
      return;
    }
    if (err.name === "ValidationError") {
      res.status(400).json({ error: err.message });
      return;
    }
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findByIdAndDelete(id).lean();
    if (!todo) {
      res.status(404).json({ error: "할 일을 찾을 수 없습니다." });
      return;
    }
    res.status(204).end();
  } catch (err) {
    if (err.name === "CastError") {
      res.status(400).json({ error: "잘못된 id입니다." });
      return;
    }
    next(err);
  }
});

export default router;
