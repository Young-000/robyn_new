import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SendRoutineNotificationUseCase } from './SendRoutineNotificationUseCase';
import { Routine } from '@/domain/entities/Routine';
import { Schedule } from '@/domain/value-objects/Schedule';
import { InformationSource } from '@/domain/entities/InformationSource';
import type { INotificationService } from '@/domain/interfaces/INotificationService';
import type { DayOfWeek } from '@/shared/types';

describe('SendRoutineNotificationUseCase', () => {
  let useCase: SendRoutineNotificationUseCase;
  let mockNotificationService: INotificationService;
  let mockInformationService: any;

  beforeEach(() => {
    mockNotificationService = {
      isSupported: vi.fn().mockReturnValue(true),
      requestPermission: vi.fn().mockResolvedValue('granted'),
      sendNotification: vi.fn().mockResolvedValue(undefined),
    };

    mockInformationService = {
      getWeatherInfo: vi.fn().mockResolvedValue({
        temperature: 15,
        condition: '맑음',
        humidity: 60,
      }),
      getAirQualityInfo: vi.fn().mockResolvedValue({
        pm10: 30,
        pm25: 15,
        aqi: 50,
        level: 'good' as const,
      }),
      getBusArrivalInfo: vi.fn().mockResolvedValue({
        type: 'bus' as const,
        stationName: '강남역',
        routeName: '146번',
        arrivalTime: 5,
      }),
      getSubwayArrivalInfo: vi.fn().mockResolvedValue({
        type: 'subway' as const,
        stationName: '강남역',
        routeName: '2호선',
        arrivalTime: 3,
      }),
    };

    useCase = new SendRoutineNotificationUseCase(
      mockNotificationService,
      mockInformationService
    );
  });

  it('should send notification with weather information', async () => {
    const schedule = Schedule.create('08:00', [1, 2, 3, 4, 5] as DayOfWeek[]);
    const routine = Routine.create({
      userId: 'user-1',
      name: '출근 루틴',
      schedule,
      notificationTime: '07:50',
    });

    routine.addInformationSource(
      InformationSource.create({
        type: 'weather',
        config: { location: { latitude: 37.5665, longitude: 126.9780 } },
      })
    );

    await useCase.execute(routine);

    expect(mockInformationService.getWeatherInfo).toHaveBeenCalled();
    expect(mockNotificationService.sendNotification).toHaveBeenCalled();
    
    const callArgs = (mockNotificationService.sendNotification as any).mock.calls[0][0];
    expect(callArgs.title).toContain('출근 루틴');
    expect(callArgs.body).toContain('15°C');
  });

  it('should send notification with multiple information sources', async () => {
    const schedule = Schedule.create('08:00', [1, 2, 3, 4, 5] as DayOfWeek[]);
    const routine = Routine.create({
      userId: 'user-1',
      name: '출근 루틴',
      schedule,
      notificationTime: '07:50',
    });

    routine.addInformationSource(
      InformationSource.create({
        type: 'weather',
        config: { location: { latitude: 37.5665, longitude: 126.9780 } },
        order: 0,
      })
    );

    routine.addInformationSource(
      InformationSource.create({
        type: 'bus',
        config: { stationId: '123', routeId: '146' },
        order: 1,
      })
    );

    await useCase.execute(routine);

    expect(mockInformationService.getWeatherInfo).toHaveBeenCalled();
    expect(mockInformationService.getBusArrivalInfo).toHaveBeenCalled();
    expect(mockNotificationService.sendNotification).toHaveBeenCalled();
  });

  it('should handle errors gracefully', async () => {
    mockInformationService.getWeatherInfo.mockRejectedValue(
      new Error('API Error')
    );

    const schedule = Schedule.create('08:00', [1, 2, 3, 4, 5] as DayOfWeek[]);
    const routine = Routine.create({
      userId: 'user-1',
      name: '출근 루틴',
      schedule,
      notificationTime: '07:50',
    });

    routine.addInformationSource(
      InformationSource.create({
        type: 'weather',
        config: { location: { latitude: 37.5665, longitude: 126.9780 } },
      })
    );

    // 에러가 발생해도 알림은 전송됨 (fallback 메시지 포함)
    await useCase.execute(routine);
    
    // 알림이 전송되었는지 확인 (에러가 있어도 기본 메시지로 전송)
    expect(mockNotificationService.sendNotification).toHaveBeenCalled();
  });
});
