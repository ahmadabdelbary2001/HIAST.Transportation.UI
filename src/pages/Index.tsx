// src/pages/Index.tsx

import useTheme from '@/hooks/useTheme';

export default function Dashboard() {
  const { theme, mode } = useTheme();
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
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/10 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">
            Welcome to HIAST Transportation
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto"> {/* تم إضافة mx-auto */}
            Manage your transportation system efficiently with real-time tracking and scheduling tools.
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="bg-card rounded-xl shadow-sm border border-border p-6 transition-all hover:shadow-md hover:scale-[1.02]"
            >
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
                {stat.title}
              </h3>
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <button 
                key={index} 
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-3 font-medium transition-colors flex items-center justify-center gap-2"
              >
                <span className="text-lg">+</span>
                {action}
              </button>
            ))}
          </div>
        </div>

        {/* Theme indicator */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          Current theme: <span className="font-medium">{theme === 'syrian' ? 'Syrian Identity' : 'Default'}</span>
          {' | '}
          Mode: <span className="font-medium">{mode}</span>
        </div>
      </div>
    </div>
  );
}