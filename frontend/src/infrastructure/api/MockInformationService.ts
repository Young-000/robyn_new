import type { IInformationService } from '@/application/use-cases/SendRoutineNotificationUseCase';

export class MockInformationService implements IInformationService {
  async getWeatherInfo(config: any): Promise<any> {
    // Mock 데이터 반환
    return {
      temperature: 15,
      condition: '맑음',
      humidity: 60,
    };
  }

  async getAirQualityInfo(config: any): Promise<any> {
    return {
      pm10: 30,
      pm25: 15,
      aqi: 50,
      level: 'good' as const,
    };
  }

  async getBusArrivalInfo(config: any): Promise<any> {
    return {
      type: 'bus' as const,
      stationName: '강남역',
      routeName: '146번',
      arrivalTime: 5,
    };
  }

  async getSubwayArrivalInfo(config: any): Promise<any> {
    return {
      type: 'subway' as const,
      stationName: '강남역',
      routeName: '2호선',
      arrivalTime: 3,
    };
  }
}
