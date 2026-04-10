import { useState, useEffect } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "./api";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all tasks on page load
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      setError("Could not load tasks. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (title) => {
    try {
      setError(null);
      const newTask = await createTask(title);
      setTasks((prev) => [...prev, newTask]);
    } catch (err) {
      setError(err.message || "Failed to add task.");
    }
  };

  const handleToggle = async (id, completed) => {
    try {
      setError(null);
      const updated = await updateTask(id, completed);
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? updated : task))
      );
    } catch (err) {
      setError(err.message || "Failed to update task.");
    }
  };

  const handleDelete = async (id) => {
    try {
      setError(null);
      await deleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete task.");
    }
  };

  return (
    <div className="container">
      <h1>Task Manager</h1>
      <TaskForm onAdd={handleAdd} />
      {error && <p className="error">{error}</p>}
      {loading ? (
        <p className="loading">Loading tasks...</p>
      ) : (
        <TaskList
          tasks={tasks}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default App;