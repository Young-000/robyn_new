import { Routine } from '@/domain/entities/Routine';
import type { INotificationService } from '@/domain/interfaces/INotificationService';
import type { InformationSourceType } from '@/shared/types';

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
    switch (source.type) {
      case 'weather': {
        const weather = await this.informationService.getWeatherInfo(source.config);
        return `🌤️ 날씨: ${weather.temperature}°C, ${weather.condition}`;
      }
      case 'airQuality': {
        const airQuality = await this.informationService.getAirQualityInfo(source.config);
        return `💨 미세먼지: ${airQuality.level === 'good' ? '좋음' : '보통'} (PM10: ${airQuality.pm10})`;
      }
      case 'bus': {
        const bus = await this.informationService.getBusArrivalInfo(source.config);
        return `🚌 버스: ${bus.routeName} ${bus.arrivalTime}분 후 도착`;
      }
      case 'subway': {
        const subway = await this.informationService.getSubwayArrivalInfo(source.config);
        return `🚇 지하철: ${subway.routeName} ${subway.arrivalTime}분 후 도착`;
      }
      default:
        return null;
    }
  }
}
