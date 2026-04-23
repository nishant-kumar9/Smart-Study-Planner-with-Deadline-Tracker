import { useEffect, useMemo, useState } from "react";
import StatCard from "../components/StatCard";
import TrendBarChart from "../components/TrendBarChart";
import LineTrendChart from "../components/LineTrendChart";
import { fetchTasksApi } from "../services/taskService";
import { getSubjectBreakdown, getWeeklyCompletionData } from "../utils/taskAnalytics";
import "./Progress.css";

function Progress() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await fetchTasksApi();
        setTasks(data);
      } catch (error) {
        console.log("PROGRESS TASK FETCH ERROR:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  const completed = tasks.filter((task) => task.status === "completed").length;
  const total = tasks.length;
  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

  const weeklyCompletion = useMemo(() => getWeeklyCompletionData(tasks, 7), [tasks]);
  const subjectData = useMemo(() => getSubjectBreakdown(tasks), [tasks]);

  return (
    <section className="progress-page">
      <div className="progress-head">
        <h1>Progress Analytics</h1>
        <p>Measure productivity trends and completion consistency over time.</p>
      </div>

      <div className="progress-stat-grid">
        <StatCard label="Tasks Completed" value={completed} tone="success" />
        <StatCard label="Completion Rate" value={`${completionRate}%`} />
        <StatCard label="Total Tasks" value={total} tone="warning" />
      </div>

      {loading ? (
        <section className="progress-card">
          <p className="muted">Loading analytics...</p>
        </section>
      ) : (
        <>
          <div className="progress-chart-grid">
            <TrendBarChart title="Tasks Per Day (Last 7 Days)" data={weeklyCompletion} colorClass="primary" />
            <LineTrendChart title="Productivity Trend" data={weeklyCompletion} />
          </div>

          <section className="progress-card">
            <h2>Subject Performance Breakdown</h2>

            {subjectData.length === 0 ? (
              <p className="muted">No tasks available yet for subject analytics.</p>
            ) : (
              <div className="subject-list">
                {subjectData.map((subject) => {
                  const rate = subject.total === 0 ? 0 : Math.round((subject.completed / subject.total) * 100);

                  return (
                    <article key={subject.subject} className="subject-item">
                      <div>
                        <h3>{subject.subject}</h3>
                        <p>
                          {subject.completed} of {subject.total} completed
                        </p>
                      </div>

                      <div className="subject-meter-wrap">
                        <span>{rate}%</span>
                        <div className="subject-meter-track">
                          <div className="subject-meter-fill" style={{ width: `${rate}%` }} />
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </>
      )}
    </section>
  );
}

export default Progress;