import type { IInformationService } from '@/application/use-cases/SendRoutineNotificationUseCase';
import { WeatherApiService } from './WeatherApiService';
import { KoreaWeatherApiService } from './KoreaWeatherApiService';
import { TransitApiService } from './TransitApiService';
import { MockInformationService } from './MockInformationService';

export class InformationServiceFactory {
  static create(): IInformationService {
    const weatherApiKey = import.meta.env.VITE_WEATHER_API_KEY;
    const kmaApiKey = import.meta.env.VITE_KMA_API_KEY;
    const transitApiKey = import.meta.env.VITE_TRANSIT_API_KEY;

    // 기상청 API 우선 사용, 없으면 OpenWeatherMap 사용
    let weatherService: IInformationService;
    if (kmaApiKey) {
      console.log('Using Korea Meteorological Administration (KMA) API');
      weatherService = new KoreaWeatherApiService(kmaApiKey);
    } else if (weatherApiKey) {
      console.log('Using OpenWeatherMap API');
      weatherService = new WeatherApiService(weatherApiKey);
    } else {
      console.log('Using mock weather data');
      weatherService = new MockInformationService();
    }
    
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
