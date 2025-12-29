import type { IInformationService } from '@/application/use-cases/SendRoutineNotificationUseCase';
import type { Location } from '@/shared/types';

interface AirKoreaResponse {
  response: {
    body: {
      items: Array<{
        stationName: string;
        pm10Value: string;
        pm25Value: string;
        pm10Grade: string;
        pm25Grade: string;
        dataTime: string;
      }>;
      totalCount: number;
    };
  };
}

interface StationResponse {
  response: {
    body: {
      items: Array<{
        stationName: string;
        addr: string;
        tm: string; // 위도/경도
      }>;
    };
  };
}

/**
 * 시도명 추출 (위도/경도 기반 간단한 매핑)
 */
function getSidoName(latitude: number, longitude: number): string {
  // 간단한 지역 매핑 (실제로는 측정소 API로 정확히 찾아야 함)
  if (latitude >= 37.4 && latitude <= 37.7 && longitude >= 126.8 && longitude <= 127.2) {
    return '서울';
  }
  if (latitude >= 35.0 && latitude <= 35.3 && longitude >= 129.0 && longitude <= 129.3) {
    return '부산';
  }
  if (latitude >= 35.8 && latitude <= 36.0 && longitude >= 128.5 && longitude <= 128.7) {
    return '대구';
  }
  if (latitude >= 37.4 && latitude <= 37.6 && longitude >= 126.9 && longitude <= 127.2) {
    return '인천';
  }
  if (latitude >= 37.2 && latitude <= 37.6 && longitude >= 127.0 && longitude <= 127.2) {
    return '경기';
  }
  // 기본값
  return '서울';
}

/**
 * 등급 번호를 텍스트로 변환
 */
function getGradeText(grade: string): 'good' | 'moderate' | 'unhealthy' | 'veryUnhealthy' | 'hazardous' {
  const gradeNum = parseInt(grade);
  if (gradeNum === 1) return 'good';
  if (gradeNum === 2) return 'moderate';
  if (gradeNum === 3) return 'unhealthy';
  if (gradeNum === 4) return 'veryUnhealthy';
  return 'hazardous';
}

export class AirKoreaApiService implements IInformationService {
  private readonly apiKey: string;
  private readonly baseUrl = 'http://apis.data.go.kr/B552584/ArpltnInforInqireSvc';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || import.meta.env.VITE_AIRKOREA_API_KEY || '';
    if (!this.apiKey) {
      console.warn('AirKorea API key not provided. Using mock data.');
    }
  }

  async getWeatherInfo(_config: any): Promise<any> {
    throw new Error('Weather API not implemented in AirKoreaApiService');
  }

  async getAirQualityInfo(config: { location: Location }): Promise<any> {
    if (!this.apiKey) {
      return this.getMockAirQualityData();
    }

    try {
      const { latitude, longitude } = config.location;
      const sidoName = getSidoName(latitude, longitude);

      // 시도별 실시간 측정 정보 조회
      const url = `${this.baseUrl}/getCtprvnRltmMesureDnsty?serviceKey=${encodeURIComponent(this.apiKey)}&returnType=json&numOfRows=100&pageNo=1&sidoName=${encodeURIComponent(sidoName)}&ver=1.0`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`AirKorea API error: ${response.status}`);
      }

      const data: AirKoreaResponse = await response.json();
      const items = data.response?.body?.items || [];

      if (items.length === 0) {
        return this.getMockAirQualityData();
      }

      // 첫 번째 측정소 데이터 사용 (실제로는 가장 가까운 측정소 찾아야 함)
      const item = items[0];

      const pm10 = item.pm10Value ? parseInt(item.pm10Value) : 0;
      const pm25 = item.pm25Value ? parseInt(item.pm25Value) : 0;
      
      // 등급이 없으면 값으로 계산
      let level: 'good' | 'moderate' | 'unhealthy' | 'veryUnhealthy' | 'hazardous';
      if (item.pm10Grade) {
        level = getGradeText(item.pm10Grade);
      } else {
        // 값으로 등급 계산
        if (pm10 <= 30 && pm25 <= 15) level = 'good';
        else if (pm10 <= 80 && pm25 <= 35) level = 'moderate';
        else if (pm10 <= 150 && pm25 <= 75) level = 'unhealthy';
        else if (pm10 <= 250 && pm25 <= 150) level = 'veryUnhealthy';
        else level = 'hazardous';
      }

      // AQI 계산 (간단한 버전)
      const aqi = Math.max(
        pm10 > 0 ? Math.round((pm10 / 150) * 100) : 0,
        pm25 > 0 ? Math.round((pm25 / 75) * 100) : 0
      );

      return {
        pm10,
        pm25,
        aqi,
        level,
        stationName: item.stationName,
        dataTime: item.dataTime,
      };
    } catch (error) {
      console.error('Failed to fetch AirKorea data:', error);
      return this.getMockAirQualityData();
    }
  }

  async getBusArrivalInfo(_config: any): Promise<any> {
    throw new Error('Bus API not implemented in AirKoreaApiService');
  }

  async getSubwayArrivalInfo(_config: any): Promise<any> {
    throw new Error('Subway API not implemented in AirKoreaApiService');
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
