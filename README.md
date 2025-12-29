# 루틴 정보 알림 시스템

출퇴근 시간에 필요한 날씨, 교통 정보를 자동으로 알림해주는 PWA 서비스

## 프로젝트 구조

```
├── frontend/          # React PWA Frontend
├── backend/          # Node.js Backend API
├── shared/           # 공유 타입 및 유틸리티
└── PLANNING.md       # 상세 플래닝 문서
```

## 개발 단계

### Phase 1: 브라우저 알림 POC (현재)
- 브라우저가 열려있을 때 알림 기능
- 기본 루틴 관리 및 정보 수집

### Phase 2: 휴대폰 푸시 알림
- Service Worker 기반 푸시 알림
- 백그라운드 동기화

## 기술 스택

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript + Prisma + PostgreSQL
- **Testing**: Vitest + React Testing Library
- **Architecture**: Clean Architecture + TDD

## 시작하기

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### API 키 설정 (선택사항)
실제 날씨 및 교통 정보를 받으려면 API 키가 필요합니다.

1. **날씨 API**: https://openweathermap.org/api
   - 무료 회원가입 후 API 키 발급
   
2. **교통 API**: https://www.data.go.kr/
   - 회원가입 후 "서울시 버스/지하철 도착정보" 활용신청

3. `frontend/.env` 파일 생성:
```env
VITE_WEATHER_API_KEY=your_api_key_here
VITE_TRANSIT_API_KEY=your_api_key_here
```

4. 개발 서버 재시작

**상세 가이드**: [API_SETUP_DETAILED_GUIDE.md](./API_SETUP_DETAILED_GUIDE.md)

### Backend
```bash
cd backend
npm install
npm run dev
```

## 개발 원칙

- **Clean Architecture**: 계층 분리 및 의존성 역전
- **TDD**: 테스트 주도 개발
- **TypeScript**: 타입 안정성
- **코드 품질**: ESLint + Prettier
