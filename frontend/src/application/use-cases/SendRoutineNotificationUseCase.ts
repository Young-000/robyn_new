import { Routine } from '@/domain/entities/Routine';
import type { INotificationService } from '@/domain/interfaces/INotificationService';

export interface IInformationService {
  getWeatherInfo(config: any): Promise<any>;
  getAirQualityInfo(config: any): Promise<any>;
  getBusArrivalInfo(config: any): Promise<any>;
  getSubwayArrivalInfo(config: any): Promise<any>;
}

export class SendRoutineNotificationUseCase {
  constructor(
    private notificationService: INotificationService,
    private informationService: IInformationService
  ) {}

  async execute(routine: Routine): Promise<void> {
    if (!routine.enabled) {
      return;
    }

    const informationParts: string[] = [];

    // 각 정보 소스에서 정보 수집
    for (const source of routine.informationSources) {
      try {
        const info = await this.collectInformation(source);
        if (info) {
          informationParts.push(info);
        }
      } catch (error) {
        console.error(`Failed to collect information for ${source.type}:`, error);
        // 에러가 발생해도 다른 정보는 계속 수집
      }
    }

    if (informationParts.length === 0) {
      informationParts.push('정보를 수집할 수 없습니다.');
    }

    // 알림 전송
    await this.notificationService.sendNotification({
      title: `${routine.name} 알림`,
      body: informationParts.join('\n'),
      tag: `routine-${routine.id}`,
      requireInteraction: false,
    });
  }

  private async collectInformation(source: any): Promise<string | null> {
    try {
      switch (source.type) {
        case 'weather': {
          const weather = await this.informationService.getWeatherInfo(source.config);
          return `🌤️ 날씨: ${weather.temperature}°C, ${weather.condition} (습도: ${weather.humidity}%)`;
        }
        case 'airQuality': {
          const airQuality = await this.informationService.getAirQualityInfo(source.config);
          const levelTextMap: Record<string, string> = {
            good: '좋음',
            moderate: '보통',
            unhealthy: '나쁨',
            veryUnhealthy: '매우 나쁨',
            hazardous: '위험',
          };
          const levelText = levelTextMap[airQuality.level] || '알 수 없음';
          return `💨 미세먼지: ${levelText} (PM10: ${airQuality.pm10}㎍/㎥, PM2.5: ${airQuality.pm25}㎍/㎥)`;
        }
        case 'bus': {
          const bus = await this.informationService.getBusArrivalInfo(source.config);
          const timeText = bus.arrivalTime === 0 ? '곧 도착' : `${bus.arrivalTime}분 후`;
          return `🚌 버스: ${bus.routeName} ${timeText} (${bus.stationName})`;
        }
        case 'subway': {
          const subway = await this.informationService.getSubwayArrivalInfo(source.config);
          const timeText = subway.arrivalTime === 0 ? '곧 도착' : `${subway.arrivalTime}분 후`;
          return `🚇 지하철: ${subway.routeName} ${timeText} (${subway.stationName})`;
        }
        default:
          return null;
      }
    } catch (error) {
      console.error(`Failed to collect ${source.type} information:`, error);
      return null;
    }
  }
}
