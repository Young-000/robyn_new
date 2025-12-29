import { describe, it, expect } from 'vitest';
import { Schedule } from './Schedule';
import type { DayOfWeek } from '@/shared/types';

describe('Schedule Value Object', () => {
  it('should create a valid schedule', () => {
    const schedule = Schedule.create('08:00', [1, 2, 3, 4, 5] as DayOfWeek[]);
    
    expect(schedule.time).toBe('08:00');
    expect(schedule.daysOfWeek).toEqual([1, 2, 3, 4, 5]);
  });

  it('should validate time format', () => {
    expect(() => Schedule.create('25:00', [1] as DayOfWeek[])).toThrow();
    expect(() => Schedule.create('08:60', [1] as DayOfWeek[])).toThrow();
    expect(() => Schedule.create('8:00', [1] as DayOfWeek[])).toThrow();
  });

  it('should validate days of week', () => {
    expect(() => Schedule.create('08:00', [] as DayOfWeek[])).toThrow();
    expect(() => Schedule.create('08:00', [7] as any)).toThrow();
    expect(() => Schedule.create('08:00', [-1] as any)).toThrow();
  });

  it('should check if schedule matches current day and time', () => {
    const schedule = Schedule.create('08:00', [1, 2, 3, 4, 5] as DayOfWeek[]);
    
    // 월요일 08:00
    const monday8am = new Date('2024-01-01T08:00:00'); // 월요일
    expect(schedule.matches(monday8am)).toBe(true);

    // 일요일 08:00
    const sunday8am = new Date('2023-12-31T08:00:00'); // 일요일
    expect(schedule.matches(sunday8am)).toBe(false);

    // 월요일 09:00
    const monday9am = new Date('2024-01-01T09:00:00');
    expect(schedule.matches(monday9am)).toBe(false);
  });
});
