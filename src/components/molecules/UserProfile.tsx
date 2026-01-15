import { useTranslation } from 'react-i18next';
import { LogOut, Mail, Hash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

export function UserProfile() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  
  if (!user) return null;

  const handleLogout = () => {
    logout();
    // Redirect to the specific URL requested
    window.location.href = 'http://localhost:5173/HIAST.Transportation.UI/login';
  };

  // Get initials for fallback avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const displayName = user.userName || user.email.split('@')[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className={cn(
            "relative h-10 w-10 rounded-full transition-all duration-300",
            "bg-gradient-to-tr from-primary/20 to-secondary/20 hover:from-primary/30 hover:to-secondary/30",
            "border border-border/50 shadow-sm",
            "focus:ring-2 focus:ring-primary/20"
          )}
        >
          <span className="flex h-full w-full items-center justify-center font-bold text-primary">
            {getInitials(displayName)}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-0 overflow-hidden border-border" align="end" forceMount>
        {/* Header Section with Gradient */}
        <div className="bg-gradient-to-br from-[hsl(var(--primary)/0.15)] via-[hsl(var(--primary)/0.05)] to-transparent p-6 border-b border-border">
          <div className="flex items-center gap-3 mb-3">
             <div className="h-14 w-14 rounded-full bg-background flex items-center justify-center border border-border shadow-sm text-xl font-bold text-[hsl(var(--primary))]">
                {getInitials(displayName)}
             </div>
             <div className="flex flex-col gap-1.5 overflow-hidden">
                <p className="text-lg font-bold leading-none tracking-tight text-foreground truncate">
                  {displayName}
                </p>
                {/* Roles Badge */}
                <div className="flex flex-wrap gap-1.5">
                  {user.roles.map((role) => (
                    <Badge 
                      key={role} 
                      variant="secondary" 
                      className="px-2 py-0.5 h-5 text-[10px] font-medium uppercase tracking-wider bg-[hsl(var(--secondary)/0.1)] text-[hsl(var(--secondary))] hover:bg-[hsl(var(--secondary)/0.2)] border-0"
                    >
                      {role}
                    </Badge>
                  ))}
                </div>
             </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-5 space-y-4 bg-card/50">
          <div className="flex items-start gap-3 text-sm group">
            <div className="h-9 w-9 rounded-md bg-[hsl(var(--muted))] flex items-center justify-center group-hover:bg-[hsl(var(--primary)/0.1)] transition-colors shrink-0">
              <Mail className="h-4.5 w-4.5 text-[hsl(var(--muted-foreground))] group-hover:text-[hsl(var(--primary))] transition-colors" />
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-[10px] uppercase text-[hsl(var(--muted-foreground))] font-semibold tracking-wider">{t('common.fields.email', 'Email')}</span>
              <span className="font-medium text-foreground/90 break-all leading-snug">{user.email}</span>
            </div>
          </div>

          {user.employeeNumber && (
            <div className="flex items-center gap-3 text-sm group">
              <div className="h-9 w-9 rounded-md bg-[hsl(var(--muted))] flex items-center justify-center group-hover:bg-[hsl(var(--primary)/0.1)] transition-colors shrink-0">
                <Hash className="h-4.5 w-4.5 text-[hsl(var(--muted-foreground))] group-hover:text-[hsl(var(--primary))] transition-colors" />
              </div>
               <div className="flex flex-col gap-0.5">
                <span className="text-[10px] uppercase text-[hsl(var(--muted-foreground))] font-semibold tracking-wider">{t('common.fields.employeeNumber', 'ID Number')}</span>
                <span className="font-medium text-foreground/90">{user.employeeNumber}</span>
              </div>
            </div>
          )}
        </div>

        <DropdownMenuSeparator className="my-0 bg-border" />
        
        {/* Actions Section */}
        <div className="p-2 bg-[hsl(var(--muted)/0.3)]">
          <DropdownMenuItem 
            onClick={handleLogout} 
            className="flex items-center gap-2 p-2.5 text-red-600 focus:text-red-700 focus:bg-red-50 dark:focus:bg-red-950/20 cursor-pointer rounded-md transition-colors font-medium"
          >
            <LogOut className="h-4 w-4" />
            <span>{t('auth.logout', 'Log out')}</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
