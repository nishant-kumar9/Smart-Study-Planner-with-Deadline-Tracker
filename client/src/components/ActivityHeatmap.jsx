import { formatDateKey, getCompletionMap } from "../utils/taskAnalytics";
import "./ActivityHeatmap.css";

const buildLastNDays = (days) => {
  const output = [];

  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - offset);
    output.push(date);
  }

  return output;
};

const getHeatLevel = (value) => {
  if (value >= 4) return "level-4";
  if (value >= 3) return "level-3";
  if (value >= 2) return "level-2";
  if (value >= 1) return "level-1";
  return "level-0";
};

function ActivityHeatmap({ tasks, title = "Activity Heatmap", days = 84 }) {
  const completionMap = getCompletionMap(tasks);
  const heatDays = buildLastNDays(days);

  return (
    <section className="heatmap-card">
      <div className="heatmap-head">
        <h3>{title}</h3>
        <p>Last {days} days of completed-task activity.</p>
      </div>

      <div className="heatmap-grid">
        {heatDays.map((day) => {
          const key = formatDateKey(day);
          const value = completionMap.get(key) || 0;

          return (
            <span
              key={key}
              className={`heat-cell ${getHeatLevel(value)}`}
              title={`${day.toDateString()}: ${value} completed`}
              aria-label={`${key} completed tasks ${value}`}
            />
          );
        })}
      </div>
    </section>
  );
}

export default ActivityHeatmap;
