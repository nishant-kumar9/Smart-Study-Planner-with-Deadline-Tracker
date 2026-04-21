import { useEffect, useState } from "react";
import axios from "axios";
import "./Tasks.css";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    title: "",
    subject: "",
    priority: "Low",
    deadline: "",
  });

  const token = localStorage.getItem("token");

  // FETCH TASKS
  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`, // 🔥 FIXED
        },
      });

      console.log("TASKS:", res.data); // DEBUG
      setTasks(res.data);
    } catch (err) {
      console.log("GET ERROR:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // INPUT
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      title: "",
      subject: "",
      priority: "Low",
      deadline: "",
    });
  };

  // ADD TASK
  const addTask = async () => {
    if (!form.title || !form.subject || !form.deadline) {
      alert("Fill all fields");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/tasks",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`, // 🔥 FIXED
          },
        }
      );

      resetForm();
      setShowModal(false);
      fetchTasks();
    } catch (err) {
      console.log("POST ERROR:", err.response?.data || err.message);
    }
  };

  return (
    <div className="tasks-container">

      {/* HEADER */}
      <div className="tasks-header">
        <div>
          <h2>Tasks</h2>
          <p>Manage your work</p>
        </div>

        <button onClick={() => setShowModal(true)} className="add-top">
          + Add Task
        </button>
      </div>

      {/* LIST */}
      {tasks.length === 0 ? (
        <p>No tasks found</p>
      ) : (
        tasks.map((task) => (
          <div key={task._id} className="task-card">
            <h3>{task.title}</h3>
            <p>{task.subject}</p>
          </div>
        ))
      )}

      {/* MODAL */}
      {showModal && (
        <div className="modal">
          <div className="modal-box">

            <input
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={handleChange}
            />

            <input
              name="subject"
              placeholder="Subject"
              value={form.subject}
              onChange={handleChange}
            />

            <input
              type="date"
              name="deadline"
              value={form.deadline}
              onChange={handleChange}
            />

            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            <button onClick={addTask}>Add</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>

          </div>
        </div>
      )}
    </div>
  );
}

export default Tasks;