import { useState, useEffect } from "react";
import {
  getTasks,
  createTask,
  toggleTask,
  updateTaskTitle,
  deleteTask,
} from "./api";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import "./App.css";

const LOCAL_STORAGE_KEY = "task-manager-cache-v1";

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      try {
        setTasks(JSON.parse(cached));
      } catch {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    }
    fetchTasks();
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const getReadableError = (err, fallback) => {
    if (err?.message?.includes("Failed to fetch")) {
      return "Cannot reach the API. Start the backend (uv run uvicorn main:app --reload in backend/) and ensure it listens on port 8000, then use Retry.";
    }
    return err?.message || fallback;
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      setError(getReadableError(err, "Could not load tasks."));
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (title) => {
    try {
      setIsSaving(true);
      setError(null);
      const newTask = await createTask(title);
      setTasks((prev) => [newTask, ...prev]);
      return true;
    } catch (err) {
      setError(getReadableError(err, "Failed to add task."));
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggle = async (id, completed) => {
    try {
      setIsSaving(true);
      setError(null);
      const updated = await toggleTask(id, completed);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      setError(getReadableError(err, "Failed to update task."));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      setIsSaving(true);
      setError(null);
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(getReadableError(err, "Failed to delete task."));
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditTitle = async (id, title) => {
    try {
      setIsSaving(true);
      setError(null);
      const updated = await updateTaskTitle(id, title);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      return true;
    } catch (err) {
      setError(getReadableError(err, "Failed to update task."));
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const remainingCount = tasks.filter((t) => !t.completed).length;

  return (
    <div className="container">
      <h1>Task Manager</h1>
      <TaskForm onAdd={handleAdd} disabled={isSaving} />
      <div className="toolbar">
        <div className="filters" role="group" aria-label="Filter tasks">
          <button
            type="button"
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
            disabled={isSaving}
          >
            All
          </button>
          <button
            type="button"
            className={filter === "active" ? "active" : ""}
            onClick={() => setFilter("active")}
            disabled={isSaving}
          >
            Active
          </button>
          <button
            type="button"
            className={filter === "completed" ? "active" : ""}
            onClick={() => setFilter("completed")}
            disabled={isSaving}
          >
            Completed
          </button>
        </div>
        <p className="counter">{remainingCount} tasks remaining</p>
      </div>
      {error && (
        <div className="error-panel" role="alert">
          <p className="error">{error}</p>
          <button
            type="button"
            className="retry-btn"
            onClick={fetchTasks}
            disabled={loading || isSaving}
          >
            Retry
          </button>
        </div>
      )}
      {loading ? (
        <p className="loading">Loading tasks...</p>
      ) : (
        <TaskList
          tasks={filteredTasks}
          filter={filter}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onEditTitle={handleEditTitle}
          disabled={isSaving}
        />
      )}
    </div>
  );
}

export default App;
