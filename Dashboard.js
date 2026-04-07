// Dashboard.js — Overview stats cards

const OverviewCards = ({ subjects, tasks, exams }) => {
  // Compute stats
  const totalSubjects  = subjects.length;
  const tasksDue       = tasks.filter(t => !t.done).length;
  const overdueCount   = tasks.filter(t => !t.done && t.priority === 'HIGH').length;
  const examCount      = exams.length;
  const nextExamDays   = exams.length > 0
    ? Math.min(...exams.map(e => {
        const diff = new Date(e.date) - new Date();
        return Math.ceil(diff / (1000*60*60*24));
      }).filter(d => d >= 0))
    : null;
  const completedPct   = tasks.length > 0
    ? Math.round((tasks.filter(t => t.done).length / tasks.length) * 100)
    : 0;

  const cards = [
    {
      cls: 'blue',
      label: 'SUBJECTS',
      value: totalSubjects,
      sub: `${subjects.filter(s => s.pinned).length} pinned`,
    },
    {
      cls: 'amber',
      label: 'TASKS DUE',
      value: tasksDue,
      sub: `${overdueCount} high priority`,
    },
    {
      cls: 'rose',
      label: 'EXAMS',
      value: examCount,
      sub: nextExamDays !== null ? `next in ${nextExamDays} days` : 'none scheduled',
    },
    {
      cls: 'teal',
      label: 'COMPLETED',
      value: `${completedPct}%`,
      sub: 'this week',
    },
  ];

  return (
    <div className="overview-grid">
      {cards.map(card => (
        <div key={card.label} className={`overview-card ${card.cls} fade-in`}>
          <div className="overview-label">{card.label}</div>
          <div className="overview-value">{card.value}</div>
          <div className="overview-sub">{card.sub}</div>
        </div>
      ))}
    </div>
  );
};
