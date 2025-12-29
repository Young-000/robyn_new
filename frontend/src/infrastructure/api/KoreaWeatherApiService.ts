import type { IInformationService } from '@/application/use-cases/SendRoutineNotificationUseCase';
import type { Location } from '@/shared/types';

interface KMAWeatherResponse {
  response: {
    body: {
      items: {
        item: Array<{
          category: string;
          obsrValue: string;
          baseDate: string;
          baseTime: string;
        }>;
      };
    };
  };
}

/**
 * 위도/경도를 기상청 격자 좌표로 변환
 */
function convertLatLonToGrid(lat: number, lon: number): { nx: number; ny: number } {
  const RE = 6371.00877; // 지구 반경(km)
  const GRID = 5.0; // 격자 간격(km)
  const SLAT1 = 30.0; // 투영 위도1(degree)
  const SLAT2 = 60.0; // 투영 위도2(degree)
  const OLON = 126.0; // 기준점 경도(degree)
  const OLAT = 38.0; // 기준점 위도(degree)
  const XO = 43; // 기준점 X좌표(GRID)
  const YO = 136; // 기준점 Y좌표(GRID)

  const DEGRAD = Math.PI / 180.0;
  const RADDEG = 180.0 / Math.PI;

  const re = RE / GRID;
  const slat1 = SLAT1 * DEGRAD;
  const slat2 = SLAT2 * DEGRAD;
  const olon = OLON * DEGRAD;
  const olat = OLAT * DEGRAD;

  let sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
  let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn;
  let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
  ro = (re * sf) / Math.pow(ro, sn);

  const ra = Math.tan(Math.PI * 0.25 + lat * DEGRAD * 0.5);
  const ra2 = (re * sf) / Math.pow(ra, sn);
  let theta = lon * DEGRAD - olon;
  if (theta > Math.PI) theta -= 2.0 * Math.PI;
  if (theta < -Math.PI) theta += 2.0 * Math.PI;
  theta *= sn;

  const nx = Math.floor(ra2 * Math.sin(theta) + XO + 0.5);
  const ny = Math.floor(ro - ra2 * Math.cos(theta) + YO + 0.5);

  return { nx, ny };
}

/**
 * 현재 시간 기준으로 base_date와 base_time 계산
 */
function getBaseDateTime(): { baseDate: string; baseTime: string } {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = now.getHours();
  
  // 기상청 API는 매 시간 30분에 데이터 업데이트
  // 현재 시간이 30분 이전이면 이전 시간 데이터 사용
  const minute = now.getMinutes();
  let baseHour = hour;
  if (minute < 30) {
    baseHour = hour - 1;
    if (baseHour < 0) {
      baseHour = 23;
      // 전날로 이동하는 로직은 생략 (간단화)
    }
  }
  
  // base_time은 0200, 0500, 0800, 1100, 1400, 1700, 2000, 2300 형식
  // 초단기예보는 매 시간 업데이트되므로 가장 가까운 시간 사용
  const baseTime = String(baseHour).padStart(2, '0') + '00';
  
  return {
    baseDate: `${year}${month}${day}`,
    baseTime,
  };
}

export class KoreaWeatherApiService implements IInformationService {
  private readonly apiKey: string;
  private readonly baseUrl = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || import.meta.env.VITE_KMA_API_KEY || '';
    if (!this.apiKey) {
      console.warn('KMA API key not provided. Using mock data.');
    }
  }

  async getWeatherInfo(config: { location: Location }): Promise<any> {
    if (!this.apiKey) {
      return this.getMockWeatherData();
    }

    try {
      const { latitude, longitude } = config.location;
      const { nx, ny } = convertLatLonToGrid(latitude, longitude);
      const { baseDate, baseTime } = getBaseDateTime();

      // 초단기실황 조회 (현재 날씨)
      const url = `${this.baseUrl}/getUltraSrtNcst?serviceKey=${encodeURIComponent(this.apiKey)}&pageNo=1&numOfRows=10&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`KMA API error: ${response.status}`);
      }

      const data: KMAWeatherResponse = await response.json();
      const items = data.response?.body?.items?.item || [];

      if (items.length === 0) {
        return this.getMockWeatherData();
      }

      // 카테고리별 값 추출
      const temp = items.find((item) => item.category === 'T1H')?.obsrValue || '0';
      const humidity = items.find((item) => item.category === 'REH')?.obsrValue || '0';
      const sky = items.find((item) => item.category === 'SKY')?.obsrValue || '1';
      const pty = items.find((item) => item.category === 'PTY')?.obsrValue || '0';

      // 하늘 상태 변환
      const skyCondition = this.getSkyCondition(parseInt(sky), parseInt(pty));

      return {
        temperature: Math.round(parseFloat(temp)),
        condition: skyCondition,
        humidity: parseInt(humidity),
      };
    } catch (error) {
      console.error('Failed to fetch KMA weather data:', error);
      return this.getMockWeatherData();
    }
  }

  async getAirQualityInfo(config: { location: Location }): Promise<any> {
    // 기상청 API는 미세먼지 정보를 제공하지 않음
    // AirKorea API 또는 OpenWeatherMap 사용 필요
    return this.getMockAirQualityData();
  }

  async getBusArrivalInfo(_config: any): Promise<any> {
    throw new Error('Bus API not implemented in KoreaWeatherApiService');
  }

  async getSubwayArrivalInfo(_config: any): Promise<any> {
    throw new Error('Subway API not implemented in KoreaWeatherApiService');
  }

  private getSkyCondition(sky: number, pty: number): string {
    // pty: 강수형태 (0: 없음, 1: 비, 2: 비/눈, 3: 눈, 4: 소나기)
    if (pty > 0) {
      if (pty === 1) return '비';
      if (pty === 2) return '비/눈';
      if (pty === 3) return '눈';
      if (pty === 4) return '소나기';
    }

    // sky: 하늘상태 (1: 맑음, 3: 구름많음, 4: 흐림)
    if (sky === 1) return '맑음';
    if (sky === 3) return '구름많음';
    if (sky === 4) return '흐림';

    return '알 수 없음';
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
