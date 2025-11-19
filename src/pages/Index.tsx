export default function Dashboard() {
  const stats = [
    { title: 'Total Employees', value: '156' },
    { title: 'Available Buses', value: '24' },
    { title: 'Upcoming Schedules', value: '8' },
  ];

  const quickActions = [
    'Manage Employees',
    'View Schedule',
    'Bus Maintenance'
  ];

  return (
    <div className="dashboard">
      {/* Welcome Section */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Welcome to HIAST Transportation</h1>
        <p className="dashboard-subtitle">
          Manage your transportation system efficiently with real-time tracking and scheduling tools.
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-title">{stat.title}</div>
            <div className="stat-value">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2 className="actions-title">Quick Actions</h2>
        <div className="actions-grid">
          {quickActions.map((action, index) => (
            <button key={index} className="action-button">
              + {action}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}