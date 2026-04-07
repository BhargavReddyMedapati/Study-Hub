// Modals.js — All modal dialog components

const { useState } = React;

/* ── Add Subject Modal ── */
const AddSubjectModal = ({ onClose, onAdd }) => {
  const [form, setForm] = useState({
    name: '', code: '', description: '', icon: '📖', color: '#4f8eff', progress: 0
  });

  const colors = ['#4f8eff','#9b6fff','#2ddbb4','#f5a623','#ff5f7e','#3ddc84','#ff9f43'];
  const icons  = ['📖','💡','⚙️','📐','🌐','🧠','📊','🔬','🎯','⚡','🔥','💻'];

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.name.trim() || !form.code.trim()) return;
    onAdd({
      ...form,
      id: Date.now(),
      pinned: false,
      notes: 0,
      tasks: 0,
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">Add Subject</div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Subject Name</label>
            <input className="form-input" placeholder="e.g. Data Structures"
              value={form.name} onChange={e => set('name', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Course Code</label>
            <input className="form-input" placeholder="e.g. CS201"
              value={form.code} onChange={e => set('code', e.target.value)} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-textarea" placeholder="Brief description of the subject..."
            value={form.description} onChange={e => set('description', e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">Icon</label>
          <div className="color-options">
            {icons.map(icon => (
              <button key={icon}
                onClick={() => set('icon', icon)}
                style={{
                  background: form.icon === icon ? 'var(--bg-elevated)' : 'none',
                  border: `2px solid ${form.icon === icon ? 'var(--accent-blue)' : 'transparent'}`,
                  borderRadius: 8, padding: '4px 6px', cursor: 'pointer', fontSize: 18,
                }}
              >{icon}</button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Color</label>
          <div className="color-options">
            {colors.map(c => (
              <div key={c} className={`color-opt ${form.color === c ? 'selected' : ''}`}
                style={{ background: c }} onClick={() => set('color', c)} />
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Progress ({form.progress}%)</label>
          <input type="range" min="0" max="100" value={form.progress}
            onChange={e => set('progress', parseInt(e.target.value))}
            style={{ width:'100%', accentColor: 'var(--accent-blue)' }} />
        </div>

        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>Add Subject</button>
        </div>
      </div>
    </div>
  );
};

/* ── Add Task Modal ── */
const AddTaskModal = ({ onClose, onAdd, subjects }) => {
  const [form, setForm] = useState({
    name: '', subject: subjects[0]?.code || '', priority: 'MED', time: ''
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    onAdd({ ...form, id: Date.now(), done: false });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">Add Task</div>

        <div className="form-group">
          <label className="form-label">Task Name</label>
          <input className="form-input" placeholder="e.g. Read Chapter 4 — Graphs"
            value={form.name} onChange={e => set('name', e.target.value)} />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Subject</label>
            <select className="form-select" value={form.subject} onChange={e => set('subject', e.target.value)}>
              {subjects.map(s => <option key={s.id} value={s.code}>{s.code} — {s.name}</option>)}
              <option value="General">General</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Priority</label>
            <select className="form-select" value={form.priority} onChange={e => set('priority', e.target.value)}>
              <option value="HIGH">HIGH</option>
              <option value="MED">MED</option>
              <option value="LOW">LOW</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Due Time (optional)</label>
          <input className="form-input" type="time" value={form.time}
            onChange={e => set('time', e.target.value)} />
        </div>

        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>Add Task</button>
        </div>
      </div>
    </div>
  );
};

/* ── Add Exam Modal ── */
const AddExamModal = ({ onClose, onAdd, subjects }) => {
  const [form, setForm] = useState({
    subject: subjects[0]?.name || '',
    code:    subjects[0]?.code || '',
    date: '', time: '', location: ''
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubjectChange = (code) => {
    const s = subjects.find(s => s.code === code);
    set('code', code);
    if (s) set('subject', s.name);
  };

  const handleSubmit = () => {
    if (!form.subject.trim() || !form.date) return;
    onAdd({ ...form, id: Date.now() });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">Add Exam</div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Subject</label>
            <select className="form-select" value={form.code} onChange={e => handleSubjectChange(e.target.value)}>
              {subjects.map(s => <option key={s.id} value={s.code}>{s.code} — {s.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Exam Name</label>
            <input className="form-input" placeholder="e.g. Mid 2 / Final"
              value={form.subject} onChange={e => set('subject', e.target.value)} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Date</label>
            <input className="form-input" type="date" value={form.date}
              onChange={e => set('date', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Time</label>
            <input className="form-input" type="time" value={form.time}
              onChange={e => set('time', e.target.value)} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Location / Mode</label>
          <input className="form-input" placeholder="e.g. Hall A / Online"
            value={form.location} onChange={e => set('location', e.target.value)} />
        </div>

        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>Schedule Exam</button>
        </div>
      </div>
    </div>
  );
};

/* ── Add Planner Task Modal ── */
const AddPlannerTaskModal = ({ onClose, onAdd, subjects, defaultDate }) => {
  const [form, setForm] = useState({
    name: '', subject: subjects[0]?.code || '', priority: 'MED',
    time: '', duration: '', date: defaultDate || ''
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    onAdd({ ...form, id: Date.now(), done: false });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">Add to Planner</div>

        <div className="form-group">
          <label className="form-label">Task Name</label>
          <input className="form-input" placeholder="e.g. OS Assignment — Final Review"
            value={form.name} onChange={e => set('name', e.target.value)} />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Subject</label>
            <select className="form-select" value={form.subject} onChange={e => set('subject', e.target.value)}>
              {subjects.map(s => <option key={s.id} value={s.code}>{s.code}</option>)}
              <option value="General">General</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Priority</label>
            <select className="form-select" value={form.priority} onChange={e => set('priority', e.target.value)}>
              <option value="HIGH">HIGH</option>
              <option value="MED">MED</option>
              <option value="LOW">LOW</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Start Time</label>
            <input className="form-input" type="time" value={form.time}
              onChange={e => set('time', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Duration (min)</label>
            <input className="form-input" type="number" min="5" step="5" placeholder="60"
              value={form.duration} onChange={e => set('duration', e.target.value)} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Date</label>
          <input className="form-input" type="date" value={form.date}
            onChange={e => set('date', e.target.value)} />
        </div>

        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>Add to Planner</button>
        </div>
      </div>
    </div>
  );
};
