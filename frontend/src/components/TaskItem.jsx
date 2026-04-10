function TaskItem({ task, onToggle, onDelete }) {
  return (
    <div className="task-item">
      <div className="task-left">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id, !task.completed)}
        />
        <span className={`task-title ${task.completed ? "completed" : ""}`}>
          {task.title}
        </span>
      </div>
      <button className="delete-btn" onClick={() => onDelete(task.id)}>
        ✕
      </button>
    </div>
  );
}

export default TaskItem;