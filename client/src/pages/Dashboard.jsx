import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await axios.get("http://localhost:5000/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTasks(res.data);
    };

    fetchTasks();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>

      {tasks.map((task) => (
        <div key={task._id}>
          <h3>{task.title}</h3>
          <p>{task.subject}</p>
          <p>{task.priority}</p>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;