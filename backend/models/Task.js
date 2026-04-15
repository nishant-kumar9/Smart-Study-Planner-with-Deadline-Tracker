const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: String,
  subject: String,
  deadline: Date,
  priority: String,
  status: {
    type: String,
    default: "pending"
  },
  notes: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);