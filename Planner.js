// src/components/Planner.js
import React, { useState, useMemo } from 'react';
import { Icons } from './Icons';

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

const getWeekDates = (offset = 0) => {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday
  const monday = new Date(now);
  monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1) + offset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
};

const PlannerSection = ({ plannerTasks, onAddTask }) => {
  const [weekOffset,   setWeekOffset]   = useState(0);
  const [selectedDay,  setSelectedDay]  = useState(() => {
    const day = new Date().getDay();
    return day === 0 ? 6 : day - 1;
  });

  const weekDates = useMemo(() => getWeekDates(weekOffset), [weekOffset]);

  const selectedDate = weekDates[selectedDay];
  const dateKey = selectedDate ? selectedDate.toISOString().split('T')[0] : null;
  const dayTasks = plannerTasks.filter(t => t.date === dateKey);

  const getDotColor = (priority) =>
    ({ HIGH: '#ff5f7e', MED: '#f5a623', LOW: '#3ddc84' }[priority] || '#4f8eff');

  const getTaskDots = (date) => {
    const key = date.toISOString().split('T')[0];
    return plannerTasks.filter(t => t.date === key).slice(0, 3);
  };

  const weekLabel = () => {
    const start = weekDates[0];
    const end   = weekDates[6];
    return `Week of ${start.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} – ${end.toLocaleDateString('en-US', { day: 'numeric', year: 'numeric' })}`;
  };

  return (
    <div className="planner-section">
      {/* Header */}
      <div className="planner-header-row">
        <div className="planner-title-block">
          <div className="planner-eyebrow">// PLANNER</div>
          <div className="planner-week-label">{weekLabel()}</div>
        </div>
        <div className="planner-nav">
          <button className="planner-nav-btn" onClick={() => setWeekOffset(w => w - 1)}>
            <Icons.ChevronLeft />
          </button>
          <button className="planner-nav-btn" onClick={() => setWeekOffset(w => w + 1)}>
            <Icons.ChevronRight />
          </button>
        </div>
      </div>

      {/* Day selector */}
      <div className="day-selector">
        {weekDates.map((date, i) => {
          const dots    = getTaskDots(date);
          const isToday = date.toDateString() === new Date().toDateString();
          return (
            <button
              key={i}
              className={`day-btn ${selectedDay === i ? 'active' : ''}`}
              onClick={() => setSelectedDay(i)}
            >
              <span className="day-name">{DAYS[i]}</span>
              <span
                className="day-num"
                style={isToday && selectedDay !== i ? { color: 'var(--accent-teal)' } : {}}
              >
                {date.getDate()}
              </span>
              <div className="day-dots">
                {dots.map((t, j) => (
                  <span key={j} className="day-dot" style={{ background: getDotColor(t.priority) }} />
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Task list */}
      {dayTasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🗓️</div>
          No tasks planned for this day.
        </div>
      ) : (
        <div className="planner-tasks">
          {[...dayTasks]
            .sort((a, b) => (a.time || '').localeCompare(b.time || ''))
            .map(task => (
              <div key={task.id} className="planner-task fade-in">
                <span className="planner-time">{task.time || '—'}</span>
                <div className="planner-task-info">
                  <div className="planner-task-name">{task.name}</div>
                  <div className="planner-task-sub">{task.subject}</div>
                </div>
                <div className="planner-task-right">
                  <span className={`priority-badge ${task.priority}`}>{task.priority}</span>
                  {task.duration && (
                    <span className="duration-badge">{task.duration} min</span>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}

      <button className="add-planner-btn" onClick={() => onAddTask(dateKey)}>
        <Icons.Plus /> Add task to {DAYS[selectedDay]}
      </button>
    </div>
  );
};

export default PlannerSection;