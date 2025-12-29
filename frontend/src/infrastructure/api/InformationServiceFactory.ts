import type { IInformationService } from '@/application/use-cases/SendRoutineNotificationUseCase';
import { WeatherApiService } from './WeatherApiService';
import { TransitApiService } from './TransitApiService';
import { MockInformationService } from './MockInformationService';

export class InformationServiceFactory {
  static create(): IInformationService {
    const weatherApiKey = import.meta.env.VITE_WEATHER_API_KEY;
    const transitApiKey = import.meta.env.VITE_TRANSIT_API_KEY;

    // 날씨 API는 실제 서비스 사용, 교통 API는 Mock 사용 (일단)
    const weatherService = weatherApiKey 
      ? new WeatherApiService(weatherApiKey) 
      : new MockInformationService();
    
    // 교통 API는 일단 Mock 사용 (API 링크 문제로 인해)
    const transitService = new MockInformationService();

    return new CompositeInformationService(weatherService, transitService);
  }
}

class CompositeInformationService implements IInformationService {
  constructor(
    private weatherService: IInformationService,
    private transitService: IInformationService
  ) {}

  async getWeatherInfo(config: any): Promise<any> {
    return this.weatherService.getWeatherInfo(config);
  }

  async getAirQualityInfo(config: any): Promise<any> {
    return this.weatherService.getAirQualityInfo(config);
  }

  async getBusArrivalInfo(config: any): Promise<any> {
    return this.transitService.getBusArrivalInfo(config);
  }

  async getSubwayArrivalInfo(config: any): Promise<any> {
    return this.transitService.getSubwayArrivalInfo(config);
  }
}
