import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import type { Notification } from '@/types';
import { signalRService } from '@/services/signalRService';
import { notificationApiService } from '@/services/notificationApiService';
import { toast } from 'sonner';
import { NotificationContext } from './NotificationContextDefinition';

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const fetchNotifications = useCallback(async () => {
        if (!user) return;
        try {
            setIsLoading(true);
            const data = await notificationApiService.getMyNotifications();
            setNotifications(data);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    // Handle incoming real-time notification
    const handleNewNotification = useCallback((notification: Notification) => {
        setNotifications(prev => [notification, ...prev]);
        
        const parsedData = notification.data ? JSON.parse(notification.data) : {};
        const title = notification.titleKey ? t(notification.titleKey, parsedData) : notification.title;
        const message = notification.messageKey ? t(notification.messageKey, parsedData) : notification.message;

        toast(title as string, {
            description: message as string,
            duration: 5000,
        });
    }, [t]);

    useEffect(() => {
        if (user) {
            fetchNotifications();
            signalRService.start();
            signalRService.onNotificationReceived(handleNewNotification);
        } else {
            setNotifications([]);
            signalRService.stop();
        }

        return () => {
            signalRService.offNotificationReceived(handleNewNotification);
        };
    }, [user, fetchNotifications, handleNewNotification]);

    const markAsRead = async (id: number) => {
        try {
            await notificationApiService.markAsRead(id);
            setNotifications(prev => prev.map(n => 
                n.id === id ? { ...n, isRead: true } : n
            ));
        } catch (error) {
            console.error("Failed to mark notification as read", error);
        }
    };

    const markAllAsRead = () => {
        // Implement later if needed
    };

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead, isLoading }}>
            {children}
        </NotificationContext.Provider>
    );
};
