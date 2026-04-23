export const isSameDay = (firstDate, secondDate) => {
  const first = new Date(firstDate);
  const second = new Date(secondDate);

  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
};

export const formatDateKey = (dateLike) => {
  const date = new Date(dateLike);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const getCompletionMap = (tasks) => {
  const map = new Map();

  tasks
    .filter((task) => task.status === "completed")
    .forEach((task) => {
      const key = formatDateKey(task.updatedAt || task.createdAt || task.deadline);
      map.set(key, (map.get(key) || 0) + 1);
    });

  return map;
};

export const getWeeklyCompletionData = (tasks, days = 7) => {
  const completionMap = getCompletionMap(tasks);
  const output = [];

  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - offset);

    const key = formatDateKey(currentDate);

    output.push({
      label: currentDate.toLocaleDateString("en-US", { weekday: "short" }),
      value: completionMap.get(key) || 0,
      key,
    });
  }

  return output;
};

export const getSubjectBreakdown = (tasks) => {
  const subjectMap = new Map();

  tasks.forEach((task) => {
    const subjectName = task.subject || "General";
    const current = subjectMap.get(subjectName) || {
      subject: subjectName,
      total: 0,
      completed: 0,
    };

    current.total += 1;
    if (task.status === "completed") {
      current.completed += 1;
    }

    subjectMap.set(subjectName, current);
  });

  return [...subjectMap.values()].sort((first, second) => second.completed - first.completed);
};

export const calculateStreakMetrics = (tasks) => {
  const completionMap = getCompletionMap(tasks);

  if (completionMap.size === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const days = [...completionMap.keys()].sort();
  let longestStreak = 1;
  let currentRun = 1;

  for (let index = 1; index < days.length; index += 1) {
    const previous = new Date(days[index - 1]);
    const current = new Date(days[index]);

    const diff = Math.floor((current - previous) / (1000 * 60 * 60 * 24));

    if (diff === 1) {
      currentRun += 1;
      longestStreak = Math.max(longestStreak, currentRun);
    } else {
      currentRun = 1;
    }
  }

  let currentStreak = 0;
  const todayKey = formatDateKey(new Date());
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = formatDateKey(yesterday);

  if (completionMap.has(todayKey) || completionMap.has(yesterdayKey)) {
    let cursor = new Date();

    if (!completionMap.has(todayKey)) {
      cursor.setDate(cursor.getDate() - 1);
    }

    while (completionMap.has(formatDateKey(cursor))) {
      currentStreak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
  }

  return { currentStreak, longestStreak };
};
