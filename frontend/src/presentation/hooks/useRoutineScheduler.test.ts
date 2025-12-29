import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useRoutineScheduler } from './useRoutineScheduler';
import { Routine } from '@/domain/entities/Routine';
import { Schedule } from '@/domain/value-objects/Schedule';
import type { DayOfWeek } from '@/shared/types';

// Mock dependencies
vi.mock('./useNotification', () => ({
  useNotification: () => ({
    isSupported: true,
    permission: 'granted',
    requestPermission: vi.fn(),
    sendNotification: vi.fn(),
  }),
}));

vi.mock('@/application/use-cases/SendRoutineNotificationUseCase', () => ({
  SendRoutineNotificationUseCase: vi.fn().mockImplementation(() => ({
    execute: vi.fn(),
  })),
}));

describe('useRoutineScheduler', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('should schedule routine notifications', async () => {
    const schedule = Schedule.create('08:00', [1, 2, 3, 4, 5] as DayOfWeek[]);
    const routine = Routine.create({
      userId: 'user-1',
      name: '출근 루틴',
      schedule,
      notificationTime: '07:50',
    });

    const { result } = renderHook(() => useRoutineScheduler());

    result.current.addRoutine(routine);

    expect(result.current.routines).toHaveLength(1);
  });

  it('should remove routine', () => {
    const schedule = Schedule.create('08:00', [1, 2, 3, 4, 5] as DayOfWeek[]);
    const routine = Routine.create({
      userId: 'user-1',
      name: '출근 루틴',
      schedule,
      notificationTime: '07:50',
    });

    const { result } = renderHook(() => useRoutineScheduler());

    result.current.addRoutine(routine);
    result.current.removeRoutine(routine.id);

    expect(result.current.routines).toHaveLength(0);
  });
});
