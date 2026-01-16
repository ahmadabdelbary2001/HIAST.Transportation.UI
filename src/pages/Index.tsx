import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  Bus, 
  Users, 
  Map, 
  CreditCard, 
  ShieldCheck, 
  ArrowRight,
  Activity,
  Loader2,
  Ticket
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { dashboardService, type DashboardStats } from '@/services/dashboardService';
import { employeeApiService } from '@/services/employeeApiService';
import { useAuth } from '@/hooks/useAuth';

export default function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [employeeName, setEmployeeName] = useState<string>('');
  const [subscriptionInfo, setSubscriptionInfo] = useState<{
      isActive: boolean;
      lineName?: string;
      lineId?: number;
  } | null>(null);

  const isAdmin = user?.roles.includes('Administrator');

  useEffect(() => {
    const fetchData = async () => {
        try {
            setError(null);
            
            if (isAdmin) {
                const data = await dashboardService.getStats();
                setStats(data);
            } else if (user?.id) {
                // Fetch employee details for non-admins to get full name AND subscription info
                const employee = await employeeApiService.getById(user.id);
                setEmployeeName(`${employee.firstName} ${employee.lastName}`);
                
                // Store subscription info from hydrated employee object
                setSubscriptionInfo({
                    isActive: employee.isSubscriptionActive,
                    lineName: employee.subscribedLineName,
                    lineId: employee.subscribedLineId
                });
            }
        } catch (err) {
            console.error('Failed to fetch dashboard data:', err);
            setError('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    fetchData();
  }, [t, isAdmin, user]);

  const statsCards = [
    { 
      title: t('dashboard.stats.activeBuses', 'Active Buses'), 
      value: stats?.activeBuses?.toString() ?? '-', 
      icon: Bus,
      gradient: "from-blue-500/10 to-blue-500/5",
      iconColor: "text-blue-600"
    },
    { 
      title: t('dashboard.stats.activeRoutes', 'Active Routes'), 
      value: stats?.totalLines?.toString() ?? '-', 
      icon: Map,
      gradient: "from-emerald-500/10 to-emerald-500/5",
      iconColor: "text-emerald-600"
    },
    { 
      title: t('dashboard.stats.totalEmployees', 'Employees'), 
      value: stats?.totalEmployees?.toString() ?? '-', 
      icon: Users,
      gradient: "from-violet-500/10 to-violet-500/5",
      iconColor: "text-violet-600"
    },
    { 
      title: t('dashboard.stats.subscriptions', 'Subscriptions'), 
      value: stats?.totalSubscriptions?.toString() ?? '-', 
      icon: CreditCard,
      gradient: "from-amber-500/10 to-amber-500/5",
      iconColor: "text-amber-600"
    },
  ];

  const allQuickActions = [
    {
      title: t('dashboard.actions.manageLines', 'Manage Lines'),
      description: t('dashboard.actions.manageLinesDesc', 'View and modify bus routes and stops.'),
      icon: Map,
      path: ROUTES.LINES,
      color: "text-emerald-600",
      bg: "bg-emerald-100 dark:bg-emerald-950/30",
      roles: ['Administrator']
    },
    {
      title: t('dashboard.actions.fleetManagement', 'Fleet Management'),
      description: t('dashboard.actions.fleetManagementDesc', 'Track buses, maintenance, and assignments.'),
      icon: Bus,
      path: ROUTES.BUSES,
      color: "text-blue-600",
      bg: "bg-blue-100 dark:bg-blue-950/30",
      roles: ['Administrator']
    },
    {
      title: t('dashboard.actions.employeeDirectory', 'Employee Directory'),
      description: t('dashboard.actions.employeeDirectoryDesc', 'Manage staff records and access.'),
      icon: Users,
      path: ROUTES.EMPLOYEES,
      color: "text-violet-600",
      bg: "bg-violet-100 dark:bg-violet-950/30",
      roles: ['Administrator']
    },
    {
      title: t('dashboard.actions.subscriptions', 'Subscriptions'),
      description: t('dashboard.actions.subscriptionsDesc', 'Handle monthly passes and renewals.'),
      icon: CreditCard,
      path: ROUTES.SUBSCRIPTIONS,
      color: "text-amber-600",
      bg: "bg-amber-100 dark:bg-amber-950/30",
      roles: ['Administrator']
    },
    {
      title: t('dashboard.actions.driverReports', 'Driver Reports'),
      description: t('dashboard.actions.driverReportsDesc', 'View logs and performance metrics.'),
      icon: ShieldCheck,
      path: ROUTES.DRIVERS,
      color: "text-indigo-600",
      bg: "bg-indigo-100 dark:bg-indigo-950/30",
      roles: ['Administrator']
    },
    // Employee Specific Actions
    {
        title: t('dashboard.actions.viewLines', 'View Lines'),
        description: t('dashboard.actions.viewLinesDesc', 'Browse available bus routes and stops.'),
        icon: Map,
        path: ROUTES.LINES,
        color: "text-emerald-600",
        bg: "bg-emerald-100 dark:bg-emerald-950/30",
        roles: ['Employee']
    },
    {
        // Dynamic Card logic
        title: subscriptionInfo?.isActive 
            ? `${t('employee.subscribedLine')}: ${subscriptionInfo.lineName}` 
            : t('dashboard.actions.subscribeNow'),
        description: subscriptionInfo?.isActive
            ? t('dashboard.actions.mySubscriptionDesc') // "View your current subscription details"
            : t('dashboard.actions.subscribeNowDesc'), // "Subscribe now..."
        icon: subscriptionInfo?.isActive ? Ticket : CreditCard,
        path: subscriptionInfo?.isActive && subscriptionInfo.lineId 
            ? ROUTES.LINE_DETAIL.replace(':id', subscriptionInfo.lineId.toString()) 
            : ROUTES.LINES,
        color: subscriptionInfo?.isActive ? "text-primary" : "text-amber-600",
        bg: subscriptionInfo?.isActive ? "bg-primary/10" : "bg-amber-100 dark:bg-amber-950/30",
        roles: ['Employee']
    }
  ];

  const filteredActions = allQuickActions.filter(action => {
      if (isAdmin) return action.roles.includes('Administrator');
      return action.roles.includes('Employee');
  });

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-2">
            {isAdmin 
                ? t('dashboard.welcome', 'Welcome to 2AF Work') 
                : t('dashboard.welcomeEmployee', { name: employeeName || user?.userName || 'Employee' })}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            {t('dashboard.subtitle', 'Smart management for routes, fleet, and employee mobility.')}
          </p>
        </div>
        {isAdmin && (
            <div className="flex items-center gap-2">
            <Button variant="outline" className={cn("gap-2", error ? "text-red-500 border-red-200" : "")}>
                <Activity className="h-4 w-4" />
                {error ? t('dashboard.fetchError', 'System Warning') : t('dashboard.systemStatus', 'System Online')}
            </Button>
            <div className={cn("h-2 w-2 rounded-full animate-pulse", error ? "bg-red-500" : "bg-green-500")}></div>
            </div>
        )}
      </div>

      {/* Stats Grid - Admin Only */}
      {isAdmin && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statsCards.map((stat, index) => (
            <Card key={index} className={cn("overflow-hidden border-none shadow-md", "bg-card relative group hover:shadow-lg transition-all duration-300")}>
                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50 transition-opacity group-hover:opacity-100", stat.gradient)} />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    {stat.title}
                </CardTitle>
                <stat.icon className={cn("h-5 w-5", stat.iconColor)} />
                </CardHeader>
                <CardContent className="relative z-10">
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                </CardContent>
            </Card>
            ))}
        </div>
      )}

      {/* Quick Actions Grid */}
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-4 flex items-center gap-2">
            {t('dashboard.quickAccess', 'Quick Access')}
            <div className="h-px bg-border flex-1 ml-4 opacity-50"></div>
        </h2>
        <div className="flex flex-wrap justify-center gap-6 mt-12">
          {filteredActions.map((action, index) => (
            <Card 
              key={index} 
              className="w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] max-w-sm group cursor-pointer hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20 relative overflow-hidden"
              onClick={() => navigate(action.path)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent group-hover:from-primary/5 group-hover:to-transparent transition-all duration-500" />
              
              <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-2">
                <div className={cn("p-2.5 rounded-lg shrink-0 transition-colors duration-300", action.bg)}>
                  <action.icon className={cn("h-6 w-6", action.color)} />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors">
                    {action.title}
                  </CardTitle>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
              </CardHeader>
              <CardContent>
                 <CardDescription className="text-sm leading-relaxed">
                    {action.description}
                 </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
