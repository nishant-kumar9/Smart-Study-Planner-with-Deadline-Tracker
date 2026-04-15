const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  createTask,
  getTasks,
  updateTask,
  deleteTask
} = require("../controllers/taskController");

// All routes are protected
router.use(protect);

router.post("/", createTask);
router.get("/", getTasks);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;