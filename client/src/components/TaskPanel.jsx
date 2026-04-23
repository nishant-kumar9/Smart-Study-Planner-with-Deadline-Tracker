import "./TaskPanel.css";

const getDateOnly = (value) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

const getPriorityClassName = (value) => {
  if (value === "High") {
    return "high";
  }

  if (value === "Medium") {
    return "medium";
  }

  return "low";
};

function TaskPanel({ selectedDate, loading, tasks, onToggleTaskStatus, onAddTask, updatingTaskId }) {
  const todayDate = getDateOnly(new Date());
  const selectedDateOnly = getDateOnly(selectedDate);
  const isTodaySelected = selectedDateOnly.getTime() === todayDate.getTime();

  return (
    <section className="calendar-day-panel">
      <div className="task-panel-top">
        <div>
          <h2>
            Tasks for {selectedDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </h2>
          {isTodaySelected && <p className="today-label">Today</p>}
        </div>

        <button type="button" className="add-task-btn" onClick={onAddTask}>
          Add Task for this date
        </button>
      </div>

      {loading ? (
        <p className="muted">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <div className="calendar-empty-state">
          <p>No tasks scheduled for this date.</p>
        </div>
      ) : (
        <div className="calendar-task-list">
          {tasks.map((task) => {
            const taskDate = getDateOnly(task.deadline);
            const isOverdue = task.status !== "completed" && taskDate < todayDate;
            const cardClassNames = ["calendar-task-card"];

            if (task.status === "completed") {
              cardClassNames.push("completed");
            }

            if (isOverdue) {
              cardClassNames.push("overdue");
            }

            return (
              <article
                key={task._id}
                className={cardClassNames.join(" ")}
              >
                <label className="task-complete-toggle">
                  <input
                    type="checkbox"
                    checked={task.status === "completed"}
                    onChange={() => onToggleTaskStatus(task)}
                    disabled={updatingTaskId === task._id}
                    aria-label={"Mark " + task.title + " as " + (task.status === "completed" ? "pending" : "completed")}
                  />
                  <span className="checkmark" />
                </label>

                <div className="task-main-content">
                  <h3>{task.title}</h3>
                  <p>{task.subject || "General"}</p>
                  <div className="task-meta-row">
                    <span className={"priority-badge " + getPriorityClassName(task.priority)}>
                      {task.priority || "Low"}
                    </span>
                    <span className="deadline-text">
                      Due {new Date(task.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                    {isOverdue && <span className="overdue-badge">Overdue</span>}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default TaskPanel;
