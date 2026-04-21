import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/tasks")
      .then(res => setTasks(res.data))
      .catch(err => console.log(err));
  }, []);

  const completed = tasks.filter(t => t.status === "completed").length;

  return (
    <div style={{ color: "white" }}>
      <h1>📊 Dashboard</h1>

      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <div style={card}>Total: {tasks.length}</div>
        <div style={card}>Completed: {completed}</div>
        <div style={card}>Pending: {tasks.length - completed}</div>
      </div>
    </div>
  );
}

const card = {
  background: "#1e293b",
  padding: "20px",
  borderRadius: "10px"
};

export default Dashboard;