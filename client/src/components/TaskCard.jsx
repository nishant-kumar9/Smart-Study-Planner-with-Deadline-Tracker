import { HiOutlineCalendarDays } from "react-icons/hi2";
import { HiOutlinePencilSquare, HiOutlineTrash } from "react-icons/hi2";
import "./TaskCard.css";

function TaskCard({
  task,
  onToggleStatus,
  onDelete,
  onEdit,
  isUpdating,
  isDeleting,
  isCompact = false,
}) {
  const priority = (task.priority || "Low").toLowerCase();
  const isCompleted = task.status === "completed";
  const deadlineText = task.deadline
    ? new Date(task.deadline).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "No deadline";

  return (
    <article className={`task-card-modern ${isCompleted ? "completed" : ""} ${isCompact ? "compact" : ""}`}>
      <div className="task-card-top">
        <label className="task-toggle-control" aria-label={`Toggle ${task.title} completion status`}>
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={() => onToggleStatus(task)}
            disabled={isUpdating || isDeleting}
          />
          <span />
        </label>

        <h3>{task.title}</h3>
        <span className={`priority-chip ${priority}`}>{task.priority || "Low"}</span>
      </div>

      <p className="task-subject">{task.subject}</p>

      <div className="task-meta-row">
        <p>
          <HiOutlineCalendarDays />
          {deadlineText}
        </p>
        <span className={`status-pill ${(task.status || "pending").toLowerCase()}`}>
          {task.status || "pending"}
        </span>
      </div>

      <div className="task-actions-row">
        <p className="task-action-status">
          {isUpdating ? "Saving..." : isCompleted ? "Completed" : "Pending"}
        </p>

        {onEdit ? (
          <button
            type="button"
            className="task-icon-btn"
            onClick={() => onEdit(task)}
            disabled={isUpdating || isDeleting}
            aria-label={`Edit ${task.title}`}
          >
            <HiOutlinePencilSquare />
          </button>
        ) : null}

        <button
          type="button"
          className="task-icon-btn task-delete-btn"
          onClick={() => onDelete(task)}
          disabled={isUpdating || isDeleting}
          aria-label={`Delete ${task.title}`}
        >
          {isDeleting ? "..." : <HiOutlineTrash />}
        </button>
      </div>
    </article>
  );
}

export default TaskCard;
