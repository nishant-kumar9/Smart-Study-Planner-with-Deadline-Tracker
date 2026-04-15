import { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    subject: "",
    deadline: "",
    priority: "Low",
    notes: ""
  });

  const token = localStorage.getItem("token");

  const fetchTasks = async () => {
    const res = await axios.get("http://localhost:5000/api/tasks", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAdd = async () => {
    await axios.post("http://localhost:5000/api/tasks", form, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchTasks();
  };

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      {/* FORM */}
      <div className="task-form">
        <input
          placeholder="Title"
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          placeholder="Subject"
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
        />
        <input
          type="date"
          onChange={(e) => setForm({ ...form, deadline: e.target.value })}
        />
        <select
          onChange={(e) => setForm({ ...form, priority: e.target.value })}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <input
          placeholder="Notes"
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
        <button onClick={handleAdd}>Add Task</button>
      </div>

      {/* TASK LIST */}
      {tasks.map((task) => (
        <div key={task._id} className="task-card">
          <h3>{task.title}</h3>
          <p>{task.subject}</p>
          <p>{task.priority}</p>
          <p>Status: {task.status}</p>
          <p>Deadline: {task.deadline}</p>
          <p>Notes: {task.notes || "No notes"}</p>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;