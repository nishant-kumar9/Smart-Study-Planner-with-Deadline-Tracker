import { useEffect, useMemo, useState } from "react";
import ActivityHeatmap from "../components/ActivityHeatmap";
import StatCard from "../components/StatCard";
import { fetchTasksApi } from "../services/taskService";
import { getStoredUser } from "../services/userStorage";
import { calculateStreakMetrics } from "../utils/taskAnalytics";
import "./Profile.css";

function Profile() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = getStoredUser();

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await fetchTasksApi();
        setTasks(data);
      } catch (error) {
        console.log("PROFILE TASK FETCH ERROR:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  const completed = tasks.filter((task) => task.status === "completed").length;
  const completionRate = tasks.length === 0 ? 0 : Math.round((completed / tasks.length) * 100);
  const { currentStreak, longestStreak } = useMemo(() => calculateStreakMetrics(tasks), [tasks]);

  return (
    <section className="profile-page">
      <div className="profile-head">
        <h1>Profile & Insights</h1>
        <p>Track consistency, streaks, and daily completion momentum.</p>
      </div>

      <div className="profile-layout">
        <section className="profile-user-card">
          <h2>{user.name || "Student User"}</h2>
          <p>{user.email || "No email available"}</p>

          <div className="profile-divider" />

          <div className="profile-meta-row">
            <span>Current streak</span>
            <strong>{currentStreak} days</strong>
          </div>

          <div className="profile-meta-row">
            <span>Longest streak</span>
            <strong>{longestStreak} days</strong>
          </div>
        </section>

        <div className="profile-stats-wrap">
          <div className="profile-stat-grid">
            <StatCard label="Completed Tasks" value={completed} tone="success" />
            <StatCard label="Completion Rate" value={`${completionRate}%`} />
            <StatCard label="Total Tasks" value={tasks.length} tone="warning" />
          </div>

          {loading ? (
            <section className="profile-panel">
              <p className="muted">Loading profile activity...</p>
            </section>
          ) : (
            <ActivityHeatmap tasks={tasks} title="Daily Completion Heatmap" days={84} />
          )}
        </div>
      </div>

      {!loading && tasks.length === 0 && (
        <section className="profile-panel empty">
          <p>No task activity yet. Add tasks and complete them to build your streak history.</p>
        </section>
      )}
    </section>
  );
}

export default Profile;