import "./TrendBarChart.css";

function TrendBarChart({ title, data, colorClass = "primary" }) {
  const maxValue = Math.max(...data.map((entry) => entry.value), 1);

  return (
    <section className="chart-card">
      <h3>{title}</h3>

      <div className="bars-wrap">
        {data.map((entry) => (
          <div key={entry.key || entry.label} className="bar-item">
            <div
              className={`bar-fill ${colorClass}`}
              style={{ height: `${Math.max((entry.value / maxValue) * 100, 8)}%` }}
              title={`${entry.label}: ${entry.value}`}
            />
            <span>{entry.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TrendBarChart;
