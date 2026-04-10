import { useState } from "react";

function TaskItem({ task, onToggle, onDelete, onEditTitle, disabled }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(task.title);

  const handleSave = async () => {
    const nextTitle = draftTitle.trim();
    if (!nextTitle || nextTitle === task.title) {
      setDraftTitle(task.title);
      setIsEditing(false);
      return;
    }
    const updated = await onEditTitle(task.id, nextTitle);
    if (updated) {
      setIsEditing(false);
    }
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
            autoFocus
            disabled={disabled}
            aria-label="Edit task title"
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
            <button className="icon-btn save-btn" onClick={handleSave} disabled={disabled}>
              Save
            </button>
            <button className="icon-btn cancel-btn" onClick={handleCancel} disabled={disabled}>
              Cancel
            </button>
          </>
        ) : (
          <button
            className="icon-btn edit-btn"
            onClick={() => setIsEditing(true)}
            disabled={disabled}
            aria-label={`Edit ${task.title}`}
            title="Edit task title"
          >
            ✎
          </button>
        )}
        <button className="delete-btn" onClick={() => onDelete(task.id)} disabled={disabled}>
          ✕
        </button>
      </div>
    </div>
  );
}

export default TaskItem;