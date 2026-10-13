import { FormEvent, useEffect, useMemo, useState } from "react";

type Task = {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
};

type Filter = "all" | "active" | "completed";

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadTasks() {
    try {
      const response = await fetch("/api/tasks");
      if (!response.ok) throw new Error("Could not load tasks.");
      setTasks(await response.json() as Task[]);
      setError("");
    } catch {
      setError("Could not connect to the API. Make sure the server is running.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void loadTasks(); }, []);

  async function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) return;
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Could not add task.");
      setTasks(current => [data as Task, ...current]);
      setTitle("");
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not add task.");
    }
  }

  async function toggleTask(task: Task) {
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !task.completed })
      });
      if (!response.ok) throw new Error("Could not update task.");
      const updated = await response.json() as Task;
      setTasks(current => current.map(item => item.id === updated.id ? updated : item));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update task.");
    }
  }

  async function deleteTask(id: number) {
    try {
      const response = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Could not delete task.");
      setTasks(current => current.filter(task => task.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete task.");
    }
  }

  const visibleTasks = useMemo(() => tasks.filter(task => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  }), [tasks, filter]);

  const remaining = tasks.filter(task => !task.completed).length;

  return (
    <main className="page">
      <section className="app-card">
        <div className="eyebrow">PERSONAL PRODUCTIVITY</div>
        <h1>Task Manager</h1>
        <p className="subtitle">Small steps. Real progress.</p>

        <form className="add-form" onSubmit={addTask}>
          <input
            value={title}
            onChange={event => setTitle(event.target.value)}
            placeholder="What do you need to do?"
            aria-label="New task title"
            maxLength={160}
          />
          <button type="submit">Add task</button>
        </form>

        {error && <p className="error" role="alert">{error}</p>}

        <div className="toolbar">
          <div className="filters" aria-label="Filter tasks">
            {(["all", "active", "completed"] as Filter[]).map(item => (
              <button
                key={item}
                type="button"
                className={filter === item ? "filter selected" : "filter"}
                onClick={() => setFilter(item)}
              >
                {item[0].toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>
          <span className="count">{remaining} left</span>
        </div>

        {loading ? <p className="empty">Loading tasks…</p> :
          visibleTasks.length === 0 ? (
            <div className="empty">
              <span className="empty-icon">✓</span>
              <strong>{filter === "all" ? "Your list is clear" : "No matching tasks"}</strong>
              <span>Add a task above to get started.</span>
            </div>
          ) : (
            <ul className="task-list">
              {visibleTasks.map(task => (
                <li className="task" key={task.id}>
                  <label className="task-label">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => void toggleTask(task)}
                    />
                    <span className={task.completed ? "task-title done" : "task-title"}>{task.title}</span>
                  </label>
                  <button
                    className="delete"
                    type="button"
                    aria-label={`Delete ${task.title}`}
                    onClick={() => void deleteTask(task.id)}
                  >×</button>
                </li>
              ))}
            </ul>
          )}

        <footer>Built with React, TypeScript, Express and SQLite</footer>
      </section>
    </main>
  );
}