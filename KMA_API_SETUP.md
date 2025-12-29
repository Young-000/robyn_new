# 기상청 API 설정 가이드

## ✅ 기상청 API 사용 가능합니다!

기상청 API를 사용하도록 코드를 추가했습니다. 기상청 API가 우선적으로 사용됩니다.

## 🚀 설정 방법

### Step 1: 공공데이터포털에서 API 신청
1. https://www.data.go.kr/ 접속
2. 검색창에 **"기상청 단기예보"** 검색
3. **"기상청_단기예보 ((구)동네예보) 조회서비스"** 선택
4. **"활용신청"** 클릭
5. 활용 목적 작성 후 신청 완료

### Step 2: 인증키 확인
1. 마이페이지 → 인증키 관리
2. 인증키 복사

### Step 3: .env 파일에 추가
`frontend/.env` 파일에 다음 추가:

```env
# 기상청 API (우선 사용)
VITE_KMA_API_KEY=여기에_기상청_API_키_입력

# OpenWeatherMap API (기상청 API가 없을 경우 대체)
VITE_WEATHER_API_KEY=d861816bb922027e9bd463cf290b74c6
```

## 📋 API 우선순위

1. **기상청 API** (VITE_KMA_API_KEY) - 우선 사용 ⭐
2. **OpenWeatherMap API** (VITE_WEATHER_API_KEY) - 대체
3. **Mock 데이터** - API 키가 없을 경우

## ✅ 장점

- 🇰🇷 한국어 지원
- 🇰🇷 한국 지역 특화
- 💰 무료
- 📊 정확한 한국 날씨 정보

## 🔧 구현 완료

- ✅ 기상청 API 서비스 클래스 생성
- ✅ 위도/경도 → 격자 좌표 변환 함수 추가
- ✅ 기상청 API 우선 사용 로직 구현
- ✅ OpenWeatherMap API 대체 로직 유지

## 📝 참고

- 기상청 API는 미세먼지 정보를 제공하지 않습니다
- 미세먼지는 AirKorea API 또는 OpenWeatherMap 사용 필요
- 현재는 Mock 데이터로 대체됩니다

---

**기상청 API 키를 발급받아 `.env` 파일에 추가하시면 한국어 날씨 정보를 받을 수 있습니다!** 🇰🇷
