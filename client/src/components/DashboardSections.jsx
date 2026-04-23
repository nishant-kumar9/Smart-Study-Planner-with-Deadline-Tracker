import {
  HiOutlineBolt,
  HiOutlineCalendarDays,
  HiOutlineCheckBadge,
  HiOutlineClock,
  HiOutlineListBullet,
} from "react-icons/hi2";
import TaskCard from "./TaskCard";
import EmptyState from "./EmptyState";
import "./DashboardSections.css";

function DashboardSections({
  loading,
  allTasks,
  todayTasks,
  upcomingDeadlines,
  weeklyInsight,
  onAddTask,
  onViewToday,
  onToggleStatus,
  onDeleteTask,
  onEditTask,
  todayPanelRef,
  isTaskUpdating,
  isTaskDeleting,
  isUrgentTask,
}) {
  return (
    <div className="dashboard-sections-grid">
      <section className="dashboard-surface dashboard-quick-actions">
        <header className="dashboard-section-head">
          <h2>
            <HiOutlineBolt />
            Quick Actions
          </h2>
          <p>Jump directly into your high-value workflow.</p>
        </header>

        <div className="dashboard-action-buttons">
          <button type="button" className="dashboard-action-btn" onClick={onAddTask}>
            Add Task
          </button>
          <button type="button" className="dashboard-action-btn" onClick={onViewToday}>
            View Today's Tasks
          </button>
        </div>
      </section>

      <section className="dashboard-surface dashboard-upcoming-panel">
        <header className="dashboard-section-head">
          <h2>
            <HiOutlineClock />
            Upcoming Deadlines
          </h2>
          <p>Next 5 pending deadlines with urgency highlights.</p>
        </header>

        {loading ? (
          <p className="dashboard-muted">Loading deadlines...</p>
        ) : upcomingDeadlines.length === 0 ? (
          <EmptyState
            icon={HiOutlineCalendarDays}
            title="No upcoming deadlines"
            description="Create tasks with deadlines to keep this panel active."
            actionLabel="Add Task"
            onAction={onAddTask}
            compact
          />
        ) : (
          <div className="dashboard-deadline-list">
            {upcomingDeadlines.map((task) => (
              <article key={task._id} className="dashboard-deadline-item">
                <div>
                  <h3>{task.title}</h3>
                  <p>{task.subject || "General"}</p>
                </div>

                <div className="dashboard-deadline-right">
                  {isUrgentTask(task) && <span className="urgent-badge">Urgent</span>}
                  <span>
                    {new Date(task.deadline).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="dashboard-surface dashboard-today-panel" ref={todayPanelRef}>
        <header className="dashboard-section-head">
          <h2>
            <HiOutlineListBullet />
            Today's Tasks
          </h2>
          <p>Complete, edit, or remove tasks due today.</p>
        </header>

        {loading ? (
          <p className="dashboard-muted">Loading today's tasks...</p>
        ) : todayTasks.length === 0 ? (
          <EmptyState
            icon={HiOutlineCheckBadge}
            title="No tasks due today"
            description="A clear day. Add focused tasks to maintain momentum."
            actionLabel="Add Task"
            onAction={onAddTask}
          />
        ) : (
          <div className="dashboard-today-list">
            {todayTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onToggleStatus={onToggleStatus}
                onDelete={onDeleteTask}
                onEdit={onEditTask}
                isUpdating={isTaskUpdating === task._id}
                isDeleting={isTaskDeleting === task._id}
                isCompact
              />
            ))}
          </div>
        )}
      </section>

      <section className="dashboard-surface dashboard-insight-panel">
        <header className="dashboard-section-head">
          <h2>
            <HiOutlineBolt />
            Productivity Insights
          </h2>
          <p>Understand your weekly completion rhythm.</p>
        </header>

        <div className="dashboard-insight-metrics">
          <article>
            <p>Completed this week</p>
            <h3>{weeklyInsight.tasksCompletedThisWeek}</h3>
          </article>
          <article>
            <p>Most active day</p>
            <h3>{weeklyInsight.mostActiveDay}</h3>
          </article>
          <article>
            <p>Total tracked tasks</p>
            <h3>{allTasks.length}</h3>
          </article>
        </div>

        <div className="dashboard-mini-chart" aria-label="Weekly completion chart">
          {weeklyInsight.chartData.map((point) => (
            <div key={point.label} className="dashboard-mini-bar-wrap">
              <div
                className="dashboard-mini-bar"
                style={{
                  height: `${Math.max(10, point.value * 15)}px`,
                }}
                title={`${point.label}: ${point.value} completed`}
              />
              <span>{point.label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default DashboardSections;
