import type { IInformationService } from '@/application/use-cases/SendRoutineNotificationUseCase';

export class MockInformationService implements IInformationService {
  async getWeatherInfo(_config: any): Promise<any> {
    // Mock 데이터 반환 - 실제 API 연동 시 교체
    await new Promise((resolve) => setTimeout(resolve, 100)); // API 호출 시뮬레이션
    
    return {
      temperature: Math.floor(Math.random() * 20) + 10, // 10-30도
      condition: ['맑음', '흐림', '비', '눈'][Math.floor(Math.random() * 4)],
      humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
    };
  }

  async getAirQualityInfo(_config: any): Promise<any> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    
    const levels: Array<'good' | 'moderate' | 'unhealthy'> = ['good', 'moderate', 'unhealthy'];
    const level = levels[Math.floor(Math.random() * levels.length)];
    
    return {
      pm10: Math.floor(Math.random() * 100) + 20,
      pm25: Math.floor(Math.random() * 50) + 10,
      aqi: Math.floor(Math.random() * 150) + 30,
      level,
    };
  }

  async getBusArrivalInfo(config: any): Promise<any> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    
    return {
      type: 'bus' as const,
      stationName: config.stationName || '강남역',
      routeName: config.routeName || '146번',
      arrivalTime: Math.floor(Math.random() * 10) + 1, // 1-10분
    };
  }

  async getSubwayArrivalInfo(config: any): Promise<any> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    
    return {
      type: 'subway' as const,
      stationName: config.stationName || '강남역',
      routeName: config.routeName || '2호선',
      arrivalTime: Math.floor(Math.random() * 5) + 1, // 1-5분
    };
  }
}
