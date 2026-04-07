// App.js — Root component
// Manages global state + localStorage persistence

const { useState, useEffect, useCallback } = React;

/* ── Default Seed Data ── */
const DEFAULT_SUBJECTS = [
  {
    id: 1, name: 'Data Structures', code: 'CS201',
    description: 'Arrays, linked lists, trees, graphs, and algorithm complexity analysis.',
    icon: '💡', color: '#4f8eff', pinned: true, notes: 5, tasks: 3, progress: 72,
  },
  {
    id: 2, name: 'Operating Systems', code: 'CS301',
    description: 'Process scheduling, memory management, file systems, and concurrency.',
    icon: '⚙️', color: '#9b6fff', pinned: true, notes: 8, tasks: 2, progress: 45,
  },
  {
    id: 3, name: 'Linear Algebra', code: 'MA201',
    description: 'Matrices, vector spaces, eigenvalues, linear transformations and applications.',
    icon: '📐', color: '#2ddbb4', pinned: true, notes: 6, tasks: 5, progress: 60,
  },
  {
    id: 4, name: 'Computer Networks', code: 'CS401',
    description: 'TCP/IP stack, routing protocols, network security and distributed systems.',
    icon: '🌐', color: '#f5a623', pinned: false, notes: 4, tasks: 2, progress: 30,
  },
  {
    id: 5, name: 'Machine Learning', code: 'CS501',
    description: 'Supervised, unsupervised learning, neural networks and model evaluation.',
    icon: '🧠', color: '#ff5f7e', pinned: false, notes: 3, tasks: 6, progress: 20,
  },
];

const today = new Date();
const fmtDate = (offsetDays) => {
  const d = new Date(today);
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

const DEFAULT_TASKS = [
  { id: 101, name: 'Read Ch.4 — Graphs', subject: 'CS201', priority: 'HIGH', time: '', done: true },
  { id: 102, name: 'Submit OS Assignment #3', subject: 'CS301', priority: 'HIGH', time: '23:59', done: false },
  { id: 103, name: 'Practice eigenvalue problems', subject: 'MA201', priority: 'MED', time: '', done: false },
  { id: 104, name: 'Review TCP/IP lecture slides', subject: 'CS401', priority: 'LOW', time: '', done: false },
];

const DEFAULT_EXAMS = [
  { id: 201, subject: 'Data Structures — Mid 2', code: 'CS201', date: fmtDate(5),  time: '10:00', location: 'Hall A' },
  { id: 202, subject: 'Linear Algebra Final',    code: 'MA201', date: fmtDate(12), time: '14:00', location: 'Hall C' },
  { id: 203, subject: 'Operating Systems Final', code: 'CS301', date: fmtDate(26), time: '09:00', location: 'Online' },
];

const DEFAULT_PLANNER = [
  { id: 301, name: 'OS Assignment #3 — Final Review', subject: 'CS301', priority: 'HIGH', time: '09:00', duration: '90', date: fmtDate(0), done: false },
  { id: 302, name: 'Graph traversal practice problems', subject: 'CS201', priority: 'MED', time: '11:30', duration: '60', date: fmtDate(0), done: false },
  { id: 303, name: 'Eigenvalues & eigenvectors worksheet', subject: 'MA201', priority: 'LOW', time: '14:00', duration: '45', date: fmtDate(0), done: false },
  { id: 304, name: 'Study TCP/IP protocol stack', subject: 'CS401', priority: 'MED', time: '10:00', duration: '60', date: fmtDate(1), done: false },
  { id: 305, name: 'ML model evaluation techniques', subject: 'CS501', priority: 'LOW', time: '15:00', duration: '45', date: fmtDate(2), done: false },
];

/* ── localStorage helpers ── */
const load = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
};

const save = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
};

/* ── Toast ── */
const Toast = ({ msg }) => (
  <div className="toast">
    <span className="toast-icon">✨</span>
    {msg}
  </div>
);

/* ── Main App ── */
const App = () => {
  const [activePage,   setActivePage]   = useState('dashboard');
  const [searchQuery,  setSearchQuery]  = useState('');
  const [subjects,     setSubjects]     = useState(() => load('sh_subjects',     DEFAULT_SUBJECTS));
  const [tasks,        setTasks]        = useState(() => load('sh_tasks',        DEFAULT_TASKS));
  const [exams,        setExams]        = useState(() => load('sh_exams',        DEFAULT_EXAMS));
  const [plannerTasks, setPlannerTasks] = useState(() => load('sh_planner',      DEFAULT_PLANNER));

  const [modal,        setModal]        = useState(null); // 'subject'|'task'|'exam'|'planner'
  const [plannerDate,  setPlannerDate]  = useState(null);
  const [toast,        setToast]        = useState(null);

  // Persist on change
  useEffect(() => save('sh_subjects',     subjects),     [subjects]);
  useEffect(() => save('sh_tasks',        tasks),        [tasks]);
  useEffect(() => save('sh_exams',        exams),        [exams]);
  useEffect(() => save('sh_planner',      plannerTasks), [plannerTasks]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  /* Actions */
  const addSubject = (s) => {
    setSubjects(prev => [...prev, s]);
    showToast(`"${s.name}" added!`);
  };

  const togglePin = (id) => {
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, pinned: !s.pinned } : s));
  };

  const addTask = (t) => {
    setTasks(prev => [...prev, t]);
    showToast('Task added!');
  };

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const addExam = (e) => {
    setExams(prev => [...prev, e]);
    showToast('Exam scheduled!');
  };

  const addPlannerTask = (t) => {
    setPlannerTasks(prev => [...prev, t]);
    showToast('Added to planner!');
  };

  const openPlannerAdd = (date) => {
    setPlannerDate(date);
    setModal('planner');
  };

  /* Page Rendering */
  const renderPage = () => {
    const isDashboard = activePage === 'dashboard';
    const isSubjects  = activePage === 'subjects';
    const isTasks     = activePage === 'tasks';
    const isPlanner   = activePage === 'planner';

    return (
      <div className="page-content">
        {/* Dashboard = overview + pinned + subjects + tasks + exams + planner */}
        {(isDashboard) && (
          <>
            <OverviewCards subjects={subjects} tasks={tasks} exams={exams} />
            <PinnedSubjects subjects={subjects} onAdd={() => setModal('subject')} />
            <SubjectsGrid
              subjects={subjects} onTogglePin={togglePin}
              onAdd={() => setModal('subject')} searchQuery={searchQuery}
            />
            <div className="bottom-grid">
              <TasksPanel tasks={tasks} onToggle={toggleTask} onAdd={() => setModal('task')} />
              <ExamsPanel exams={exams} onAdd={() => setModal('exam')} />
            </div>
            <PlannerSection plannerTasks={plannerTasks} onAddTask={openPlannerAdd} />
          </>
        )}

        {isSubjects && (
          <>
            <PinnedSubjects subjects={subjects} onAdd={() => setModal('subject')} />
            <SubjectsGrid
              subjects={subjects} onTogglePin={togglePin}
              onAdd={() => setModal('subject')} searchQuery={searchQuery}
            />
          </>
        )}

        {isTasks && (
          <div style={{ maxWidth: 600 }}>
            <TasksPanel tasks={tasks} onToggle={toggleTask} onAdd={() => setModal('task')} />
          </div>
        )}

        {isPlanner && (
          <PlannerSection plannerTasks={plannerTasks} onAddTask={openPlannerAdd} />
        )}
      </div>
    );
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      {/* Main */}
      <div className="main-content">
        <Header
          activePage={activePage}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        {renderPage()}
      </div>

      {/* Modals */}
      {modal === 'subject' && (
        <AddSubjectModal onClose={() => setModal(null)} onAdd={addSubject} />
      )}
      {modal === 'task' && (
        <AddTaskModal onClose={() => setModal(null)} onAdd={addTask} subjects={subjects} />
      )}
      {modal === 'exam' && (
        <AddExamModal onClose={() => setModal(null)} onAdd={addExam} subjects={subjects} />
      )}
      {modal === 'planner' && (
        <AddPlannerTaskModal
          onClose={() => setModal(null)}
          onAdd={addPlannerTask}
          subjects={subjects}
          defaultDate={plannerDate}
        />
      )}

      {/* Toast */}
      {toast && <Toast msg={toast} />}
    </div>
  );
};

// Mount React app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
