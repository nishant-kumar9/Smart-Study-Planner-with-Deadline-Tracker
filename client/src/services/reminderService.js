const REMINDER_STORAGE_KEY = "taskReminderSentMap";

const getTodayKey = () => new Date().toISOString().slice(0, 10);

const getStoredReminderMap = () => {
  try {
    const raw = localStorage.getItem(REMINDER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const setStoredReminderMap = (map) => {
  localStorage.setItem(REMINDER_STORAGE_KEY, JSON.stringify(map));
};

const getDayBounds = () => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  return { startOfDay, endOfDay };
};

const shouldNotifyTask = (map, taskId, type) => {
  const today = getTodayKey();
  const key = `${taskId}:${type}:${today}`;
  return !map[key];
};

const markNotified = (map, taskId, type) => {
  const today = getTodayKey();
  const key = `${taskId}:${type}:${today}`;
  map[key] = true;
};

export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    return "unsupported";
  }

  if (Notification.permission === "granted") {
    return "granted";
  }

  const permission = await Notification.requestPermission();
  return permission;
};

export const classifyTaskAlerts = (tasks) => {
  const { startOfDay, endOfDay } = getDayBounds();

  const dueToday = [];
  const overdue = [];

  tasks.forEach((task) => {
    if (!task.deadline || task.status === "completed") {
      return;
    }

    const deadline = new Date(task.deadline);

    if (deadline < startOfDay) {
      overdue.push(task);
      return;
    }

    if (deadline >= startOfDay && deadline < endOfDay) {
      dueToday.push(task);
    }
  });

  return { dueToday, overdue };
};

export const notifyTaskAlerts = (tasks) => {
  if (!("Notification" in window) || Notification.permission !== "granted") {
    return;
  }

  const { dueToday, overdue } = classifyTaskAlerts(tasks);
  const reminderMap = getStoredReminderMap();

  dueToday.forEach((task) => {
    if (!shouldNotifyTask(reminderMap, task._id, "today")) {
      return;
    }

    new Notification("Task due today", {
      body: `${task.title} (${task.subject}) is due today.`,
    });

    markNotified(reminderMap, task._id, "today");
  });

  overdue.forEach((task) => {
    if (!shouldNotifyTask(reminderMap, task._id, "overdue")) {
      return;
    }

    new Notification("Task overdue", {
      body: `${task.title} (${task.subject}) is overdue.`,
    });

    markNotified(reminderMap, task._id, "overdue");
  });

  setStoredReminderMap(reminderMap);
};
