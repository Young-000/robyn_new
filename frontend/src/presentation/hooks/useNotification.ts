import { useState, useEffect, useCallback } from 'react';
import { BrowserNotificationService } from '@/infrastructure/notification/BrowserNotificationService';

export function useNotification() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);
  const notificationService = new BrowserNotificationService();

  useEffect(() => {
    setIsSupported(notificationService.isSupported());
    if (notificationService.isSupported()) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      return false;
    }

    try {
      const result = await notificationService.requestPermission();
      setPermission(result);
      return result === 'granted';
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return false;
    }
  }, [isSupported]);

  const sendNotification = useCallback(
    async (title: string, body: string, options?: { icon?: string; tag?: string }) => {
      if (!isSupported || permission !== 'granted') {
        throw new Error('Notification permission not granted');
      }

      await notificationService.sendNotification({
        title,
        body,
        ...options,
      });
    },
    [isSupported, permission]
  );

  return {
    isSupported,
    permission,
    requestPermission,
    sendNotification,
  };
}
