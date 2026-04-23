import "./DayCell.css";

function DayCell({ date, summary, isSelected, isToday, onSelect }) {
  const total = summary?.total || 0;
  const completed = summary?.completed || 0;
  const pending = summary?.pending || 0;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  const isOverdue = pending > 0 && !isToday && date < new Date(new Date().setHours(0, 0, 0, 0));

  const classes = ["day-cell"];
  if (isSelected) classes.push("is-selected");
  if (isToday) classes.push("is-today");
  if (isOverdue) classes.push("is-overdue");
  if (total > 0) classes.push("has-tasks");

  const tooltipContent = summary
    ? summary.names.join(", ") + (summary.total > summary.names.length ? "..." : "")
    : "No tasks";

  return (
    <button
      type="button"
      className={classes.join(" ")}
      onClick={() => onSelect(date)}
      aria-label={"Select " + date.toDateString()}
    >
      <span className="day-number">{date.getDate()}</span>

      {total > 0 && (
        <>
          <span className="task-count">{total} tasks</span>

          <span className="priority-dots" aria-hidden="true">
            {summary.priority.High > 0 && <span className="dot high" />}
            {summary.priority.Medium > 0 && <span className="dot medium" />}
            {summary.priority.Low > 0 && <span className="dot low" />}
          </span>

          <span className="day-progress-track" aria-hidden="true">
            <span className="day-progress-fill" style={{ width: progress + "%" }} />
          </span>

          <span className="day-tooltip">{tooltipContent}</span>
        </>
      )}
    </button>
  );
}

export default DayCell;
