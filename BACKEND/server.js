const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory task store
let tasks = [
  { id: 1, title: "Learn Jenkins", done: false },
  { id: 2, title: "Build CI/CD Pipeline", done: false },
  { id: 3, title: "Deploy to Production", done: false },
];
let nextId = 4;

// GET all tasks
app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

// POST create task
app.post("/api/tasks", (req, res) => {
  const { title } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: "Title is required" });
  }
  const task = { id: nextId++, title: title.trim(), done: false };
  tasks.push(task);
  res.status(201).json(task);
});

// PUT toggle done
app.put("/api/tasks/:id", (req, res) => {
  const task = tasks.find((t) => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ error: "Task not found" });
  task.done = !task.done;
  res.json(task);
});

// DELETE task
app.delete("/api/tasks/:id", (req, res) => {
  const index = tasks.findIndex((t) => t.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Task not found" });
  tasks.splice(index, 1);
  res.json({ message: "Deleted" });
});

// Health check for Jenkins
app.get("/health", (req, res) => {
  res.json({ status: "ok", env: process.env.NODE_ENV });
});

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
