// 공유 타입 정의

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0=일요일, 6=토요일

export type InformationSourceType = 'weather' | 'airQuality' | 'bus' | 'subway';

export type NotificationMethod = 'push' | 'sound' | 'vibration';

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface WeatherInfo {
  temperature: number;
  condition: string;
  humidity: number;
  airQuality?: AirQualityInfo;
  forecast?: ForecastInfo[];
}

export interface AirQualityInfo {
  pm10: number;
  pm25: number;
  aqi: number;
  level: 'good' | 'moderate' | 'unhealthy' | 'veryUnhealthy' | 'hazardous';
}

export interface ForecastInfo {
  date: string;
  temperature: number;
  condition: string;
  precipitation: number;
}

export interface TransitInfo {
  type: 'bus' | 'subway';
  stationName: string;
  routeName: string;
  arrivalTime: number; // 분 단위
  remainingStops?: number;
}
