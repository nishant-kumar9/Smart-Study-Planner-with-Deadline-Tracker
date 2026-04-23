import { useEffect, useMemo, useState } from "react";
import CalendarGrid from "../components/CalendarGrid";
import TaskPanel from "../components/TaskPanel";
import TaskModal from "../components/TaskModal";
import { createTaskApi, fetchTasksApi, updateTaskApi } from "../services/taskService";
import { buildRecurringPayloads } from "../utils/taskRecurrence";
import { formatDateKey, isSameDay } from "../utils/taskAnalytics";
import useDocumentTitle from "../hooks/useDocumentTitle";
import "./CalendarPage.css";

const getMonthAnchor = (value) => new Date(value.getFullYear(), value.getMonth(), 1);

const getDefaultForm = (deadline) => ({
  title: "",
  subject: "",
  priority: "Low",
  deadline,
  recurrence: "none",
  repeatCount: 5,
  customIntervalDays: 2,
});

function CalendarPage() {
  useDocumentTitle("Calendar");

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [visibleMonth, setVisibleMonth] = useState(() => getMonthAnchor(new Date()));
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);
  const [form, setForm] = useState(() => getDefaultForm(formatDateKey(new Date())));

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
      const bucket = map.get(key) || [];
      bucket.push(task);
      map.set(key, bucket);
    });

    return map;
  }, [tasks]);

  const selectedDateTasks = useMemo(
    () => tasks.filter((task) => task.deadline && isSameDay(task.deadline, selectedDate)),
    [tasks, selectedDate]
  );

  const daySummaries = useMemo(() => {
    const map = new Map();

    tasksByDate.forEach((entries, key) => {
      const summary = {
        total: entries.length,
        completed: entries.filter((entry) => entry.status === "completed").length,
        pending: entries.filter((entry) => entry.status !== "completed").length,
        priority: {
          High: 0,
          Medium: 0,
          Low: 0,
        },
        names: entries.map((entry) => entry.title).slice(0, 4),
      };

      entries.forEach((entry) => {
        const level = entry.priority || "Low";
        if (summary.priority[level] !== undefined) {
          summary.priority[level] += 1;
        }
      });

      map.set(key, summary);
    });

    return map;
  }, [tasksByDate]);

  const handleSelectDate = (nextDate) => {
    setSelectedDate(nextDate);
    setVisibleMonth(getMonthAnchor(nextDate));
  };

  const handlePrevMonth = () => {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setVisibleMonth(getMonthAnchor(today));
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const openAddTaskModal = () => {
    setForm((current) => ({
      ...getDefaultForm(formatDateKey(selectedDate)),
      title: current.title,
      subject: current.subject,
      priority: current.priority,
      recurrence: current.recurrence,
      repeatCount: current.repeatCount,
      customIntervalDays: current.customIntervalDays,
    }));
    setShowModal(true);
  };

  const closeAddTaskModal = () => {
    setShowModal(false);
  };

  const handleCreateTask = async () => {
    if (!form.title || !form.subject || !form.deadline) {
      alert("Please fill title, subject, and deadline.");
      return;
    }

    setCreating(true);

    try {
      const payloads = buildRecurringPayloads(form);
      const createdTasks = await Promise.all(payloads.map((payload) => createTaskApi(payload)));

      setTasks((current) => [...createdTasks, ...current]);
      setShowModal(false);
      setForm(getDefaultForm(formatDateKey(selectedDate)));
    } catch (error) {
      console.log("CALENDAR TASK CREATE ERROR:", error.response?.data || error.message);
    } finally {
      setCreating(false);
    }
  };

  const handleToggleTaskStatus = async (task) => {
    const previousTasks = [...tasks];
    const nextStatus = task.status === "completed" ? "pending" : "completed";

    setUpdatingTaskId(task._id);
    setTasks((current) =>
      current.map((entry) =>
        entry._id === task._id
          ? {
              ...entry,
              status: nextStatus,
            }
          : entry
      )
    );

    try {
      const updatedTask = await updateTaskApi(task._id, { status: nextStatus });
      setTasks((current) =>
        current.map((entry) => (entry._id === task._id ? { ...entry, ...updatedTask } : entry))
      );
    } catch (error) {
      setTasks(previousTasks);
      console.log("CALENDAR STATUS UPDATE ERROR:", error.response?.data || error.message);
    } finally {
      setUpdatingTaskId(null);
    }
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
        <CalendarGrid
          monthDate={visibleMonth}
          selectedDate={selectedDate}
          daySummaries={daySummaries}
          onSelectDate={handleSelectDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onGoToday={handleToday}
        />

        <TaskPanel
          selectedDate={selectedDate}
          loading={loading}
          tasks={selectedDateTasks}
          onToggleTaskStatus={handleToggleTaskStatus}
          onAddTask={openAddTaskModal}
          updatingTaskId={updatingTaskId}
        />
      </div>

      <TaskModal
        open={showModal}
        form={form}
        onChange={handleFormChange}
        onClose={closeAddTaskModal}
        onSubmit={handleCreateTask}
      />

      {creating && <p className="muted">Creating task...</p>}
    </section>
  );
}

export default CalendarPage;
