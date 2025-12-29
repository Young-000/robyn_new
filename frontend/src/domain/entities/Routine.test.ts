import { describe, it, expect } from 'vitest';
import { Routine } from './Routine';
import { Schedule } from '../value-objects/Schedule';
import { InformationSource } from './InformationSource';
import type { DayOfWeek } from '@/shared/types';

describe('Routine Entity', () => {
  it('should create a routine with valid data', () => {
    const schedule = Schedule.create('08:00', [1, 2, 3, 4, 5] as DayOfWeek[]);
    const routine = Routine.create({
      userId: 'user-1',
      name: '출근 루틴',
      schedule,
      notificationTime: '07:50',
    });

    expect(routine.id).toBeDefined();
    expect(routine.name).toBe('출근 루틴');
    expect(routine.enabled).toBe(true);
    expect(routine.schedule).toEqual(schedule);
  });

  it('should enable and disable routine', () => {
    const schedule = Schedule.create('08:00', [1, 2, 3, 4, 5] as DayOfWeek[]);
    const routine = Routine.create({
      userId: 'user-1',
      name: '출근 루틴',
      schedule,
      notificationTime: '07:50',
    });

    routine.disable();
    expect(routine.enabled).toBe(false);

    routine.enable();
    expect(routine.enabled).toBe(true);
  });

  it('should add information source', () => {
    const schedule = Schedule.create('08:00', [1, 2, 3, 4, 5] as DayOfWeek[]);
    const routine = Routine.create({
      userId: 'user-1',
      name: '출근 루틴',
      schedule,
      notificationTime: '07:50',
    });

    const weatherSource = InformationSource.create({
      type: 'weather',
      config: { location: { latitude: 37.5665, longitude: 126.9780 } },
    });

    routine.addInformationSource(weatherSource);
    expect(routine.informationSources).toHaveLength(1);
    expect(routine.informationSources[0].type).toBe('weather');
  });

  it('should update routine name', () => {
    const schedule = Schedule.create('08:00', [1, 2, 3, 4, 5] as DayOfWeek[]);
    const routine = Routine.create({
      userId: 'user-1',
      name: '출근 루틴',
      schedule,
      notificationTime: '07:50',
    });

    routine.updateName('새 출근 루틴');
    expect(routine.name).toBe('새 출근 루틴');
  });
});
