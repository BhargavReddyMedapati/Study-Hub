// Tasks.js — Today's Tasks panel

const TasksPanel = ({ tasks, onToggle, onAdd }) => {
  // Show today's tasks first (sort: undone → done, then by priority)
  const priorityOrder = { HIGH: 0, MED: 1, LOW: 2 };
  const sorted = [...tasks].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    return (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2);
  });

  return (
    <div className="panel">
      <div className="section-header">
        <span className="section-title">
          <span className="section-title-dot"></span>
          TODAY'S TASKS
        </span>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          {tasks.filter(t => !t.done).length} remaining
        </span>
      </div>

      {sorted.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">✅</div>
          All caught up! No tasks for today.
        </div>
      ) : (
        <div className="task-list">
          {sorted.map(task => (
            <div
              key={task.id}
              className={`task-item ${task.done ? 'done' : ''}`}
              onClick={() => onToggle(task.id)}
            >
              {/* Checkbox */}
              <div className={`task-checkbox ${task.done ? 'checked' : ''}`}>
                {task.done && <Icons.Check />}
              </div>

              {/* Info */}
              <div className="task-info">
                <div className="task-text">{task.name}</div>
                <div className="task-meta-row">
                  <span>{task.subject}</span>
                  {task.time && <span>· {task.time}</span>}
                </div>
              </div>

              {/* Priority badge */}
              <span className={`priority-badge ${task.priority}`}>{task.priority}</span>
            </div>
          ))}
        </div>
      )}

      <button className="add-task-btn" onClick={onAdd}>
        <Icons.Plus /> Add task
      </button>
    </div>
  );
};
