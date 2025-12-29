import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WeatherApiService } from './WeatherApiService';

// Mock fetch
(globalThis as any).fetch = vi.fn();

describe('WeatherApiService', () => {
  let service: WeatherApiService;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch weather data with valid API key', async () => {
    const mockResponse = {
      main: {
        temp: 15.5,
        humidity: 60,
      },
      weather: [
        {
          main: 'Clear',
          description: 'clear sky',
        },
      ],
    };

    ((globalThis as any).fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    service = new WeatherApiService('test-api-key');
    const result = await service.getWeatherInfo({
      location: { latitude: 37.5665, longitude: 126.9780 },
    });

    expect(result.temperature).toBe(16); // 반올림됨
    expect(result.condition).toBe('맑음');
    expect(result.humidity).toBe(60);
  });

  it('should use mock data when API key is not provided', async () => {
    service = new WeatherApiService('');
    const result = await service.getWeatherInfo({
      location: { latitude: 37.5665, longitude: 126.9780 },
    });

    expect(result.temperature).toBeGreaterThanOrEqual(10);
    expect(result.temperature).toBeLessThanOrEqual(30);
    expect(result.condition).toBeDefined();
  });

  it('should handle API errors gracefully', async () => {
    ((globalThis as any).fetch as any).mockRejectedValueOnce(new Error('Network error'));

    service = new WeatherApiService('test-api-key');
    const result = await service.getWeatherInfo({
      location: { latitude: 37.5665, longitude: 126.9780 },
    });

    // 에러 발생 시 Mock 데이터 반환
    expect(result).toBeDefined();
    expect(result.temperature).toBeDefined();
  });

  it('should fetch air quality data', async () => {
    const mockResponse = {
      list: [
        {
          main: { aqi: 2 },
          components: {
            pm10: 30,
            pm2_5: 15,
          },
        },
      ],
    };

    ((globalThis as any).fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    service = new WeatherApiService('test-api-key');
    const result = await service.getAirQualityInfo({
      location: { latitude: 37.5665, longitude: 126.9780 },
    });

    expect(result.pm10).toBe(30);
    expect(result.pm25).toBe(15);
    expect(result.aqi).toBe(2);
    expect(result.level).toBe('moderate');
  });
});
