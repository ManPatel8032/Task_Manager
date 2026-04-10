import { useState } from "react";

function TaskForm({ onAdd, disabled }) {
  const [title, setTitle] = useState("");

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!title.trim() || disabled) return;
    const ok = await onAdd(title.trim());
    if (ok) setTitle("");
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Add a new task..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={disabled}
        aria-label="New task title"
      />
      <button type="submit" disabled={disabled || !title.trim()}>
        {disabled ? "Working..." : "Add"}
      </button>
    </form>
  );
}

export default TaskForm;
