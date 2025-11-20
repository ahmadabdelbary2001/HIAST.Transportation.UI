// src/pages/Index.tsx

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
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
    <div className="min-h-screen bg-theme-primary p-6 md:p-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">
            Welcome to HIAST Transportation
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Manage your transportation system efficiently with real-time tracking and scheduling tools.
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="bg-theme-secondary rounded-xl shadow-sm border border-border p-6 transition-all hover:shadow-md hover:scale-[1.02] hover:border-primary/20 theme-card"
            >
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
                {stat.title}
              </h3>
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-theme-secondary rounded-xl shadow-sm border border-border p-6 transition-colors duration-200 theme-card">
          <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Button 
                key={index}
                variant="default"
                size="lg"
                className="flex items-center justify-center gap-2 h-auto py-4 px-6 text-base font-medium transition-all duration-200 hover:shadow-md"
              >
                <Plus className="h-5 w-5" />
                {action}
              </Button>
            ))}
          </div>
        </div>

        {/* Theme indicator */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          Current theme: <span className="font-medium text-foreground">{theme === 'syrian' ? 'Syrian Identity' : theme === 'pastel' ? 'Soft Pastel' : 'Default'}</span>
          {' | '}
          Mode: <span className="font-medium text-foreground">{mode}</span>
        </div>
      </div>
    </div>
  );
}