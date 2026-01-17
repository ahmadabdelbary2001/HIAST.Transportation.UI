import { createContext } from 'react';
import type { Notification } from '@/types';

export interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    markAsRead: (id: number) => Promise<void>;
    markAllAsRead: () => void;
    isLoading: boolean;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);
