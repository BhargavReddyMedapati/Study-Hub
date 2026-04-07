// src/components/Tasks.js
import React, { useState } from 'react';
import { Icons } from './Icons';

/* ── Trash icon ── */
const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15 }}>
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14H6L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4h6v2"/>
  </svg>
);

const TasksPanel = ({ tasks, onToggle, onAdd, onDelete }) => {
  const [confirmId, setConfirmId] = useState(null);

  const priorityOrder = { HIGH: 0, MED: 1, LOW: 2 };
  const sorted = [...tasks].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    return (priorityOrder[a.priority] ?? 2) - (priorityOrder[b.priority] ?? 2);
  });

  const handleDelete = (e, id) => {
    e.stopPropagation(); // prevent toggling the task
    if (confirmId === id) {
      onDelete(id);
      setConfirmId(null);
    } else {
      setConfirmId(id);
      // Auto-cancel confirm after 3s
      setTimeout(() => setConfirmId(c => c === id ? null : c), 3000);
    }
  };

  return (
    <div className="panel">
      <div className="section-header">
        <span className="section-title">
          <span className="section-title-dot" />
          TODAY'S TASKS
        </span>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          {tasks.filter(t => !t.done).length} remaining
        </span>
      </div>

      {sorted.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">✅</div>
          All caught up! No tasks yet.
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

              {/* Priority */}
              <span className={`priority-badge ${task.priority}`}>{task.priority}</span>

              {/* Delete — click once to arm, click again to confirm */}
              <button
                className={`task-delete-btn ${confirmId === task.id ? 'confirming' : ''}`}
                onClick={(e) => handleDelete(e, task.id)}
                title={confirmId === task.id ? 'Click again to confirm' : 'Delete task'}
              >
                {confirmId === task.id ? '✕' : <TrashIcon />}
              </button>
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

export default TasksPanel;