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

## 3. Clean Architecture 설계

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
