import express from "express";
import cors from "cors";
import Database from "better-sqlite3";

const app = express();
const port = 3001;
const db = new Database("tasks.db");

app.use(cors());
app.use(express.json());

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

type TaskRow = {
  id: number;
  title: string;
  completed: number;
  created_at: string;
};

function toTask(row: TaskRow) {
  return { ...row, completed: Boolean(row.completed) };
}

app.get("/api/tasks", (_req, res) => {
  const rows = db.prepare("SELECT * FROM tasks ORDER BY id DESC").all() as TaskRow[];
  res.json(rows.map(toTask));
});

app.post("/api/tasks", (req, res) => {
  const title = typeof req.body.title === "string" ? req.body.title.trim() : "";
  if (!title) return res.status(400).json({ error: "Task title is required." });

  const result = db.prepare("INSERT INTO tasks (title) VALUES (?)").run(title);
  const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(result.lastInsertRowid) as TaskRow;
  res.status(201).json(toTask(task));
});

app.patch("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const completed = req.body.completed;
  if (!Number.isInteger(id) || typeof completed !== "boolean") {
    return res.status(400).json({ error: "A valid task ID and completed status are required." });
  }

  const result = db.prepare("UPDATE tasks SET completed = ? WHERE id = ?").run(completed ? 1 : 0, id);
  if (!result.changes) return res.status(404).json({ error: "Task not found." });

  const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id) as TaskRow;
  res.json(toTask(task));
});

app.delete("/api/tasks/:id", (req, res) => {
  const result = db.prepare("DELETE FROM tasks WHERE id = ?").run(Number(req.params.id));
  if (!result.changes) return res.status(404).json({ error: "Task not found." });
  res.status(204).end();
});

app.listen(port, () => {
  console.log(`Task Manager API running at http://localhost:${port}`);
});
