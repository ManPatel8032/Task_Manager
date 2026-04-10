import { useState } from "react";

function TaskItem({ task, onToggle, onDelete, onEditTitle, disabled }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(task.title);

  const handleSave = async () => {
    const next = draftTitle.trim();
    if (!next || next === task.title) {
      setDraftTitle(task.title);
      setIsEditing(false);
      return;
    }
    const ok = await onEditTitle(task.id, next);
    if (ok) setIsEditing(false);
  };

  const handleCancel = () => {
    setDraftTitle(task.title);
    setIsEditing(false);
  };

  return (
    <div className="task-item">
      <div className="task-left">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id, !task.completed)}
          disabled={disabled}
          aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
        />
        {isEditing ? (
          <input
            className="edit-input"
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") handleCancel();
            }}
            disabled={disabled}
            aria-label="Edit task title"
            autoFocus
          />
        ) : (
          <span className={`task-title ${task.completed ? "completed" : ""}`}>
            {task.title}
          </span>
        )}
      </div>
      <div className="task-actions">
        {isEditing ? (
          <>
            <button
              type="button"
              className="icon-btn"
              onClick={handleSave}
              disabled={disabled}
            >
              Save
            </button>
            <button
              type="button"
              className="icon-btn"
              onClick={handleCancel}
              disabled={disabled}
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            type="button"
            className="icon-btn edit-btn"
            onClick={() => setIsEditing(true)}
            disabled={disabled}
            title="Edit title"
            aria-label={`Edit ${task.title}`}
          >
            Edit
          </button>
        )}
        <button
          type="button"
          className="delete-btn"
          onClick={() => onDelete(task.id)}
          disabled={disabled}
          aria-label="Delete task"
        >
          {"\u00d7"}
        </button>
      </div>
    </div>
  );
}

export default TaskItem;
