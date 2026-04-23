import "./LineTrendChart.css";

function LineTrendChart({ title, data }) {
  const width = 480;
  const height = 170;
  const padding = 24;

  const maxValue = Math.max(...data.map((entry) => entry.value), 1);

  const points = data
    .map((entry, index) => {
      const x = padding + (index * (width - padding * 2)) / Math.max(data.length - 1, 1);
      const y = height - padding - (entry.value / maxValue) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <section className="line-chart-card">
      <h3>{title}</h3>

      <svg viewBox={`0 0 ${width} ${height}`} className="line-chart-svg" role="img" aria-label={title}>
        <polyline points={points} className="trend-line" />

        {data.map((entry, index) => {
          const x = padding + (index * (width - padding * 2)) / Math.max(data.length - 1, 1);
          const y = height - padding - (entry.value / maxValue) * (height - padding * 2);

          return <circle key={entry.key || entry.label} cx={x} cy={y} r="4" className="trend-dot" />;
        })}
      </svg>

      <div className="line-labels">
        {data.map((entry) => (
          <span key={entry.key || entry.label}>{entry.label}</span>
        ))}
      </div>
    </section>
  );
}

export default LineTrendChart;
