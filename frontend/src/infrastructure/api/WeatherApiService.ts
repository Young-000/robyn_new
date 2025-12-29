import type { IInformationService } from '@/application/use-cases/SendRoutineNotificationUseCase';
import type { Location } from '@/shared/types';

interface WeatherApiResponse {
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
  }>;
}

interface AirQualityApiResponse {
  list: Array<{
    main: {
      aqi: number;
    };
    components: {
      pm10: number;
      pm2_5: number;
    };
  }>;
}

export class WeatherApiService implements IInformationService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.openweathermap.org/data/2.5';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || import.meta.env.VITE_WEATHER_API_KEY || '';
    if (!this.apiKey) {
      console.warn('Weather API key not provided. Using mock data.');
    }
  }

  async getWeatherInfo(config: { location: Location }): Promise<any> {
    if (!this.apiKey) {
      // API 키가 없으면 Mock 데이터 반환
      return this.getMockWeatherData();
    }

    try {
      const { latitude, longitude } = config.location;
      const url = `${this.baseUrl}/weather?lat=${latitude}&lon=${longitude}&appid=${this.apiKey}&units=metric&lang=kr`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data: WeatherApiResponse = await response.json();
      
      return {
        temperature: Math.round(data.main.temp),
        condition: this.translateCondition(data.weather[0].main),
        humidity: data.main.humidity,
      };
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
      return this.getMockWeatherData();
    }
  }

  async getAirQualityInfo(config: { location: Location }): Promise<any> {
    if (!this.apiKey) {
      return this.getMockAirQualityData();
    }

    try {
      const { latitude, longitude } = config.location;
      const url = `${this.baseUrl}/air_pollution?lat=${latitude}&lon=${longitude}&appid=${this.apiKey}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Air Quality API error: ${response.status}`);
      }

      const data: AirQualityApiResponse = await response.json();
      const airData = data.list[0];
      
      const aqi = airData.main.aqi;
      const pm10 = Math.round(airData.components.pm10);
      const pm25 = Math.round(airData.components.pm2_5);

      return {
        pm10,
        pm25,
        aqi,
        level: this.getAirQualityLevel(aqi),
      };
    } catch (error) {
      console.error('Failed to fetch air quality data:', error);
      return this.getMockAirQualityData();
    }
  }

  async getBusArrivalInfo(_config: any): Promise<any> {
    // 버스 API는 별도 서비스에서 구현
    throw new Error('Bus API not implemented in WeatherApiService');
  }

  async getSubwayArrivalInfo(_config: any): Promise<any> {
    // 지하철 API는 별도 서비스에서 구현
    throw new Error('Subway API not implemented in WeatherApiService');
  }

  private translateCondition(condition: string): string {
    const translations: Record<string, string> = {
      Clear: '맑음',
      Clouds: '흐림',
      Rain: '비',
      Drizzle: '이슬비',
      Thunderstorm: '천둥번개',
      Snow: '눈',
      Mist: '안개',
      Fog: '안개',
      Haze: '연무',
    };
    return translations[condition] || condition;
  }

  private getAirQualityLevel(aqi: number): 'good' | 'moderate' | 'unhealthy' | 'veryUnhealthy' | 'hazardous' {
    if (aqi <= 1) return 'good';
    if (aqi <= 2) return 'moderate';
    if (aqi <= 3) return 'unhealthy';
    if (aqi <= 4) return 'veryUnhealthy';
    return 'hazardous';
  }

  private getMockWeatherData() {
    return {
      temperature: Math.floor(Math.random() * 20) + 10,
      condition: ['맑음', '흐림', '비'][Math.floor(Math.random() * 3)],
      humidity: Math.floor(Math.random() * 40) + 40,
    };
  }

  private getMockAirQualityData() {
    return {
      pm10: Math.floor(Math.random() * 100) + 20,
      pm25: Math.floor(Math.random() * 50) + 10,
      aqi: Math.floor(Math.random() * 150) + 30,
      level: 'moderate' as const,
    };
  }
}
