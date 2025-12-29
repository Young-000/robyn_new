import type { IInformationService } from '@/application/use-cases/SendRoutineNotificationUseCase';

interface BusArrivalResponse {
  msgBody: {
    itemList: Array<{
      arrmsg1: string;
      arrmsg2: string;
      routeId: string;
      routeNm: string;
      stationNm: string;
      arrmsgSec1: number;
      arrmsgSec2: number;
    }>;
  };
}

interface SubwayArrivalResponse {
  realtimeArrivalList: Array<{
    trainLineNm: string;
    arvlMsg2: string;
    arvlMsg3: string;
    arvlCd: string;
  }>;
}

export class TransitApiService implements IInformationService {
  private readonly apiKey: string;
  private readonly busBaseUrl = 'http://ws.bus.go.kr/api/rest/arrive/getArrInfoByRoute';
  private readonly subwayBaseUrl = 'http://swopenAPI.seoul.go.kr/api/subway';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || import.meta.env.VITE_TRANSIT_API_KEY || '';
    if (!this.apiKey) {
      console.warn('Transit API key not provided. Using mock data.');
    }
  }

  async getWeatherInfo(_config: any): Promise<any> {
    throw new Error('Weather API not implemented in TransitApiService');
  }

  async getAirQualityInfo(_config: any): Promise<any> {
    throw new Error('Air Quality API not implemented in TransitApiService');
  }

  async getBusArrivalInfo(config: {
    stationId: string;
    routeId: string;
    stationName?: string;
    routeName?: string;
  }): Promise<any> {
    if (!this.apiKey) {
      return this.getMockBusData(config);
    }

    try {
      // 공공데이터포털 버스 API (서울시)
      const url = `${this.busBaseUrl}?serviceKey=${this.apiKey}&stId=${config.stationId}&busRouteId=${config.routeId}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Bus API error: ${response.status}`);
      }

      const data: BusArrivalResponse = await response.json();
      const item = data.msgBody?.itemList?.[0];

      if (!item) {
        return this.getMockBusData(config);
      }

      // 도착 시간 파싱 (초 단위를 분 단위로 변환)
      const arrivalTime1 = item.arrmsgSec1 ? Math.ceil(item.arrmsgSec1 / 60) : null;
      const arrivalTime2 = item.arrmsgSec2 ? Math.ceil(item.arrmsgSec2 / 60) : null;
      const arrivalTime = arrivalTime1 || arrivalTime2 || 0;

      return {
        type: 'bus' as const,
        stationName: item.stationNm || config.stationName || '알 수 없음',
        routeName: item.routeNm || config.routeName || '알 수 없음',
        arrivalTime: Math.max(0, arrivalTime),
        message: item.arrmsg1 || item.arrmsg2 || '도착 정보 없음',
      };
    } catch (error) {
      console.error('Failed to fetch bus data:', error);
      return this.getMockBusData(config);
    }
  }

  async getSubwayArrivalInfo(config: {
    stationId: string;
    lineId: string;
    direction: 'up' | 'down';
    stationName?: string;
    lineName?: string;
  }): Promise<any> {
    if (!this.apiKey) {
      return this.getMockSubwayData(config);
    }

    try {
      // 서울시 지하철 API
      const url = `${this.subwayBaseUrl}/${this.apiKey}/json/realtimeStationArrival/0/5/${config.stationId}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Subway API error: ${response.status}`);
      }

      const data: SubwayArrivalResponse = await response.json();
      const arrivals = data.realtimeArrivalList || [];

      // 방향에 맞는 첫 번째 열차 찾기
      const arrival = arrivals.find((a) => {
        const directionCode = config.direction === 'up' ? '0' : '1';
        return a.arvlCd === directionCode || a.arvlCd === '0';
      }) || arrivals[0];

      if (!arrival) {
        return this.getMockSubwayData(config);
      }

      // 도착 메시지에서 시간 추출
      const arrivalTime = this.parseArrivalTime(arrival.arvlMsg2 || arrival.arvlMsg3);

      return {
        type: 'subway' as const,
        stationName: config.stationName || '알 수 없음',
        routeName: arrival.trainLineNm || config.lineName || '알 수 없음',
        arrivalTime,
        message: arrival.arvlMsg2 || arrival.arvlMsg3 || '도착 정보 없음',
      };
    } catch (error) {
      console.error('Failed to fetch subway data:', error);
      return this.getMockSubwayData(config);
    }
  }

  private parseArrivalTime(message: string): number {
    // "2분 후 도착", "도착", "출발" 등의 메시지 파싱
    const match = message.match(/(\d+)\s*분/);
    if (match) {
      return parseInt(match[1], 10);
    }
    if (message.includes('도착') || message.includes('출발')) {
      return 0;
    }
    return 1; // 기본값
  }

  private getMockBusData(config: any) {
    return {
      type: 'bus' as const,
      stationName: config.stationName || '강남역',
      routeName: config.routeName || '146번',
      arrivalTime: Math.floor(Math.random() * 10) + 1,
      message: '도착 정보 없음 (Mock 데이터)',
    };
  }

  private getMockSubwayData(config: any) {
    return {
      type: 'subway' as const,
      stationName: config.stationName || '강남역',
      routeName: config.lineName || '2호선',
      arrivalTime: Math.floor(Math.random() * 5) + 1,
      message: '도착 정보 없음 (Mock 데이터)',
    };
  }
}
