import { useState, useEffect, useCallback, useRef } from 'react';
import { Routine } from '@/domain/entities/Routine';
import { SendRoutineNotificationUseCase } from '@/application/use-cases/SendRoutineNotificationUseCase';
import { BrowserNotificationService } from '@/infrastructure/notification/BrowserNotificationService';
import { useNotification } from './useNotification';
import { MockInformationService } from '@/infrastructure/api/MockInformationService';

export function useRoutineScheduler() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { isSupported, permission, requestPermission } = useNotification();

  // Notification Service와 Use Case 초기화
  const notificationService = new BrowserNotificationService();
  const informationService = new MockInformationService();
  const sendNotificationUseCase = new SendRoutineNotificationUseCase(
    notificationService,
    informationService
  );

  // 루틴 추가
  const addRoutine = useCallback((routine: Routine) => {
    setRoutines((prev) => [...prev, routine]);
  }, []);

  // 루틴 제거
  const removeRoutine = useCallback((routineId: string) => {
    setRoutines((prev) => prev.filter((r) => r.id !== routineId));
  }, []);

  // 루틴 업데이트
  const updateRoutine = useCallback((routine: Routine) => {
    setRoutines((prev) =>
      prev.map((r) => (r.id === routine.id ? routine : r))
    );
  }, []);

  // 스케줄 체크 및 알림 전송
  useEffect(() => {
    if (!isSupported || permission !== 'granted') {
      return;
    }

    const checkSchedules = () => {
      const now = new Date();
      
      routines.forEach((routine) => {
        if (!routine.enabled) {
          return;
        }

        // 알림 시간 체크 (notificationTime)
        const [hours, minutes] = routine.notificationTime.split(':').map(Number);
        const notificationDate = new Date(now);
        notificationDate.setHours(hours, minutes, 0, 0);

        // 정확한 시간에 알림 (1분 오차 허용)
        const diffMinutes = Math.abs(
          (now.getTime() - notificationDate.getTime()) / (1000 * 60)
        );

        if (diffMinutes < 1) {
          // 오늘 요일이 루틴의 요일 목록에 포함되어 있는지 확인
          const today = now.getDay();
          const routineDays = routine.schedule.daysOfWeek;
          
          if (routineDays.includes(today as any)) {
            sendNotificationUseCase.execute(routine).catch((error) => {
              console.error('Failed to send notification:', error);
            });
          }
        }
      });
    };

    // 1분마다 체크
    intervalRef.current = setInterval(checkSchedules, 60000);
    
    // 초기 체크
    checkSchedules();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [routines, isSupported, permission, sendNotificationUseCase]);

  return {
    routines,
    addRoutine,
    removeRoutine,
    updateRoutine,
    isSupported,
    permission,
    requestPermission,
  };
}
