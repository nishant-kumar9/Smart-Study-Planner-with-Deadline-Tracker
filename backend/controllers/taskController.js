const Task = require("../models/Task");

// CREATE TASK
exports.createTask = async (req, res) => {
  try {
    const { title, subject, deadline, priority, notes } = req.body;

    const task = await Task.create({
      title,
      subject,
      deadline,
      priority,
      notes,
      userId: req.user
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL TASKS (ONLY USER'S TASKS)
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE TASK
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    Object.assign(task, req.body);

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE TASK
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};