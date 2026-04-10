import TaskItem from "./TaskItem";

const emptyMessage = (filter) => {
  if (filter === "active") return "No active tasks. Nice work!";
  if (filter === "completed") return "No completed tasks yet.";
  return "No tasks yet. Add one above!";
};

function TaskList({ tasks, filter, onToggle, onDelete, onEditTitle, disabled }) {
  if (tasks.length === 0) {
    return <p className="empty">{emptyMessage(filter)}</p>;
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onEditTitle={onEditTitle}
          disabled={disabled}
        />
      ))}
    </div>
  );
}

export default TaskList;
