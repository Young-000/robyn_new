import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BrowserNotificationService } from './BrowserNotificationService';

describe('BrowserNotificationService', () => {
  let service: BrowserNotificationService;
  let mockNotification: any;

  beforeEach(() => {
    service = new BrowserNotificationService();
    
    mockNotification = {
      close: vi.fn(),
    };

    // Notification API 모킹
    (globalThis as any).Notification = vi.fn().mockImplementation((title: string, options: any) => {
      return mockNotification;
    }) as any;

    (globalThis as any).Notification.permission = 'granted';
    (globalThis as any).Notification.requestPermission = vi.fn().mockResolvedValue('granted');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should check if notifications are supported', () => {
    expect(service.isSupported()).toBe(true);
  });

  it('should request notification permission', async () => {
    // permission이 'default'인 경우에만 requestPermission 호출
    (globalThis as any).Notification.permission = 'default';
    const permission = await service.requestPermission();
    expect(permission).toBe('granted');
    expect((globalThis as any).Notification.requestPermission).toHaveBeenCalled();
  });

  it('should send notification when permission is granted', async () => {
    await service.sendNotification({
      title: '테스트 알림',
      body: '이것은 테스트입니다',
    });

    expect(globalThis.Notification).toHaveBeenCalledWith('테스트 알림', {
      body: '이것은 테스트입니다',
      icon: undefined,
      badge: undefined,
      tag: undefined,
      requireInteraction: false,
    });
  });

  it('should not send notification when permission is denied', async () => {
    (globalThis as any).Notification.permission = 'denied';
    
    await expect(
      service.sendNotification({
        title: '테스트 알림',
        body: '이것은 테스트입니다',
      })
    ).rejects.toThrow('Notification permission denied');
  });

  it('should send notification with custom options', async () => {
    await service.sendNotification({
      title: '테스트 알림',
      body: '이것은 테스트입니다',
      icon: '/icon.png',
      badge: '/badge.png',
      tag: 'routine-1',
      requireInteraction: true,
    });

    expect(globalThis.Notification).toHaveBeenCalledWith('테스트 알림', {
      body: '이것은 테스트입니다',
      icon: '/icon.png',
      badge: '/badge.png',
      tag: 'routine-1',
      requireInteraction: true,
    });
  });
});
