import { HiOutlineXMark } from "react-icons/hi2";
import "./TaskModal.css";

function TaskModal({ open, form, onChange, onClose, onSubmit }) {
  if (!open) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card">
        <div className="modal-top">
          <div>
            <h2>Create New Task</h2>
            <p>Add a focused task with priority and deadline.</p>
          </div>

          <button type="button" onClick={onClose} className="close-btn" aria-label="Close modal">
            <HiOutlineXMark />
          </button>
        </div>

        <div className="modal-grid">
          <label>
            Title
            <input
              name="title"
              placeholder="Chapter 5 revision"
              value={form.title}
              onChange={onChange}
            />
          </label>

          <label>
            Subject
            <input
              name="subject"
              placeholder="Physics"
              value={form.subject}
              onChange={onChange}
            />
          </label>

          <label>
            Deadline
            <input
              type="date"
              name="deadline"
              value={form.deadline}
              onChange={onChange}
            />
          </label>

          <label>
            Priority
            <select
              name="priority"
              value={form.priority}
              onChange={onChange}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </label>

          <label>
            Repeat
            <select name="recurrence" value={form.recurrence} onChange={onChange}>
              <option value="none">No repeat</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="custom">Custom interval</option>
            </select>
          </label>

          {form.recurrence !== "none" && (
            <label>
              Number of Tasks to Generate
              <input
                type="number"
                min="1"
                max="30"
                name="repeatCount"
                value={form.repeatCount}
                onChange={onChange}
              />
            </label>
          )}

          {form.recurrence === "custom" && (
            <label>
              Interval Days
              <input
                type="number"
                min="1"
                max="30"
                name="customIntervalDays"
                value={form.customIntervalDays}
                onChange={onChange}
              />
            </label>
          )}
        </div>

        <div className="modal-actions">
          <button type="button" className="secondary-btn" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="primary-btn" onClick={onSubmit}>
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskModal;
