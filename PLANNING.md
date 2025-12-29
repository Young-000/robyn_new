# 루틴 정보 알림 시스템 - 프로젝트 플래닝 문서

## 1. 프로젝트 개요

### 1.1 문제 정의
- 출퇴근 시간에 날씨 정보, 버스/지하철 도착 시간 등이 여러 앱/웹사이트에 흩어져 있음
- 매일 반복되는 사소한 불편함이 지속적으로 발생
- 정보 확인을 위해 여러 앱을 열어야 하는 번거로움

### 1.2 해결 방안
- 사용자가 설정한 루틴(출근 시간, 퇴근 시간 등)에 따라 자동으로 정보 수집 및 알림 제공
- 날씨 정보: 현재 온도, 미세먼지, 오늘 예보, 비 예보 등
- 교통 정보: 지정한 버스/지하철 정류장의 예상 도착 시간
- 통합 알림: 모든 정보를 한 번에 제공

### 1.3 플랫폼 선택: **PWA (Progressive Web App)**

**추천 이유:**
- ✅ 웹의 빠른 개발 및 배포 장점
- ✅ 네이티브 앱 수준의 알림 기능 (Service Worker + Push API)
- ✅ 오프라인 지원 가능
- ✅ 설치 없이 사용 가능하지만 설치도 가능
- ✅ 크로스 플랫폼 (iOS, Android, Desktop)
- ✅ 실 서비스로 확장 가능 (앱 스토어 배포도 가능)

**앱 vs 웹 비교:**
- 네이티브 앱: 알림 기능 우수하지만 개발/배포 복잡도 높음
- 일반 웹: 개발 빠르지만 알림 기능 제한적
- **PWA: 두 가지의 장점 결합** ⭐

## 2. 기술 스택

### 2.1 Frontend
- **Framework**: React 18+ (TypeScript)
- **State Management**: Zustand 또는 React Query
- **UI Library**: Tailwind CSS + shadcn/ui
- **PWA**: Workbox (Service Worker)
- **Testing**: Vitest + React Testing Library
- **E2E Testing**: Playwright

### 2.2 Backend
- **Runtime**: Node.js (TypeScript)
- **Framework**: Express.js 또는 Fastify
- **Database**: PostgreSQL (주 DB) + Redis (캐싱)
- **ORM**: Prisma
- **Testing**: Vitest + Supertest
- **API Documentation**: OpenAPI/Swagger

### 2.3 External APIs
- **날씨 API**: OpenWeatherMap API 또는 기상청 API
- **미세먼지 API**: AirKorea API 또는 OpenWeatherMap
- **버스 API**: 공공데이터포털 (버스 도착정보)
- **지하철 API**: 공공데이터포털 (지하철 도착정보)

### 2.4 Infrastructure
- **Deployment**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Monitoring**: (선택) Sentry, LogRocket

### 2.5 알림 시스템
- **브라우저 알림**: Web Notifications API
- **푸시 알림**: Push API + Service Worker
- **백그라운드 동기화**: Background Sync API
- **푸시 서비스**: Firebase Cloud Messaging (FCM) 또는 Web Push Protocol

## 3. 알림 시스템 상세 설계

### 3.1 알림 방식 비교

#### 방식 1: 브라우저 알림 (Web Notifications API)
**장점:**
- ✅ 구현 간단
- ✅ 브라우저가 열려있을 때 즉시 알림
- ✅ 사용자 권한만 있으면 바로 사용 가능

**단점:**
- ❌ 브라우저가 닫히면 알림 불가
- ❌ 백그라운드에서 동작하지 않음
- ❌ 모바일에서 제한적 (특히 iOS Safari)

**사용 시나리오:**
- MVP 단계에서 빠른 구현
- 사용자가 앱을 열어둔 상태에서 알림

#### 방식 2: 푸시 알림 (Push API + Service Worker) ⭐ **추천**
**장점:**
- ✅ 브라우저가 닫혀도 알림 가능
- ✅ 백그라운드에서 동작
- ✅ 네이티브 앱 수준의 경험
- ✅ 서버에서 푸시 가능 (예약 알림 등)

**단점:**
- ❌ 구현 복잡도 높음
- ❌ iOS Safari 제한적 (iOS 16.4+ 지원)
- ❌ HTTPS 필수

**사용 시나리오:**
- 실 서비스 단계
- 백그라운드 알림 필요
- 서버에서 예약된 시간에 알림 전송

#### 방식 3: 하이브리드 방식 (권장)
**전략:**
1. **MVP 단계**: 브라우저 알림 (빠른 구현)
2. **실 서비스 단계**: 푸시 알림으로 전환
3. **폴백**: 푸시 알림 미지원 시 브라우저 알림 사용

### 3.2 알림 구현 아키텍처

```
┌─────────────────────────────────────────┐
│         사용자 디바이스                  │
│  ┌──────────────────────────────────┐  │
│  │   React App (Frontend)           │  │
│  │   - 알림 권한 요청                │  │
│  │   - 푸시 구독 관리                │  │
│  └──────────────────────────────────┘  │
│              ↕                          │
│  ┌──────────────────────────────────┐  │
│  │   Service Worker                 │  │
│  │   - 푸시 이벤트 수신              │  │
│  │   - 알림 표시                    │  │
│  │   - 백그라운드 동기화             │  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
              ↕ HTTPS
┌─────────────────────────────────────────┐
│         백엔드 서버                      │
│  ┌──────────────────────────────────┐  │
│  │   Notification Service           │  │
│  │   - 알림 스케줄링                 │  │
│  │   - 푸시 전송                    │  │
│  └──────────────────────────────────┘  │
│              ↕                          │
│  ┌──────────────────────────────────┐  │
│  │   FCM / Web Push Service         │  │
│  │   - 푸시 메시지 전달              │  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### 3.3 알림 플로우

#### 시나리오 1: 사용자가 앱을 열어둔 경우
```
1. 사용자가 앱 사용 중
2. 루틴 시간 도래
3. Frontend에서 정보 수집
4. Web Notifications API로 즉시 알림 표시
```

#### 시나리오 2: 사용자가 앱을 닫은 경우 (푸시 알림)
```
1. 사용자가 앱 닫음
2. 백엔드에서 루틴 스케줄 확인 (Cron Job)
3. 루틴 시간 도래 시 정보 수집
4. FCM/Web Push로 푸시 메시지 전송
5. Service Worker가 푸시 이벤트 수신
6. 알림 표시 (브라우저가 닫혀도 가능)
```

### 3.4 기술 구현 상세

#### Frontend (알림 권한 및 구독)
```typescript
// 알림 권한 요청
const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
};

// 푸시 구독
const subscribeToPush = async () => {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: VAPID_PUBLIC_KEY
  });
  
  // 백엔드에 구독 정보 전송
  await fetch('/api/notifications/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription)
  });
};
```

#### Service Worker (푸시 수신 및 알림 표시)
```javascript
// service-worker.js
self.addEventListener('push', (event) => {
  const data = event.data.json();
  
  const options = {
    title: data.title,
    body: data.body,
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    data: data.data,
    actions: [
      { action: 'open', title: '열기' },
      { action: 'close', title: '닫기' }
    ],
    requireInteraction: false,
    silent: false
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// 알림 클릭 처리
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
```

#### Backend (푸시 전송)
```typescript
// 푸시 알림 전송 서비스
class NotificationService {
  async sendPushNotification(subscription: PushSubscription, payload: NotificationPayload) {
    // FCM 또는 Web Push Protocol 사용
    const response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Authorization': `key=${FCM_SERVER_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: subscription.endpoint,
        notification: {
          title: payload.title,
          body: payload.body,
          icon: payload.icon
        },
        data: payload.data
      })
    });
  }
  
  async scheduleRoutineNotification(routineId: string, scheduledTime: Date) {
    // Cron Job 또는 스케줄러로 예약
    // 시간 도래 시 정보 수집 후 푸시 전송
  }
}
```

### 3.5 플랫폼별 지원 현황

| 플랫폼 | 브라우저 알림 | 푸시 알림 | 백그라운드 동기화 |
|--------|--------------|----------|------------------|
| Chrome (Desktop) | ✅ | ✅ | ✅ |
| Chrome (Android) | ✅ | ✅ | ✅ |
| Firefox (Desktop) | ✅ | ✅ | ✅ |
| Firefox (Android) | ✅ | ✅ | ✅ |
| Safari (Desktop) | ✅ | ✅ (macOS 13+) | ⚠️ 제한적 |
| Safari (iOS) | ⚠️ 제한적 | ✅ (iOS 16.4+) | ❌ |
| Edge | ✅ | ✅ | ✅ |

### 3.6 알림 최적화 전략

1. **배치 알림**: 여러 정보를 하나의 알림으로 통합
2. **스마트 타이밍**: 사용자 활동 패턴 분석하여 최적 시간에 알림
3. **알림 그룹핑**: 같은 시간대 알림을 그룹으로 묶기
4. **사용자 설정**: 알림 빈도, 시간대, 타입별 on/off
5. **오프라인 큐**: 네트워크 오프라인 시 알림 큐에 저장 후 재시도

### 3.7 MVP vs 실 서비스 알림 전략

**MVP 단계:**
- 브라우저 알림만 사용 (구현 간단)
- 사용자가 앱을 열어둔 상태에서만 알림
- 빠른 프로토타입 검증

**실 서비스 단계:**
- 푸시 알림 구현
- 백그라운드 동기화
- 서버 스케줄링으로 정확한 시간 알림
- 알림 커스터마이징 (사운드, 진동, 우선순위)

## 4. Clean Architecture 설계

### 3.1 계층 구조

```
┌─────────────────────────────────────┐
│         Presentation Layer          │  ← React Components, Pages
├─────────────────────────────────────┤
│         Application Layer           │  ← Use Cases, DTOs
├─────────────────────────────────────┤
│          Domain Layer               │  ← Entities, Value Objects, Interfaces
├─────────────────────────────────────┤
│      Infrastructure Layer           │  ← API Clients, Database, External Services
└─────────────────────────────────────┘
```

### 3.2 디렉토리 구조

```
project-root/
├── frontend/
│   ├── src/
│   │   ├── presentation/          # UI Components
│   │   │   ├── components/        # 재사용 가능한 컴포넌트
│   │   │   ├── pages/            # 페이지 컴포넌트
│   │   │   └── hooks/            # Custom Hooks
│   │   ├── application/          # Use Cases
│   │   │   ├── use-cases/        # 비즈니스 로직
│   │   │   ├── dto/              # Data Transfer Objects
│   │   │   └── services/         # Application Services
│   │   ├── domain/               # Domain Models
│   │   │   ├── entities/         # 도메인 엔티티
│   │   │   ├── value-objects/    # 값 객체
│   │   │   └── interfaces/       # Repository/Service 인터페이스
│   │   ├── infrastructure/       # External Services
│   │   │   ├── api/              # API 클라이언트
│   │   │   ├── storage/          # LocalStorage, IndexedDB
│   │   │   └── notification/     # 알림 서비스
│   │   └── shared/               # 공통 유틸리티
│   ├── tests/
│   │   ├── unit/                 # 단위 테스트
│   │   ├── integration/          # 통합 테스트
│   │   └── e2e/                  # E2E 테스트
│   └── public/
│       └── sw.js                 # Service Worker
│
├── backend/
│   ├── src/
│   │   ├── presentation/          # Controllers, Routes
│   │   │   ├── controllers/      # HTTP 컨트롤러
│   │   │   ├── routes/           # 라우트 정의
│   │   │   └── middleware/       # 미들웨어
│   │   ├── application/          # Use Cases
│   │   │   ├── use-cases/        # 비즈니스 로직
│   │   │   ├── dto/              # DTOs
│   │   │   └── services/         # Application Services
│   │   ├── domain/               # Domain Models
│   │   │   ├── entities/         # 도메인 엔티티
│   │   │   ├── value-objects/    # 값 객체
│   │   │   └── repositories/     # Repository 인터페이스
│   │   └── infrastructure/       # Implementations
│   │       ├── database/         # Prisma, DB 연결
│   │       ├── repositories/     # Repository 구현
│   │       ├── external-apis/    # 외부 API 클라이언트
│   │       └── cache/            # Redis 캐싱
│   ├── tests/
│   │   ├── unit/
│   │   ├── integration/
│   │   └── e2e/
│   └── prisma/
│       └── schema.prisma         # DB 스키마
│
└── shared/                        # 공유 타입/유틸리티
    └── types/                     # 공통 TypeScript 타입
```

## 4. 도메인 모델 설계

### 4.1 핵심 엔티티

#### User (사용자)
```typescript
- id: string
- email?: string
- preferences: UserPreferences
- routines: Routine[]
```

#### Routine (루틴)
```typescript
- id: string
- userId: string
- name: string (예: "출근 루틴", "퇴근 루틴")
- schedule: Schedule (시간, 요일 등)
- enabled: boolean
- alertSettings: AlertSettings
- informationSources: InformationSource[]
```

#### Schedule (스케줄)
```typescript
- time: string (HH:mm 형식)
- daysOfWeek: DayOfWeek[] (월~일)
- timezone: string
```

#### AlertSettings (알림 설정)
```typescript
- notificationEnabled: boolean
- notificationTime: string (알림 시간, 예: "08:00")
- notificationMethods: NotificationMethod[] (push, sound, vibration)
```

#### InformationSource (정보 소스)
```typescript
- type: 'weather' | 'airQuality' | 'bus' | 'subway'
- config: WeatherConfig | BusConfig | SubwayConfig
```

#### WeatherConfig
```typescript
- location: Location (위도, 경도 또는 주소)
- includeForecast: boolean
- includeAirQuality: boolean
```

#### BusConfig
```typescript
- stationId: string
- routeId: string
- direction?: string
```

#### SubwayConfig
```typescript
- stationId: string
- lineId: string
- direction: 'up' | 'down'
```

### 4.2 Value Objects

#### Location
```typescript
- latitude: number
- longitude: number
- address?: string
```

#### WeatherInfo
```typescript
- temperature: number
- condition: string
- humidity: number
- airQuality?: AirQualityInfo
- forecast?: ForecastInfo[]
```

#### AirQualityInfo
```typescript
- pm10: number
- pm25: number
- aqi: number
- level: 'good' | 'moderate' | 'unhealthy' | 'veryUnhealthy' | 'hazardous'
```

#### TransitInfo
```typescript
- type: 'bus' | 'subway'
- stationName: string
- routeName: string
- arrivalTime: number (분 단위)
- remainingStops?: number
```

## 5. Use Cases (Application Layer)

### 5.1 Routine Management
- `CreateRoutineUseCase`: 루틴 생성
- `UpdateRoutineUseCase`: 루틴 수정
- `DeleteRoutineUseCase`: 루틴 삭제
- `GetRoutinesUseCase`: 사용자의 루틴 목록 조회
- `ToggleRoutineUseCase`: 루틴 활성화/비활성화

### 5.2 Information Gathering
- `GetWeatherInfoUseCase`: 날씨 정보 조회
- `GetAirQualityInfoUseCase`: 미세먼지 정보 조회
- `GetBusArrivalInfoUseCase`: 버스 도착 정보 조회
- `GetSubwayArrivalInfoUseCase`: 지하철 도착 정보 조회
- `GetRoutineInformationUseCase`: 루틴에 필요한 모든 정보 수집

### 5.3 Notification
- `ScheduleNotificationUseCase`: 알림 스케줄링
- `SendNotificationUseCase`: 알림 전송
- `CancelNotificationUseCase`: 알림 취소

## 6. TDD 전략

### 6.1 테스트 피라미드
```
        /\
       /E2E\          ← 소수 (주요 시나리오만)
      /────\
     /Integration\    ← 중간 (API 통합, Repository 통합)
    /────────────\
   /    Unit      \   ← 다수 (Use Cases, Utils, Components)
  /────────────────\
```

### 6.2 테스트 작성 순서
1. **Domain Layer**: 엔티티, Value Objects (순수 로직)
2. **Use Cases**: 비즈니스 로직 테스트
3. **Infrastructure**: 외부 API 모킹하여 테스트
4. **Presentation**: 컴포넌트 렌더링 및 상호작용 테스트
5. **Integration**: API 엔드포인트 통합 테스트
6. **E2E**: 주요 사용자 시나리오

### 6.3 테스트 커버리지 목표
- Domain Layer: 100%
- Use Cases: 90%+
- Infrastructure: 80%+
- Presentation: 70%+
- 전체: 80%+

## 7. 개발 단계 (MVP → 실 서비스)

### Phase 1: MVP (최소 기능 제품)
**목표**: 핵심 기능만 구현하여 검증

**기능:**
- [ ] 사용자 루틴 생성/수정/삭제
- [ ] 날씨 정보 조회 및 표시
- [ ] 버스/지하철 도착 정보 조회 및 표시
- [ ] 기본 알림 기능 (브라우저 알림)
- [ ] 간단한 UI

**기간**: 2-3주

### Phase 2: PWA 기능 강화
**목표**: 네이티브 앱 수준의 경험 제공

**기능:**
- [ ] Service Worker 구현
- [ ] 오프라인 지원
- [ ] 푸시 알림 (Push API)
- [ ] 홈 화면 설치 가능
- [ ] 백그라운드 동기화

**기간**: 1-2주

### Phase 3: 고도화
**목표**: 실 서비스 수준의 기능 및 안정성

**기능:**
- [ ] 사용자 인증 (OAuth, 소셜 로그인)
- [ ] 데이터 저장 (백엔드 연동)
- [ ] 알림 커스터마이징 (사운드, 진동 등)
- [ ] 다중 루틴 지원
- [ ] 통계 및 히스토리
- [ ] 에러 핸들링 및 모니터링
- [ ] 성능 최적화

**기간**: 3-4주

### Phase 4: 확장
**목표**: 추가 기능 및 스케일링

**기능:**
- [ ] 추가 정보 소스 (택시 예상 시간, 교통 정보 등)
- [ ] 위치 기반 자동 감지
- [ ] AI 기반 최적 알림 시간 추천
- [ ] 다국어 지원
- [ ] 앱 스토어 배포 (PWA → Native Wrapper)

**기간**: 지속적

## 8. API 설계 (Backend)

### 8.1 RESTful API 엔드포인트

#### Routines
- `GET /api/routines` - 루틴 목록 조회
- `POST /api/routines` - 루틴 생성
- `GET /api/routines/:id` - 루틴 상세 조회
- `PUT /api/routines/:id` - 루틴 수정
- `DELETE /api/routines/:id` - 루틴 삭제
- `PATCH /api/routines/:id/toggle` - 루틴 활성화/비활성화

#### Information
- `GET /api/information/weather` - 날씨 정보 조회
- `GET /api/information/air-quality` - 미세먼지 정보 조회
- `GET /api/information/bus/:stationId/:routeId` - 버스 도착 정보
- `GET /api/information/subway/:stationId/:lineId` - 지하철 도착 정보
- `GET /api/information/routine/:routineId` - 루틴 통합 정보 조회

#### Notifications
- `POST /api/notifications/subscribe` - 푸시 알림 구독
- `DELETE /api/notifications/unsubscribe` - 푸시 알림 구독 해제
- `GET /api/notifications/history` - 알림 히스토리

### 8.2 데이터베이스 스키마 (초안)

```prisma
model User {
  id          String    @id @default(uuid())
  email       String?   @unique
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  routines    Routine[]
  preferences UserPreferences?
}

model UserPreferences {
  id        String   @id @default(uuid())
  userId    String   @unique
  user      User     @relation(fields: [userId], references: [id])
  timezone  String   @default("Asia/Seoul")
  language  String   @default("ko")
}

model Routine {
  id                String   @id @default(uuid())
  userId            String
  user              User     @relation(fields: [userId], references: [id])
  name              String
  scheduleTime      String   // HH:mm 형식
  daysOfWeek        Int[]    // 0=일요일, 6=토요일
  enabled           Boolean  @default(true)
  notificationTime  String   // 알림 시간 (HH:mm)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  informationSources InformationSource[]
}

model InformationSource {
  id        String   @id @default(uuid())
  routineId String
  routine   Routine  @relation(fields: [routineId], references: [id])
  type      String   // 'weather', 'airQuality', 'bus', 'subway'
  config    Json     // 타입별 설정 정보
  order     Int      @default(0)
}

model NotificationHistory {
  id          String   @id @default(uuid())
  userId      String
  routineId   String?
  type        String
  title       String
  message     String
  sentAt      DateTime @default(now())
  read        Boolean  @default(false)
}
```

## 9. 보안 고려사항

- 사용자 인증: JWT 기반 인증
- API Rate Limiting: 외부 API 호출 제한
- 데이터 암호화: 민감 정보 암호화
- HTTPS: 모든 통신 암호화
- CORS: 적절한 CORS 설정
- Input Validation: 모든 입력값 검증

## 10. 성능 최적화

- **캐싱 전략**: 
  - 날씨 정보: 10분 캐시
  - 교통 정보: 1분 캐시
  - Redis 활용
- **API 호출 최적화**: 
  - 배치 요청
  - 병렬 처리
- **프론트엔드 최적화**:
  - 코드 스플리팅
  - 이미지 최적화
  - Service Worker 캐싱

## 11. 모니터링 및 로깅

- 에러 추적: Sentry
- 성능 모니터링: Web Vitals
- API 로깅: 구조화된 로그
- 알림 전송 로그: 추적 및 분석

## 12. 다음 단계

1. ✅ 플래닝 문서 작성 (현재 단계)
2. 프로젝트 초기 설정 (프로젝트 구조, 의존성 설치)
3. Domain Layer 구현 및 테스트
4. Infrastructure Layer 구현 (외부 API 연동)
5. Use Cases 구현 및 테스트
6. Presentation Layer 구현 (UI)
7. PWA 기능 구현
8. 통합 테스트 및 배포

---

**작성일**: 2024
**버전**: 1.0
