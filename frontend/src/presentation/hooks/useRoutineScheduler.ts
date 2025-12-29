import { useState, useEffect, useCallback, useRef } from 'react';
import { Routine } from '@/domain/entities/Routine';
import { SendRoutineNotificationUseCase } from '@/application/use-cases/SendRoutineNotificationUseCase';
import { BrowserNotificationService } from '@/infrastructure/notification/BrowserNotificationService';
import { LocalStorageRoutineRepository } from '@/infrastructure/storage/LocalStorageRoutineRepository';
import { useNotification } from './useNotification';
import { InformationServiceFactory } from '@/infrastructure/api/InformationServiceFactory';

export function useRoutineScheduler() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const repositoryRef = useRef(new LocalStorageRoutineRepository());
  const { isSupported, permission, requestPermission } = useNotification();

  // Notification Service와 Use Case 초기화
  const notificationService = new BrowserNotificationService();
  const informationService = InformationServiceFactory.create();
  const sendNotificationUseCase = new SendRoutineNotificationUseCase(
    notificationService,
    informationService
  );

  // 초기 로드
  useEffect(() => {
    const loadRoutines = async () => {
      try {
        const loaded = await repositoryRef.current.findAll();
        setRoutines(loaded);
      } catch (error) {
        console.error('Failed to load routines:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadRoutines();
  }, []);

  // 루틴 추가
  const addRoutine = useCallback(async (routine: Routine) => {
    await repositoryRef.current.save(routine);
    setRoutines((prev) => {
      const exists = prev.find((r) => r.id === routine.id);
      if (exists) {
        return prev.map((r) => (r.id === routine.id ? routine : r));
      }
      return [...prev, routine];
    });
  }, []);

  // 루틴 제거
  const removeRoutine = useCallback(async (routineId: string) => {
    await repositoryRef.current.delete(routineId);
    setRoutines((prev) => prev.filter((r) => r.id !== routineId));
  }, []);

  // 루틴 업데이트
  const updateRoutine = useCallback(async (routine: Routine) => {
    await repositoryRef.current.save(routine);
    setRoutines((prev) =>
      prev.map((r) => (r.id === routine.id ? routine : r))
    );
  }, []);

  // 스케줄 체크 및 알림 전송
  useEffect(() => {
    if (!isSupported || permission !== 'granted') {
      return;
    }

    if (routines.length === 0) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routines.length, isSupported, permission]);

  return {
    routines,
    isLoading,
    addRoutine,
    removeRoutine,
    updateRoutine,
    isSupported,
    permission,
    requestPermission,
  };
}
