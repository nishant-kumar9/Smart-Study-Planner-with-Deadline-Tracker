import { useEffect, useState } from "react";
import axios from "axios";
import StatCard from "../components/StatCard";
import "./Dashboard.css";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setTasks(res.data))
      .catch((err) => console.log(err));
  }, [token]);

  const completed = tasks.filter((t) => t.status === "completed").length;
  const pending = tasks.length - completed;
  const dueSoon = [...tasks]
    .filter((task) => task.deadline)
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 4);

  return (
    <section className="dashboard-page">
      <div className="page-title-row">
        <div>
          <h1>Dashboard</h1>
          <p>Track workload, completion, and upcoming deadlines.</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard label="Total Tasks" value={tasks.length} />
        <StatCard label="Completed" value={completed} tone="success" />
        <StatCard label="Pending" value={pending} tone="warning" />
      </div>

      <section className="dashboard-panel">
        <h2>Upcoming Deadlines</h2>

        {dueSoon.length === 0 ? (
          <p className="muted">No deadlines yet. Add your first task to get started.</p>
        ) : (
          <div className="deadline-list">
            {dueSoon.map((task) => (
              <article key={task._id} className="deadline-item">
                <div>
                  <h3>{task.title}</h3>
                  <p>{task.subject}</p>
                </div>

                <span>
                  {new Date(task.deadline).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}

export default Dashboard;