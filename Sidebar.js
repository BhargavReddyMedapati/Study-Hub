// Sidebar.js — Left navigation panel

const Sidebar = ({ activePage, setActivePage }) => {
  const navItems = [
    { id: 'dashboard', icon: Icons.Dashboard, label: 'Dashboard' },
    { id: 'subjects',  icon: Icons.Subjects,  label: 'Subjects' },
    { id: 'tasks',     icon: Icons.Tasks,     label: 'Tasks' },
    { id: 'planner',   icon: Icons.Planner,   label: 'Planner' },
  ];

  return (
    <nav className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">SH</div>

      {/* Navigation buttons */}
      <div className="sidebar-nav">
        {navItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            className={`nav-btn ${activePage === id ? 'active' : ''}`}
            onClick={() => setActivePage(id)}
            title={label}
          >
            <Icon />
          </button>
        ))}
      </div>

      {/* Settings at bottom */}
      <div className="sidebar-bottom">
        <button className="nav-btn" title="Settings">
          <Icons.Settings />
        </button>
      </div>
    </nav>
  );
};
