import { useEffect, useMemo, useRef, useState } from "react";
import {
  HiOutlinePencilSquare,
  HiOutlinePlus,
  HiOutlineXMark,
} from "react-icons/hi2";
import StatCard from "../components/StatCard";
import DashboardSections from "../components/DashboardSections";
import {
  createTaskApi,
  deleteTaskApi,
  fetchTasksApi,
  updateTaskApi,
} from "../services/taskService";
import useDocumentTitle from "../hooks/useDocumentTitle";
import "./Dashboard.css";

const defaultTaskForm = {
  title: "",
  subject: "",
  deadline: "",
  priority: "Medium",
};

const isSameDay = (leftDate, rightDate) => {
  const left = new Date(leftDate);
  const right = new Date(rightDate);

  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
};

const formatInputDate = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
};

const isUrgentTask = (task) => {
  if (!task.deadline || task.status === "completed") {
    return false;
  }

  const diff = new Date(task.deadline).getTime() - Date.now();
  return diff > 0 && diff <= 1000 * 60 * 60 * 48;
};

function Dashboard() {
  useDocumentTitle("Dashboard");

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [savePending, setSavePending] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [form, setForm] = useState(defaultTaskForm);
  const todayPanelRef = useRef(null);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await fetchTasksApi();
        setTasks(data);
      } catch (err) {
        console.log("DASHBOARD FETCH ERROR:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  const openCreateModal = () => {
    setEditingTask(null);
    setForm(defaultTaskForm);
    setModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setForm({
      title: task.title || "",
      subject: task.subject || "",
      deadline: formatInputDate(task.deadline),
      priority: task.priority || "Medium",
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingTask(null);
    setForm(defaultTaskForm);
  };

  const onFormChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
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
              updatedAt: new Date().toISOString(),
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
      console.log("DASHBOARD STATUS UPDATE ERROR:", err.response?.data || err.message);
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
      console.log("DASHBOARD DELETE ERROR:", err.response?.data || err.message);
    } finally {
      setDeletingTaskId(null);
    }
  };

  const saveTask = async () => {
    if (!form.title || !form.subject || !form.deadline) {
      alert("Please fill title, subject, and deadline.");
      return;
    }

    const payload = {
      title: form.title.trim(),
      subject: form.subject.trim(),
      deadline: form.deadline,
      priority: form.priority,
    };

    const previousTasks = [...tasks];
    setSavePending(true);

    if (editingTask) {
      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask._id === editingTask._id
            ? {
                ...currentTask,
                ...payload,
                updatedAt: new Date().toISOString(),
              }
            : currentTask
        )
      );

      try {
        const updatedTask = await updateTaskApi(editingTask._id, payload);
        setTasks((currentTasks) =>
          currentTasks.map((currentTask) =>
            currentTask._id === editingTask._id ? { ...currentTask, ...updatedTask } : currentTask
          )
        );
        closeModal();
      } catch (err) {
        setTasks(previousTasks);
        console.log("DASHBOARD EDIT ERROR:", err.response?.data || err.message);
      } finally {
        setSavePending(false);
      }

      return;
    }

    const tempId = `temp-${Date.now()}`;
    const optimisticTask = {
      ...payload,
      _id: tempId,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTasks((currentTasks) => [optimisticTask, ...currentTasks]);

    try {
      const createdTask = await createTaskApi(payload);
      setTasks((currentTasks) =>
        currentTasks.map((currentTask) => (currentTask._id === tempId ? createdTask : currentTask))
      );
      closeModal();
    } catch (err) {
      setTasks(previousTasks);
      console.log("DASHBOARD CREATE ERROR:", err.response?.data || err.message);
    } finally {
      setSavePending(false);
    }
  };

  const viewTodayTasks = () => {
    todayPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "completed").length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const todayTasks = useMemo(() => {
    const today = new Date();

    return tasks
      .filter((task) => task.deadline && isSameDay(task.deadline, today))
      .sort((firstTask, secondTask) => {
        if (firstTask.status === secondTask.status) {
          return new Date(firstTask.deadline) - new Date(secondTask.deadline);
        }

        return firstTask.status === "pending" ? -1 : 1;
      });
  }, [tasks]);

  const upcomingDeadlines = useMemo(
    () =>
      tasks
        .filter((task) => task.deadline && task.status !== "completed")
        .sort((firstTask, secondTask) => new Date(firstTask.deadline) - new Date(secondTask.deadline))
        .slice(0, 5),
    [tasks]
  );

  const weeklyInsight = useMemo(() => {
    const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const countsByDay = labels.reduce((accumulator, label) => {
      accumulator[label] = 0;
      return accumulator;
    }, {});

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 6);

    tasks
      .filter((task) => task.status === "completed")
      .forEach((task) => {
        const completionDate = new Date(task.updatedAt || task.createdAt || task.deadline);
        if (completionDate >= oneWeekAgo) {
          const dayLabel = completionDate.toLocaleDateString("en-US", { weekday: "short" });
          countsByDay[dayLabel] = (countsByDay[dayLabel] || 0) + 1;
        }
      });

    const chartData = labels.map((label) => ({ label, value: countsByDay[label] || 0 }));
    const tasksCompletedThisWeek = chartData.reduce((sum, point) => sum + point.value, 0);
    const mostActivePoint = [...chartData].sort((firstPoint, secondPoint) => secondPoint.value - firstPoint.value)[0];

    return {
      chartData,
      tasksCompletedThisWeek,
      mostActiveDay: mostActivePoint?.value ? mostActivePoint.label : "No activity yet",
    };
  }, [tasks]);

  const dashboardStats = [
    { label: "Total Tasks", value: totalTasks },
    { label: "Completed Tasks", value: completedTasks, tone: "success" },
    { label: "Pending Tasks", value: pendingTasks, tone: "warning" },
    { label: "Completion Rate", value: `${completionRate}%`, tone: "default" },
  ];

  return (
    <section className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">Smart Study Planner</p>
          <h1>Productivity command center</h1>
          <p>
            Prioritize the day, handle deadlines early, and manage tasks without jumping between
            pages.
          </p>
        </div>

        <button type="button" className="dashboard-primary-btn" onClick={openCreateModal}>
          <HiOutlinePlus />
          Add Task
        </button>
      </header>

      <div className="stats-grid">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} tone={stat.tone} />
        ))}
      </div>

      <DashboardSections
        loading={loading}
        allTasks={tasks}
        todayTasks={todayTasks}
        upcomingDeadlines={upcomingDeadlines}
        weeklyInsight={weeklyInsight}
        onAddTask={openCreateModal}
        onViewToday={viewTodayTasks}
        onToggleStatus={toggleTaskStatus}
        onDeleteTask={deleteTask}
        onEditTask={openEditModal}
        todayPanelRef={todayPanelRef}
        isTaskUpdating={updatingTaskId}
        isTaskDeleting={deletingTaskId}
        isUrgentTask={isUrgentTask}
      />

      {modalOpen && (
        <div className="dashboard-modal-overlay" role="dialog" aria-modal="true">
          <div className="dashboard-modal-card">
            <div className="dashboard-modal-top">
              <div>
                <p className="dashboard-eyebrow">{editingTask ? "Edit Task" : "Create Task"}</p>
                <h2>{editingTask ? "Update your task" : "Add a new task"}</h2>
              </div>
              <button
                type="button"
                aria-label="Close task modal"
                className="dashboard-close-btn"
                onClick={closeModal}
              >
                <HiOutlineXMark />
              </button>
            </div>

            <div className="dashboard-modal-grid">
              <label>
                Title
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={onFormChange}
                  placeholder="Finish chemistry assignment"
                />
              </label>

              <label>
                Subject
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={onFormChange}
                  placeholder="Chemistry"
                />
              </label>

              <label>
                Deadline
                <input type="date" name="deadline" value={form.deadline} onChange={onFormChange} />
              </label>

              <label>
                Priority
                <select name="priority" value={form.priority} onChange={onFormChange}>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </label>
            </div>

            <div className="dashboard-modal-actions">
              <button type="button" className="dashboard-ghost-btn" onClick={closeModal}>
                Cancel
              </button>
              <button type="button" className="dashboard-primary-btn" onClick={saveTask}>
                <HiOutlinePencilSquare />
                {savePending
                  ? "Saving..."
                  : editingTask
                    ? "Save Changes"
                    : "Create Task"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Dashboard;