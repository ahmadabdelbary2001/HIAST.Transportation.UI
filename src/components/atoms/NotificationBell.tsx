import { Bell, Info, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNotification } from '@/hooks/useNotification';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import type { Notification } from '@/types';

export function NotificationBell() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();

  // Don't render if user is not authenticated
  if (!user) {
    return null;
  }

  return (
    <DropdownMenu dir={isRTL ? 'rtl' : 'ltr'}>
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
          <Bell className="h-5 w-5 text-primary" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground shadow-sm animate-in zoom-in border border-background">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align={isRTL ? "start" : "end"} className="w-80 p-0 overflow-hidden border-border" forceMount>
        {/* Header Section with Gradient */}
        <div className="bg-gradient-to-br from-[hsl(var(--primary)/0.15)] via-[hsl(var(--primary)/0.05)] to-transparent p-6 border-b border-border">
          <div className="flex items-center gap-3 mb-1">
             <div className="h-12 w-12 rounded-full bg-background flex items-center justify-center border border-border shadow-sm text-xl font-bold text-[hsl(var(--primary))] shrink-0">
                <Bell className="h-6 w-6" />
             </div>
             <div className="flex flex-col gap-1 overflow-hidden">
                <p className="text-lg font-bold leading-none tracking-tight text-foreground truncate">
                  {t('notifications.title')}
                </p>
                <p className="text-xs text-muted-foreground font-medium">
                  {unreadCount > 0 
                    ? t('notifications.unreadCount_other', { count: unreadCount }) 
                    : t('notifications.unreadCount_zero')}
                </p>
             </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-[350px] overflow-y-auto custom-scrollbar bg-card/50">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center">
                    <Bell className="h-6 w-6 text-muted-foreground/40" />
                </div>
                <p className="text-sm text-muted-foreground font-medium">{t('notifications.noNotifications')}</p>
            </div>
          ) : (
             <div className="divide-y divide-border/50">
                {notifications.map((notification: Notification) => {
                const parsedData = notification.data ? JSON.parse(notification.data) : {};
                
                // Translate System Administrator if present (Common logic for new key 'systemAdmin' and legacy 'System Administrator')
                const adminNameVal = parsedData.adminName ? String(parsedData.adminName).trim() : '';
                if (['systemAdmin', 'System Administrator', 'System Admin'].includes(adminNameVal)) {
                    parsedData.adminName = t('common.fields.systemAdmin');
                }

                const title = notification.titleKey ? t(notification.titleKey, parsedData) : notification.title;
                const message = notification.messageKey ? t(notification.messageKey, parsedData) : notification.message;
                const isUnread = !notification.isRead;

                return (
                    <DropdownMenuItem 
                    key={notification.id} 
                    className={cn(
                        "flex items-start gap-3 p-4 cursor-pointer focus:bg-accent/50 transition-colors",
                        isUnread ? "bg-[hsl(var(--primary)/0.03)]" : "bg-transparent"
                    )}
                    onClick={(e) => {
                        e.preventDefault();
                        if (isUnread) markAsRead(notification.id);
                    }}
                    >
                    {/* Icon Container */}
                    <div className={cn(
                        "h-9 w-9 rounded-md flex items-center justify-center shrink-0 transition-colors",
                        isUnread 
                            ? "bg-[hsl(var(--primary)/0.1)] text-primary" 
                            : "bg-muted text-muted-foreground"
                    )}>
                        <Info className="h-4.5 w-4.5" />
                    </div>

                    <div className="flex flex-col gap-1 min-w-0 flex-1">
                        <div className="flex w-full justify-between items-start gap-2">
                            <span className={cn(
                                "text-sm font-semibold leading-tight",
                                isUnread ? "text-foreground" : "text-muted-foreground"
                            )}>
                                {title as string}
                            </span>
                            <span className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider shrink-0 mt-0.5">
                                {new Date(notification.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                        </div>
                        <p className={cn(
                            "text-xs line-clamp-2 leading-relaxed",
                             isUnread ? "text-foreground/80 font-medium" : "text-muted-foreground"
                        )}>
                            {message as string}
                        </p>
                    </div>
                    {isUnread && (
                        <div className="h-2 w-2 rounded-full bg-primary shrink-0 self-center" />
                    )}
                    </DropdownMenuItem>
                );
                })}
            </div>
          )}
        </div>
        
        {/* Footer Actions */}
        {unreadCount > 0 && (
             <>
                <DropdownMenuSeparator className="my-0 bg-border" />
                <div className="p-2 bg-[hsl(var(--muted)/0.3)]">
                    <DropdownMenuItem 
                        onClick={(e) => {
                            e.preventDefault();
                            markAllAsRead();
                        }}
                        className="flex items-center justify-center gap-2 p-2.5 text-primary hover:text-primary hover:bg-primary/10 cursor-pointer rounded-md transition-colors font-medium text-sm w-full"
                    >
                        <CheckCheck className="h-4 w-4" />
                        <span>{t('notifications.markAllRead')}</span>
                    </DropdownMenuItem>
                </div>
             </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
