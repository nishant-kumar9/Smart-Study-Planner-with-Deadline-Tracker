import "./EmptyState.css";

function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  compact = false,
}) {
  return (
    <div className={`empty-state-card ${compact ? "compact" : ""}`}>
      {Icon ? (
        <div className="empty-state-icon">
          <Icon />
        </div>
      ) : null}

      <h3>{title}</h3>
      <p>{description}</p>

      {actionLabel && onAction ? (
        <button type="button" className="empty-state-action" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

export default EmptyState;
