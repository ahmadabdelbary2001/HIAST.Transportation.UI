import * as signalR from "@microsoft/signalr";
import { LOCAL_STORAGE_KEYS } from "@/lib/constants";
import type { Notification } from "@/types";

class SignalRService {
    private connection: signalR.HubConnection | null = null;
    private callbacks: ((notification: Notification) => void)[] = [];

    constructor() {
        this.createConnection();
    }

    private createConnection() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl("/notificationHub", {
                accessTokenFactory: () => {
                    return localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN) || 
                           sessionStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN) || '';
                }
            })
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();

        this.connection.on("ReceiveNotification", (notification: Notification) => {
            this.callbacks.forEach(cb => cb(notification));
        });
    }

    public async start() {
        if (this.connection && this.connection.state === signalR.HubConnectionState.Disconnected) {
            try {
                await this.connection.start();
                console.log("SignalR Connected.");
            } catch (err) {
                console.error("SignalR Connection Error: ", err);
                setTimeout(() => this.start(), 5000);
            }
        }
    }

    public stop() {
        if (this.connection) {
            this.connection.stop();
        }
    }

    public onNotificationReceived(callback: (notification: Notification) => void) {
        this.callbacks.push(callback);
    }

    public offNotificationReceived(callback: (notification: Notification) => void) {
        this.callbacks = this.callbacks.filter(cb => cb !== callback);
    }
}

export const signalRService = new SignalRService();
