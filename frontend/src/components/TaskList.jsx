import TaskItem from "./TaskItem";

function TaskList({ tasks, onToggle, onDelete, onEditTitle, disabled }) {
  if (tasks.length === 0) {
    return <p className="empty">No tasks yet. Add one above!</p>;
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