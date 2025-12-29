# API 교체 가이드

## 🔄 API만 끼우면 갈아끼울 수 있는 구조

### 현재 구조

```
IInformationService (인터페이스)
    ↑
    │ 구현
    ├── WeatherApiService
    ├── KoreaWeatherApiService
    ├── AirKoreaApiService
    └── MockInformationService
```

### 새 API 추가 방법 (3단계)

#### Step 1: 인터페이스 구현
```typescript
// src/infrastructure/api/NewApiService.ts
import type { IInformationService } from '@/application/use-cases/SendRoutineNotificationUseCase';

export class NewApiService implements IInformationService {
  constructor(private apiKey: string) {}

  async getWeatherInfo(config: any): Promise<any> {
    // 새 API 호출
    const response = await fetch(`https://new-api.com/weather?key=${this.apiKey}`);
    const data = await response.json();
    return {
      temperature: data.temp,
      condition: data.weather,
      humidity: data.humidity,
    };
  }

  async getAirQualityInfo(config: any): Promise<any> {
    // 구현
  }

  async getBusArrivalInfo(config: any): Promise<any> {
    throw new Error('Not implemented');
  }

  async getSubwayArrivalInfo(config: any): Promise<any> {
    throw new Error('Not implemented');
  }
}
```

#### Step 2: Factory에 추가
```typescript
// InformationServiceFactory.ts
import { NewApiService } from './NewApiService';

export class InformationServiceFactory {
  static create(): IInformationService {
    const newApiKey = import.meta.env.VITE_NEW_API_KEY;
    
    if (newApiKey) {
      return new NewApiService(newApiKey);
    }
    
    // 기존 로직...
  }
}
```

#### Step 3: 환경 변수 추가
```env
VITE_NEW_API_KEY=your_api_key_here
```

### 끝! 기존 코드 수정 불필요 ✅

---

**이렇게만 하면 새 API를 추가할 수 있습니다!**
