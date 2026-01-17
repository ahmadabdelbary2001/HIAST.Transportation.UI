import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNotification } from '@/hooks/useNotification';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import type { Notification } from '@/types';

export function NotificationBell() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { notifications, unreadCount, markAsRead } = useNotification();

  // Don't render if user is not authenticated
  if (!user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{t('notifications.title')}</p>
                <p className="text-xs leading-none text-muted-foreground">
                    {t('notifications.unreadCount', { count: unreadCount })}
                </p>
            </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="h-[300px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              {t('notifications.noNotifications')}
            </div>
          ) : (
            notifications.map((notification: Notification) => {
              const parsedData = notification.data ? JSON.parse(notification.data) : {};
              const title = notification.titleKey ? t(notification.titleKey, parsedData) : notification.title;
              const message = notification.messageKey ? t(notification.messageKey, parsedData) : notification.message;

              return (
                <DropdownMenuItem 
                  key={notification.id} 
                  className={cn(
                      "flex flex-col items-start gap-1 p-3 cursor-pointer",
                      !notification.isRead && "bg-muted/50"
                  )}
                  onClick={() => !notification.isRead && markAsRead(notification.id)}
                >
                  <div className="flex w-full justify-between items-start gap-2">
                      <span className="font-medium text-sm">{title as string}</span>
                      {!notification.isRead && <span className="h-2 w-2 rounded-full bg-blue-500 mt-1" />}
                  </div>
                  <span className="text-xs text-muted-foreground line-clamp-2">
                    {message as string}
                  </span>
                  <span className="text-[10px] text-muted-foreground self-end mt-1">
                      {new Date(notification.createdAt).toLocaleDateString()} {new Date(notification.createdAt).toLocaleTimeString()}
                  </span>
                </DropdownMenuItem>
              );
            })
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
