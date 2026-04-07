// Exams.js — Upcoming Exams panel

const ExamsPanel = ({ exams, onAdd }) => {
  const getDaysUntil = (dateStr) => {
    const diff = new Date(dateStr) - new Date();
    return Math.ceil(diff / (1000*60*60*24));
  };

  const getCountdownClass = (days) => {
    if (days <= 5)  return 'urgent';
    if (days <= 14) return 'soon';
    return 'later';
  };

  const sorted = [...exams].sort((a, b) => new Date(a.date) - new Date(b.date));

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return {
      day:   d.getDate().toString().padStart(2,'0'),
      month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    };
  };

  return (
    <div className="panel">
      <div className="section-header">
        <span className="section-title">
          <span className="section-title-dot" style={{ background: 'var(--accent-rose)', boxShadow: '0 0 8px var(--accent-rose)' }}></span>
          UPCOMING EXAMS
        </span>
      </div>

      {sorted.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📅</div>
          No upcoming exams. Enjoy it while it lasts!
        </div>
      ) : (
        <div className="exam-list">
          {sorted.map(exam => {
            const days = getDaysUntil(exam.date);
            const { day, month } = formatDate(exam.date);
            return (
              <div key={exam.id} className="exam-item fade-in">
                <div className="exam-date-box">
                  <div className="exam-day">{day}</div>
                  <div className="exam-month">{month}</div>
                </div>
                <div className="exam-divider" />
                <div className="exam-info">
                  <div className="exam-subject">{exam.subject}</div>
                  <div className="exam-detail">
                    {exam.code} · {exam.location} · {exam.time}
                  </div>
                </div>
                <div className={`exam-countdown ${getCountdownClass(days)}`}>
                  {days > 0 ? `${days}d` : 'Today!'}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <button className="add-exam-btn" onClick={onAdd}>
        <Icons.Plus /> Add exam
      </button>
    </div>
  );
};
