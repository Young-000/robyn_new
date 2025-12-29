import type { IInformationService } from '@/application/use-cases/SendRoutineNotificationUseCase';
import { WeatherApiService } from './WeatherApiService';
import { TransitApiService } from './TransitApiService';
import { MockInformationService } from './MockInformationService';

export class InformationServiceFactory {
  static create(): IInformationService {
    const weatherApiKey = import.meta.env.VITE_WEATHER_API_KEY;
    const transitApiKey = import.meta.env.VITE_TRANSIT_API_KEY;

    // API 키가 있으면 실제 서비스 사용, 없으면 Mock 사용
    if (weatherApiKey || transitApiKey) {
      return new CompositeInformationService(
        weatherApiKey ? new WeatherApiService(weatherApiKey) : new MockInformationService(),
        transitApiKey ? new TransitApiService(transitApiKey) : new MockInformationService()
      );
    }

    return new MockInformationService();
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
