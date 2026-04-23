import { HiOutlineBookmark, HiOutlineMagnifyingGlass, HiOutlineTrash } from "react-icons/hi2";
import "./TaskFilters.css";

function TaskFilters({
  filters,
  subjects,
  onChange,
  onReset,
  savedViews,
  saveViewName,
  onSaveViewNameChange,
  onSaveCurrentView,
  onApplySavedView,
  onDeleteSavedView,
  quickViews,
  onApplyQuickView,
}) {
  return (
    <section className="task-filters-card">
      <div className="task-filters-top">
        <h2>Search, Filters and Views</h2>
        <button type="button" className="filter-reset" onClick={onReset}>
          Reset Filters
        </button>
      </div>

      <div className="task-filters-grid">
        <label className="filter-input with-icon">
          Search
          <span>
            <HiOutlineMagnifyingGlass />
            <input
              name="query"
              value={filters.query}
              onChange={onChange}
              placeholder="Search title or subject"
            />
          </span>
        </label>

        <label className="filter-input">
          Subject
          <select name="subject" value={filters.subject} onChange={onChange}>
            <option value="all">All</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </label>

        <label className="filter-input">
          Priority
          <select name="priority" value={filters.priority} onChange={onChange}>
            <option value="all">All</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </label>

        <label className="filter-input">
          Status
          <select name="status" value={filters.status} onChange={onChange}>
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </label>

        <label className="filter-input">
          From Date
          <input type="date" name="startDate" value={filters.startDate} onChange={onChange} />
        </label>

        <label className="filter-input">
          To Date
          <input type="date" name="endDate" value={filters.endDate} onChange={onChange} />
        </label>
      </div>

      <div className="quick-view-wrap">
        <h3>Quick Views</h3>
        <div className="quick-view-list">
          {quickViews.map((view) => (
            <button key={view.id} type="button" className="quick-view-btn" onClick={() => onApplyQuickView(view.filters)}>
              {view.name}
            </button>
          ))}
        </div>
      </div>

      <div className="saved-view-wrap">
        <h3>Saved Views</h3>

        <div className="saved-view-create">
          <label className="filter-input with-icon full-width">
            View Name
            <span>
              <HiOutlineBookmark />
              <input
                value={saveViewName}
                onChange={(event) => onSaveViewNameChange(event.target.value)}
                placeholder="Example: High Priority This Week"
              />
            </span>
          </label>
          <button type="button" className="save-view-btn" onClick={onSaveCurrentView}>
            Save Current View
          </button>
        </div>

        {savedViews.length === 0 ? (
          <p className="saved-empty">No saved views yet.</p>
        ) : (
          <div className="saved-view-list">
            {savedViews.map((view) => (
              <article key={view.id} className="saved-view-item">
                <button type="button" onClick={() => onApplySavedView(view.filters)}>
                  {view.name}
                </button>
                <button
                  type="button"
                  className="saved-delete"
                  onClick={() => onDeleteSavedView(view.id)}
                  aria-label={`Delete saved view ${view.name}`}
                >
                  <HiOutlineTrash />
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default TaskFilters;
