# API 설정 상세 가이드

## 📋 목차
1. [날씨 API (OpenWeatherMap)](#1-날씨-api-openweathermap)
2. [교통 API (공공데이터포털)](#2-교통-api-공공데이터포털)
3. [환경 변수 설정](#3-환경-변수-설정)
4. [테스트 방법](#4-테스트-방법)

---

## 1. 날씨 API (OpenWeatherMap)

### 🌐 사이트
**https://openweathermap.org/api**

### 📝 가입 및 API 키 발급 방법

#### Step 1: 회원가입
1. https://openweathermap.org/api 접속
2. 우측 상단 **"Sign Up"** 또는 **"Sign In"** 클릭
3. 새 계정 생성:
   - Email 입력
   - Username 입력
   - Password 입력
   - 이용약관 동의
   - **"Create Account"** 클릭

#### Step 2: 이메일 인증
1. 등록한 이메일로 인증 링크 확인
2. 이메일 내 인증 링크 클릭

#### Step 3: API 키 확인
1. 로그인 후 대시보드 접속
2. 상단 메뉴에서 **"API keys"** 클릭
3. 기본 API 키가 생성되어 있음 (예: `abc123def456ghi789...`)
4. 또는 **"Generate"** 버튼으로 새 API 키 생성 가능

#### Step 4: API 키 복사
- API 키를 복사해두세요 (나중에 사용)

### 💰 요금제
- **Free Plan**: 무료
  - 1분당 60회 호출
  - 1일 1,000,000회 호출
  - 현재 날씨, 5일 예보, 미세먼지 정보 제공
  - **이 프로젝트에는 무료 플랜으로 충분합니다!**

### 📚 사용 가능한 API
- **Current Weather Data**: 현재 날씨
- **Air Pollution API**: 미세먼지 정보
- **5 Day / 3 Hour Forecast**: 5일 예보 (선택사항)

### 🔗 직접 링크
- 회원가입: https://home.openweathermap.org/users/sign_up
- API 키 관리: https://home.openweathermap.org/api_keys
- API 문서: https://openweathermap.org/api

---

## 2. 교통 API (공공데이터포털)

### 🌐 사이트
**https://www.data.go.kr/**

### 📝 가입 및 API 키 발급 방법

#### Step 1: 회원가입
1. https://www.data.go.kr/ 접속
2. 우측 상단 **"회원가입"** 클릭
3. 회원가입 유형 선택:
   - **개인회원** 또는 **기업회원** 선택
4. 정보 입력:
   - 아이디, 비밀번호, 이름, 이메일, 휴대폰 번호 등
5. 본인인증 진행 (휴대폰 인증)
6. 약관 동의 후 가입 완료

#### Step 2: API 서비스 신청

##### 버스 API 신청
1. 검색창에 **"서울시 버스 도착정보"** 검색
2. **"서울시 버스도착정보조회서비스"** 선택
3. **"활용신청"** 버튼 클릭
4. 활용 목적 작성 (예: "개인 프로젝트 개발")
5. 신청 완료 (보통 즉시 승인)

##### 지하철 API 신청
1. 검색창에 **"서울시 지하철 도착정보"** 검색
2. **"서울시 지하철 실시간 도착정보"** 선택
3. **"활용신청"** 버튼 클릭
4. 활용 목적 작성
5. 신청 완료

#### Step 3: API 키 확인
1. 우측 상단 **"마이페이지"** 클릭
2. **"활용신청 현황"** 또는 **"인증키 관리"** 메뉴 선택
3. 승인된 서비스 목록에서 **"인증키"** 확인
4. 인증키 복사 (예: `abc123def456...`)

### 💰 요금제
- **무료**: 대부분의 공공데이터는 무료 제공
- 일일 호출 제한이 있을 수 있음 (서비스마다 상이)

### 📚 사용 가능한 API
- **버스 도착정보**: 정류장별 버스 도착 시간
- **지하철 도착정보**: 역별 지하철 도착 시간

### 🔗 직접 링크
- 회원가입: https://www.data.go.kr/iim/api/insertAPIAcountView.do
- 버스 API: https://www.data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15000330
- 지하철 API: https://www.data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15000329

### 📖 API 사용법 (참고)
- 버스 정류장 ID 찾기: https://www.data.go.kr/iim/api/selectAPIAcountView.do
- 지하철 역 ID 찾기: 각 API 문서 참조

---

## 3. 환경 변수 설정

### Step 1: 환경 변수 파일 생성

프로젝트 루트의 `frontend` 디렉토리에 `.env` 파일 생성:

```bash
cd frontend
touch .env
```

### Step 2: 환경 변수 입력

`.env` 파일에 다음 내용 추가:

```env
# Weather API (OpenWeatherMap)
VITE_WEATHER_API_KEY=여기에_OpenWeatherMap_API_키_입력

# Transit API (공공데이터포털)
VITE_TRANSIT_API_KEY=여기에_공공데이터포털_API_키_입력
```

### 예시:
```env
VITE_WEATHER_API_KEY=abc123def456ghi789jkl012mno345pqr678
VITE_TRANSIT_API_KEY=xyz789uvw456rst123abc456def789
```

### ⚠️ 중요 사항
1. **`VITE_` 접두사 필수**: Vite에서는 환경 변수에 `VITE_` 접두사가 필요합니다
2. **따옴표 불필요**: 값에 따옴표를 붙이지 마세요
3. **공백 주의**: `=` 앞뒤에 공백이 없어야 합니다
4. **Git에 커밋하지 않기**: `.env` 파일은 `.gitignore`에 포함되어 있어 Git에 올라가지 않습니다

### Step 3: 개발 서버 재시작

환경 변수를 변경한 후에는 개발 서버를 재시작해야 합니다:

```bash
# 개발 서버 중지 (Ctrl+C)
# 다시 시작
npm run dev
```

---

## 4. 테스트 방법

### 4.1 API 키 설정 확인

브라우저 개발자 도구 콘솔에서 확인:
```javascript
console.log(import.meta.env.VITE_WEATHER_API_KEY);
console.log(import.meta.env.VITE_TRANSIT_API_KEY);
```

### 4.2 날씨 API 테스트

1. 루틴 추가
2. 정보 소스에서 **"날씨"** 선택
3. 위치 설정:
   - 위도: `37.5665` (서울시청)
   - 경도: `126.9780`
4. 알림 시간을 현재 시간보다 1-2분 후로 설정
5. 저장 후 알림 시간까지 대기
6. 알림에서 실제 날씨 정보 확인

### 4.3 교통 API 테스트

#### 버스 테스트
1. 루틴 추가
2. 정보 소스에서 **"버스"** 선택
3. 설정 입력:
   - 정류장 ID: 공공데이터포털에서 확인한 ID
   - 노선 ID: 공공데이터포털에서 확인한 ID
   - 정류장 이름: 예) "강남역"
   - 노선 이름: 예) "146번"
4. 알림 시간 설정 후 테스트

#### 지하철 테스트
1. 루틴 추가
2. 정보 소스에서 **"지하철"** 선택
3. 설정 입력:
   - 역 ID: 공공데이터포털에서 확인한 ID
   - 호선 ID: 예) "2"
   - 방향: 상행/하행 선택
   - 역 이름: 예) "강남역"
   - 호선 이름: 예) "2호선"
4. 알림 시간 설정 후 테스트

### 4.3 Mock 데이터 확인

API 키가 없거나 API 호출이 실패하면 자동으로 Mock 데이터가 사용됩니다:
- 콘솔에 "Using mock data" 메시지 확인 가능
- 알림에는 랜덤 데이터가 표시됨

---

## 5. 문제 해결

### 문제: API 키가 적용되지 않음
**해결책:**
1. `.env` 파일이 `frontend` 디렉토리에 있는지 확인
2. `VITE_` 접두사가 있는지 확인
3. 개발 서버 재시작

### 문제: API 호출 실패
**해결책:**
1. API 키가 올바른지 확인
2. API 서비스가 승인되었는지 확인 (공공데이터포털)
3. 네트워크 연결 확인
4. 브라우저 콘솔에서 에러 메시지 확인

### 문제: CORS 에러
**해결책:**
- OpenWeatherMap: CORS 지원 (문제 없음)
- 공공데이터포털: 일부 API는 CORS 제한이 있을 수 있음
  - 이 경우 백엔드 프록시 서버 필요 (향후 구현)

---

## 6. 빠른 시작 체크리스트

- [ ] OpenWeatherMap 회원가입 및 API 키 발급
- [ ] 공공데이터포털 회원가입
- [ ] 버스 API 활용신청
- [ ] 지하철 API 활용신청
- [ ] API 키 확인 및 복사
- [ ] `frontend/.env` 파일 생성
- [ ] 환경 변수 입력
- [ ] 개발 서버 재시작
- [ ] 테스트 루틴 생성 및 확인

---

## 7. 추가 리소스

### OpenWeatherMap
- API 문서: https://openweathermap.org/api
- 지원 포럼: https://openweathermap.org/forum
- 가격 정책: https://openweathermap.org/price

### 공공데이터포털
- API 가이드: https://www.data.go.kr/
- 개발자 센터: https://www.data.go.kr/developers
- 문의: 각 API 페이지의 문의처 참조

---

## 8. 보안 주의사항

⚠️ **중요**: API 키는 절대 공개하지 마세요!

- `.env` 파일은 Git에 커밋되지 않습니다 (`.gitignore`에 포함)
- 프로덕션 배포 시 환경 변수를 안전하게 관리하세요
- API 키가 노출되면 즉시 재발급 받으세요

---

**설정 완료 후 개발 서버를 재시작하고 루틴을 추가해보세요!** 🚀
