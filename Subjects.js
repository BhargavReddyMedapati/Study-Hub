// src/components/Subjects.js
import React, { useState } from 'react';
import { Icons } from './Icons';

/* ── Trash icon ── */
const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14H6L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4h6v2"/>
  </svg>
);

/* ──────────────────────────────────
   Manage Subjects Modal
   Full list with pin toggle + delete
────────────────────────────────── */
const ManageSubjectsModal = ({ subjects, onClose, onTogglePin, onDelete }) => {
  const [confirmId, setConfirmId] = useState(null);

  const handleDelete = (id) => {
    if (confirmId === id) {
      onDelete(id);
      setConfirmId(null);
    } else {
      setConfirmId(id);
      setTimeout(() => setConfirmId(c => c === id ? null : c), 3000);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ width: 560 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
          <div className="modal-title" style={{ margin: 0 }}>Manage Subjects</div>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {subjects.length} total · {subjects.filter(s => s.pinned).length} pinned
          </span>
        </div>

        {/* Subject list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 420, overflowY: 'auto' }}>
          {subjects.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📚</div>
              No subjects yet. Add one!
            </div>
          ) : (
            subjects.map(s => (
              <div key={s.id} className="manage-subject-row">
                {/* Color dot + icon */}
                <div className="manage-subject-icon" style={{ background: `${s.color}20` }}>
                  {s.icon}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {s.code} · {s.notes} notes · {s.tasks} tasks · {s.progress}%
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ width: 60 }}>
                  <div className="subject-progress-bar">
                    <div className="subject-progress-fill" style={{ width: `${s.progress}%`, background: s.color }} />
                  </div>
                </div>

                {/* Pin toggle */}
                <button
                  className={`subject-pin-btn ${s.pinned ? 'pinned' : ''}`}
                  onClick={() => onTogglePin(s.id)}
                  title={s.pinned ? 'Unpin' : 'Pin to top'}
                  style={{ fontSize: 16 }}
                >
                  {s.pinned ? '★' : '☆'}
                </button>

                {/* Delete button — 2-click confirm */}
                <button
                  onClick={() => handleDelete(s.id)}
                  title={confirmId === s.id ? 'Click again to confirm delete' : 'Delete subject'}
                  style={{
                    background: confirmId === s.id ? 'rgba(255,95,126,0.2)' : 'transparent',
                    border: `1px solid ${confirmId === s.id ? 'var(--accent-rose)' : 'var(--border)'}`,
                    color: confirmId === s.id ? 'var(--accent-rose)' : 'var(--text-muted)',
                    borderRadius: 6,
                    width: 30, height: 30,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: confirmId === s.id ? 13 : 'inherit',
                    fontWeight: confirmId === s.id ? 700 : 'normal',
                    transition: 'all 0.2s',
                    flexShrink: 0,
                  }}
                >
                  {confirmId === s.id ? '✕' : <TrashIcon />}
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="modal-actions" style={{ marginTop: 20 }}>
          {confirmId && (
            <span style={{ fontSize: 11, color: 'var(--accent-rose)', fontFamily: 'var(--font-mono)', marginRight: 'auto' }}>
              Click ✕ again to confirm delete
            </span>
          )}
          <button className="btn btn-ghost" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
};

/* ──────────────────────────────────
   Pinned chips row
────────────────────────────────── */
export const PinnedSubjects = ({ subjects, onAdd, onTogglePin, onDelete }) => {
  const [showManage, setShowManage] = useState(false);
  const pinned = subjects.filter(s => s.pinned);

  return (
    <div style={{ marginBottom: 32 }}>
      <div className="section-header">
        <span className="section-title">
          <span>⭐</span> Pinned Subjects
        </span>
        <button className="section-action" onClick={() => setShowManage(true)}>
          manage →
        </button>
      </div>

      <div className="pinned-scroll-wrap">
        <div className="pinned-chips">
          {pinned.length === 0 && (
            <span style={{ fontSize: 12, color: 'var(--text-muted)', padding: '8px 4px' }}>
              No pinned subjects. Star a subject to pin it.
            </span>
          )}
          {pinned.map(s => (
            <div key={s.id} className="pinned-chip">
              <span className="chip-dot" style={{ background: s.color }} />
              <span className="chip-name">{s.name}</span>
              <span className="chip-code">{s.code}</span>
            </div>
          ))}
          <button className="pinned-chip-add" onClick={onAdd} title="Add subject">
            <Icons.Plus />
          </button>
        </div>
      </div>

      {/* Manage modal */}
      {showManage && (
        <ManageSubjectsModal
          subjects={subjects}
          onClose={() => setShowManage(false)}
          onTogglePin={onTogglePin}
          onDelete={onDelete}
        />
      )}
    </div>
  );
};

/* ──────────────────────────────────
   Single subject card
────────────────────────────────── */
const SubjectCard = ({ subject, onTogglePin, onDelete }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const color = subject.color || '#4f8eff';

  const handleDelete = (e) => {
    e.stopPropagation();
    if (confirmDelete) {
      onDelete(subject.id);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  return (
    <div className="subject-card fade-in">
      <div className="subject-card-top">
        <div className="subject-icon" style={{ background: `${color}20` }}>
          {subject.icon}
        </div>

        {/* Top-right: pin + delete */}
        <div style={{ display: 'flex', gap: 4 }}>
          <button
            className={`subject-pin-btn ${subject.pinned ? 'pinned' : ''}`}
            onClick={(e) => { e.stopPropagation(); onTogglePin(subject.id); }}
            title={subject.pinned ? 'Unpin' : 'Pin'}
          >
            {subject.pinned ? '★' : '☆'}
          </button>

          <button
            className="subject-pin-btn"
            onClick={handleDelete}
            title={confirmDelete ? 'Click again to confirm delete' : 'Delete subject'}
            style={{
              color: confirmDelete ? 'var(--accent-rose)' : undefined,
              background: confirmDelete ? 'rgba(255,95,126,0.12)' : undefined,
            }}
          >
            {confirmDelete ? '✕' : <TrashIcon />}
          </button>
        </div>
      </div>

      <div className="subject-code">{subject.code}</div>
      <div className="subject-name">{subject.name}</div>
      <div className="subject-desc">{subject.description}</div>

      <div className="subject-meta">
        <span className="meta-pill notes">📝 {subject.notes} notes</span>
        <span className="meta-pill tasks">✓ {subject.tasks} tasks</span>
        <div className="subject-progress-row" style={{ marginLeft: 'auto' }}>
          <div className="subject-progress-bar">
            <div
              className="subject-progress-fill"
              style={{ width: `${subject.progress}%`, background: color }}
            />
          </div>
          <span className="subject-pct">{subject.progress}%</span>
        </div>
      </div>
    </div>
  );
};

/* ──────────────────────────────────
   All subjects grid
────────────────────────────────── */
export const SubjectsGrid = ({ subjects, onTogglePin, onAdd, onDelete, searchQuery }) => {
  const filtered = subjects.filter(s =>
    s.name.toLowerCase().includes((searchQuery || '').toLowerCase()) ||
    s.code.toLowerCase().includes((searchQuery || '').toLowerCase())
  );

  return (
    <div style={{ marginBottom: 32 }}>
      <div className="section-header">
        <span className="section-title">ALL SUBJECTS</span>
        <button className="section-action" onClick={onAdd}>+ add subject</button>
      </div>

      <div className="subjects-grid">
        {filtered.map(s => (
          <SubjectCard
            key={s.id}
            subject={s}
            onTogglePin={onTogglePin}
            onDelete={onDelete}
          />
        ))}
        <div className="subject-card-add fade-in" onClick={onAdd}>
          <div className="add-icon-circle"><Icons.Plus /></div>
          <span className="add-label">Add Subject</span>
        </div>
      </div>
    </div>
  );
};