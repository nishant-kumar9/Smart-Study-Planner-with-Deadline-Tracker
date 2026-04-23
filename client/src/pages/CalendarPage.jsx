import { useEffect, useMemo, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { fetchTasksApi } from "../services/taskService";
import { formatDateKey, isSameDay } from "../utils/taskAnalytics";
import "./CalendarPage.css";

function CalendarPage() {
  const [date, setDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await fetchTasksApi();
        setTasks(data);
      } catch (error) {
        console.log("CALENDAR TASK FETCH ERROR:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  const tasksByDate = useMemo(() => {
    const map = new Map();

    tasks.forEach((task) => {
      if (!task.deadline) {
        return;
      }

      const key = formatDateKey(task.deadline);
      const entry = map.get(key) || [];
      entry.push(task);
      map.set(key, entry);
    });

    return map;
  }, [tasks]);

  const selectedDateTasks = tasks.filter((task) => task.deadline && isSameDay(task.deadline, date));

  const taskTileClass = ({ date: tileDate, view }) => {
    if (view !== "month") {
      return null;
    }

    return tasksByDate.has(formatDateKey(tileDate)) ? "task-day" : null;
  };

  const taskTileContent = ({ date: tileDate, view }) => {
    if (view !== "month") {
      return null;
    }

    const count = tasksByDate.get(formatDateKey(tileDate))?.length || 0;

    return count > 0 ? <span className="task-dot" title={`${count} tasks`} /> : null;
  };

  return (
    <section className="calendar-page">
      <div className="calendar-title-row">
        <div>
          <h1>Calendar</h1>
          <p>View deadlines by date and stay ahead of submissions.</p>
        </div>
      </div>

      <div className="calendar-layout">
        <section className="calendar-panel">
          <Calendar
            onChange={setDate}
            value={date}
            className="study-calendar"
            tileClassName={taskTileClass}
            tileContent={taskTileContent}
          />
        </section>

        <section className="calendar-day-panel">
          <h2>
            Tasks for {date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </h2>

          {loading ? (
            <p className="muted">Loading tasks...</p>
          ) : selectedDateTasks.length === 0 ? (
            <div className="calendar-empty-state">
              <p>No tasks scheduled for this date.</p>
            </div>
          ) : (
            <div className="calendar-task-list">
              {selectedDateTasks.map((task) => (
                <article key={task._id} className={`calendar-task-card ${task.status === "completed" ? "completed" : ""}`}>
                  <div>
                    <h3>{task.title}</h3>
                    <p>{task.subject}</p>
                  </div>
                  <span className={`status-chip ${task.status === "completed" ? "completed" : "pending"}`}>
                    {task.status}
                  </span>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </section>
  );
}

export default CalendarPage;