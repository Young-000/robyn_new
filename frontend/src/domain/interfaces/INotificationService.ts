import type { NotificationOptions } from '@/infrastructure/notification/BrowserNotificationService';

export interface INotificationService {
  isSupported(): boolean;
  requestPermission(): Promise<NotificationPermission>;
  sendNotification(options: NotificationOptions): Promise<void>;
}
