// Header.js — Top navigation bar

const Header = ({ activePage, searchQuery, setSearchQuery }) => {
  const pageTitles = {
    dashboard: 'Study Hub',
    subjects:  'All Subjects',
    tasks:     'My Tasks',
    planner:   'Weekly Planner',
  };

  const now = new Date();
  const dayName = now.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  const monthYear = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase();

  return (
    <header className="header">
      {/* Title block */}
      <div className="header-title-block">
        <div className="header-eyebrow">// {dayName} · {monthYear}</div>
        <div className="header-title">{pageTitles[activePage] || 'Study Hub'}</div>
      </div>

      {/* Search */}
      <div className="header-search">
        <Icons.Search />
        <input
          type="text"
          placeholder="Search subjects, notes, tasks..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Profile */}
      <div className="header-profile">
        <div className="profile-info">
          <div className="profile-name">Alex Chen</div>
          <div className="profile-sub">Semester 6</div>
        </div>
        <div className="avatar">AC</div>
      </div>
    </header>
  );
};
