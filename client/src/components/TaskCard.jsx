import { HiOutlineCalendarDays } from "react-icons/hi2";
import "./TaskCard.css";

function TaskCard({ task, onToggleStatus, onDelete, isUpdating, isDeleting }) {
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
    <article className={`task-card-modern ${isCompleted ? "completed" : ""}`}>
      <div className="task-card-top">
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
        <button
          type="button"
          className="task-toggle-btn"
          onClick={() => onToggleStatus(task)}
          disabled={isUpdating || isDeleting}
        >
          {isUpdating ? "Updating..." : isCompleted ? "Mark as Pending" : "Mark as Completed"}
        </button>

        <button
          type="button"
          className="task-delete-btn"
          onClick={() => onDelete(task)}
          disabled={isUpdating || isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </article>
  );
}

export default TaskCard;
