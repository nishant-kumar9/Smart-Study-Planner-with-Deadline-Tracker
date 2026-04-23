const formatDateInput = (date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const buildRecurringPayloads = (form) => {
  const recurrence = form.recurrence || "none";
  const repeatCount = recurrence === "none" ? 1 : Math.max(1, Number(form.repeatCount || 1));

  const intervalDays =
    recurrence === "daily"
      ? 1
      : recurrence === "weekly"
        ? 7
        : recurrence === "custom"
          ? Math.max(1, Number(form.customIntervalDays || 1))
          : 1;

  const baseDate = new Date(form.deadline);

  return Array.from({ length: repeatCount }).map((_, index) => {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + index * intervalDays);

    return {
      title: form.title,
      subject: form.subject,
      priority: form.priority,
      deadline: formatDateInput(date),
    };
  });
};
