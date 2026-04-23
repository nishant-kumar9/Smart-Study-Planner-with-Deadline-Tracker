import DayCell from "./DayCell";
import "./CalendarGrid.css";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const areDatesEqual = (first, second) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

const getMonthCells = (monthDate) => {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();

  const firstDayOffset = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];

  for (let index = 0; index < firstDayOffset; index += 1) {
    cells.push(null);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(year, month, day));
  }

  while (cells.length < 35 || cells.length % 7 !== 0) {
    cells.push(null);
  }

  if (cells.length > 42) {
    return cells.slice(0, 42);
  }

  return cells;
};

function CalendarGrid({
  monthDate,
  selectedDate,
  daySummaries,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
  onGoToday,
}) {
  const today = new Date();
  const cells = getMonthCells(monthDate);

  return (
    <section className="calendar-panel">
      <div className="calendar-nav-row">
        <div className="calendar-nav-left">
          <button type="button" className="calendar-nav-btn" onClick={onPrevMonth} aria-label="Previous month">
            &lt;
          </button>
          <button type="button" className="calendar-nav-btn" onClick={onGoToday}>
            Today
          </button>
        </div>

        <h2 className="calendar-month-label">
          {monthDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h2>

        <button type="button" className="calendar-nav-btn" onClick={onNextMonth} aria-label="Next month">
          &gt;
        </button>
      </div>

      <div className="calendar-weekdays" role="row">
        {WEEKDAYS.map((label) => (
          <span key={label} className="calendar-weekday" role="columnheader">
            {label}
          </span>
        ))}
      </div>

      <div className="calendar-grid" role="grid" aria-label="Calendar month grid">
        {cells.map((cellDate, index) => {
          if (!cellDate) {
            return <div key={"empty-" + index} className="day-cell-empty" aria-hidden="true" />;
          }

          const dayKey = [
            cellDate.getFullYear(),
            String(cellDate.getMonth() + 1).padStart(2, "0"),
            String(cellDate.getDate()).padStart(2, "0"),
          ].join("-");

          const summary = daySummaries.get(dayKey);

          return (
            <DayCell
              key={dayKey}
              date={cellDate}
              summary={summary}
              isSelected={areDatesEqual(cellDate, selectedDate)}
              isToday={areDatesEqual(cellDate, today)}
              onSelect={onSelectDate}
            />
          );
        })}
      </div>
    </section>
  );
}

export default CalendarGrid;
