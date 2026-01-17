import { apiHelper } from "./apiHelper";
import type { Notification } from "../types";

export const notificationApiService = {
    getMyNotifications: async (): Promise<Notification[]> => {
        return apiHelper.get<Notification[]>('/api/Notification');
    },
    markAsRead: async (id: number): Promise<void> => {
        return apiHelper.put(`/api/Notification/${id}/read`, {});
    }
};
