import { useState } from "react";

function TaskForm({ onAdd, disabled }) {
  const [title, setTitle] = useState("");

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!title.trim() || disabled) return;
    const wasAdded = await onAdd(title.trim());
    if (wasAdded) {
      setTitle("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Add a new task..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />
      <button type="submit" disabled={disabled || !title.trim()}>
        {disabled ? "Adding..." : "Add"}
      </button>
    </form>
  );
}

export default TaskForm;