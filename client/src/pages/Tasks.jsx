import { useEffect, useState } from "react";
import { HiOutlineClipboardDocumentCheck } from "react-icons/hi2";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";
import StatCard from "../components/StatCard";
import TaskFilters from "../components/TaskFilters";
import {
  createTaskApi,
  deleteTaskApi,
  fetchTasksApi,
  updateTaskApi,
} from "../services/taskService";
import { buildRecurringPayloads } from "../utils/taskRecurrence";
import useDocumentTitle from "../hooks/useDocumentTitle";
import "./Tasks.css";

const SAVED_VIEW_KEY = "taskSavedViews";

const defaultFilters = {
  query: "",
  subject: "all",
  priority: "all",
  status: "all",
  startDate: "",
  endDate: "",
};

const quickViews = [
  {
    id: "high-priority-week",
    name: "High Priority This Week",
    filters: {
      ...defaultFilters,
      priority: "High",
    },
  },
  {
    id: "due-today",
    name: "Due Today",
    filters: {
      ...defaultFilters,
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date().toISOString().slice(0, 10),
    },
  },
  {
    id: "pending-only",
    name: "Pending Only",
    filters: {
      ...defaultFilters,
      status: "pending",
    },
  },
];

function Tasks() {
  useDocumentTitle("Tasks");

  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [filters, setFilters] = useState(defaultFilters);
  const [saveViewName, setSaveViewName] = useState("");
  const [savedViews, setSavedViews] = useState(() => {
    try {
      const raw = localStorage.getItem(SAVED_VIEW_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [form, setForm] = useState({
    title: "",
    subject: "",
    priority: "Low",
    deadline: "",
    recurrence: "none",
    repeatCount: 5,
    customIntervalDays: 2,
  });

  const fetchTasks = async () => {
    try {
      const data = await fetchTasksApi();
      setTasks(data);
    } catch (err) {
      console.log("GET ERROR:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // INPUT
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const resetForm = () => {
    setForm({
      title: "",
      subject: "",
      priority: "Low",
      deadline: "",
      recurrence: "none",
      repeatCount: 5,
      customIntervalDays: 2,
    });
  };

  // ADD TASK
  const addTask = async () => {
    if (!form.title || !form.subject || !form.deadline) {
      alert("Please fill title, subject, and deadline.");
      return;
    }

    try {
      const payloads = buildRecurringPayloads(form);
      const createdTasks = await Promise.all(payloads.map((payload) => createTaskApi(payload)));

      setTasks((currentTasks) => [...createdTasks, ...currentTasks]);

      resetForm();
      setShowModal(false);
    } catch (err) {
      console.log("POST ERROR:", err.response?.data || err.message);
    }
  };

  const toggleTaskStatus = async (task) => {
    const nextStatus = task.status === "completed" ? "pending" : "completed";
    const previousTasks = [...tasks];

    setUpdatingTaskId(task._id);
    setTasks((currentTasks) =>
      currentTasks.map((currentTask) =>
        currentTask._id === task._id
          ? {
              ...currentTask,
              status: nextStatus,
            }
          : currentTask
      )
    );

    try {
      const updatedTask = await updateTaskApi(task._id, { status: nextStatus });
      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask._id === task._id ? { ...currentTask, ...updatedTask } : currentTask
        )
      );
    } catch (err) {
      setTasks(previousTasks);
      console.log("STATUS UPDATE ERROR:", err.response?.data || err.message);
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const deleteTask = async (task) => {
    const previousTasks = [...tasks];

    setDeletingTaskId(task._id);
    setTasks((currentTasks) => currentTasks.filter((currentTask) => currentTask._id !== task._id));

    try {
      await deleteTaskApi(task._id);
    } catch (err) {
      setTasks(previousTasks);
      console.log("DELETE ERROR:", err.response?.data || err.message);
    } finally {
      setDeletingTaskId(null);
    }
  };

  const saveCurrentView = () => {
    const trimmed = saveViewName.trim();

    if (!trimmed) {
      return;
    }

    const next = [
      ...savedViews,
      {
        id: crypto.randomUUID(),
        name: trimmed,
        filters,
      },
    ];

    setSavedViews(next);
    localStorage.setItem(SAVED_VIEW_KEY, JSON.stringify(next));
    setSaveViewName("");
  };

  const deleteSavedView = (viewId) => {
    const next = savedViews.filter((view) => view.id !== viewId);
    setSavedViews(next);
    localStorage.setItem(SAVED_VIEW_KEY, JSON.stringify(next));
  };

  const filteredTasks = tasks.filter((task) => {
    const queryValue = filters.query.trim().toLowerCase();
    const title = (task.title || "").toLowerCase();
    const subject = task.subject || "";
    const priority = task.priority || "";
    const status = task.status || "pending";
    const deadline = task.deadline ? new Date(task.deadline) : null;

    const startDate = filters.startDate ? new Date(filters.startDate) : null;
    const endDate = filters.endDate ? new Date(filters.endDate) : null;

    if (queryValue && !title.includes(queryValue) && !subject.toLowerCase().includes(queryValue)) {
      return false;
    }

    if (filters.subject !== "all" && subject !== filters.subject) {
      return false;
    }

    if (filters.priority !== "all" && priority !== filters.priority) {
      return false;
    }

    if (filters.status !== "all" && status !== filters.status) {
      return false;
    }

    if (startDate && (!deadline || deadline < startDate)) {
      return false;
    }

    if (endDate) {
      const nextDay = new Date(endDate);
      nextDay.setDate(nextDay.getDate() + 1);
      if (!deadline || deadline >= nextDay) {
        return false;
      }
    }

    return true;
  });

  const subjects = [...new Set(tasks.map((task) => task.subject).filter(Boolean))].sort();

  const { dueToday, overdue } = tasks.reduce(
    (accumulator, task) => {
      const deadline = task.deadline ? new Date(task.deadline) : null;
      const today = new Date();

      if (deadline && task.status !== "completed") {
        const sameDay =
          deadline.getFullYear() === today.getFullYear() &&
          deadline.getMonth() === today.getMonth() &&
          deadline.getDate() === today.getDate();

        if (sameDay) {
          accumulator.dueToday.push(task);
        }

        if (deadline < today) {
          accumulator.overdue.push(task);
        }
      }

      return accumulator;
    },
    { dueToday: [], overdue: [] }
  );

  const completed = tasks.filter((task) => task.status === "completed").length;
  const pending = tasks.length - completed;

  return (
    <section className="tasks-page">

      <div className="tasks-header">
        <div>
          <h1>Tasks</h1>
          <p>Plan, prioritize, and keep every deadline under control.</p>
        </div>

        <button onClick={() => setShowModal(true)} className="add-top" type="button">
          Create Task
        </button>
      </div>

      <div className="tasks-stat-grid">
        <StatCard label="Total" value={tasks.length} />
        <StatCard label="Completed" value={completed} tone="success" />
        <StatCard label="Pending" value={pending} tone="warning" />
      </div>

      <div className="tasks-alert-grid">
        <StatCard label="Due Today" value={dueToday.length} tone="warning" />
        <StatCard label="Overdue" value={overdue.length} tone="danger" />
        <div className="tasks-notification-card">
          <h3>Focus Summary</h3>
          <p>Quickly review what needs attention today and what is already overdue.</p>
        </div>
      </div>

      <TaskFilters
        filters={filters}
        subjects={subjects}
        onChange={handleFilterChange}
        onReset={() => setFilters(defaultFilters)}
        savedViews={savedViews}
        saveViewName={saveViewName}
        onSaveViewNameChange={setSaveViewName}
        onSaveCurrentView={saveCurrentView}
        onApplySavedView={setFilters}
        onDeleteSavedView={deleteSavedView}
        quickViews={quickViews}
        onApplyQuickView={setFilters}
      />

      {loading ? (
        <div className="empty-state">
          <h3>Loading tasks...</h3>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <HiOutlineClipboardDocumentCheck />
          </div>
          <h3>No tasks found</h3>
          <p>Try adjusting filters or create a new task.</p>
          <button type="button" className="add-top" onClick={() => setShowModal(true)}>
            Create Task
          </button>
        </div>
      ) : (
        <div className="task-grid">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onToggleStatus={toggleTaskStatus}
              onDelete={deleteTask}
              isUpdating={updatingTaskId === task._id}
              isDeleting={deletingTaskId === task._id}
            />
          ))}
        </div>
      )}

      <TaskModal
        open={showModal}
        form={form}
        onChange={handleChange}
        onClose={() => setShowModal(false)}
        onSubmit={addTask}
      />
    </section>
  );
}

export default Tasks;