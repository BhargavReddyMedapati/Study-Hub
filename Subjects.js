// Subjects.js — Pinned chips + All Subjects grid

const SUBJECT_COLORS = [
  '#4f8eff','#9b6fff','#2ddbb4','#f5a623','#ff5f7e','#3ddc84','#ff9f43','#54a0ff'
];

const SUBJECT_ICONS = ['💡','⚙️','📐','🌐','🧠','📊','🔬','📖','🎯','⚡'];

const PinnedSubjects = ({ subjects, onAdd }) => {
  const pinned = subjects.filter(s => s.pinned);
  return (
    <div style={{ marginBottom: 32 }}>
      <div className="section-header">
        <span className="section-title">
          <span>⭐</span> Pinned Subjects
        </span>
        <button className="section-action">manage →</button>
      </div>
      <div className="pinned-scroll-wrap">
        <div className="pinned-chips">
          {pinned.map(s => (
            <div key={s.id} className="pinned-chip">
              <span className="chip-dot" style={{ background: s.color }}></span>
              <span className="chip-name">{s.name}</span>
              <span className="chip-code">{s.code}</span>
            </div>
          ))}
          <button className="pinned-chip-add" onClick={onAdd} title="Add subject">
            <Icons.Plus />
          </button>
        </div>
      </div>
    </div>
  );
};

const SubjectCard = ({ subject, onTogglePin }) => {
  const progressColor = subject.color || '#4f8eff';
  return (
    <div className="subject-card fade-in">
      <div className="subject-card-top">
        <div className="subject-icon" style={{ background: `${progressColor}20` }}>
          {subject.icon}
        </div>
        <button
          className={`subject-pin-btn ${subject.pinned ? 'pinned' : ''}`}
          onClick={() => onTogglePin(subject.id)}
          title={subject.pinned ? 'Unpin' : 'Pin'}
        >
          {subject.pinned ? '★' : '☆'}
        </button>
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
              style={{ width: `${subject.progress}%`, background: progressColor }}
            />
          </div>
          <span className="subject-pct">{subject.progress}%</span>
        </div>
      </div>
    </div>
  );
};

const SubjectsGrid = ({ subjects, onTogglePin, onAdd, searchQuery }) => {
  const filtered = subjects.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ marginBottom: 32 }}>
      <div className="section-header">
        <span className="section-title">ALL SUBJECTS</span>
        <button className="section-action" onClick={onAdd}>+ add subject</button>
      </div>
      <div className="subjects-grid">
        {filtered.map(s => (
          <SubjectCard key={s.id} subject={s} onTogglePin={onTogglePin} />
        ))}
        <div className="subject-card-add fade-in" onClick={onAdd}>
          <div className="add-icon-circle"><Icons.Plus /></div>
          <span className="add-label">Add Subject</span>
        </div>
      </div>
    </div>
  );
};
