# AirKorea (한국환경공단) 미세먼지 API 가이드

## ✅ 미세먼지 정보는 AirKorea API에서 받습니다!

### 제공 기관
- **한국환경공단 (AirKorea)**
- 공공데이터포털을 통해 제공

## 📋 API 종류

### 1. 대기오염정보 조회 서비스 (추천) ⭐
- **API명**: 한국환경공단_에어코리아_대기오염정보
- **사이트**: https://www.data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15073861
- **제공 정보**:
  - PM10 (미세먼지)
  - PM2.5 (초미세먼지)
  - O3 (오존)
  - NO2 (이산화질소)
  - CO (일산화탄소)
  - SO2 (아황산가스)
  - 통합대기환경지수 (CAI)

### 2. 측정소 정보 조회
- **API명**: 한국환경공단_에어코리아_측정소정보
- **사이트**: https://www.data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15073877
- **제공 정보**: 측정소 목록 및 위치 정보

## 🚀 설정 방법

### Step 1: 공공데이터포털에서 API 신청
1. https://www.data.go.kr/ 접속
2. 검색창에 **"AirKorea 대기오염"** 또는 **"한국환경공단 에어코리아"** 검색
3. **"한국환경공단_에어코리아_대기오염정보"** 선택
4. **"활용신청"** 클릭
5. 활용 목적 작성 (예: "개인 프로젝트 개발")
6. 신청 완료 (보통 즉시 승인)

### Step 2: 측정소 정보 조회 API도 신청
1. **"한국환경공단_에어코리아_측정소정보"** 검색
2. **"활용신청"** 클릭
3. 신청 완료

### Step 3: 인증키 확인
1. 마이페이지 → 인증키 관리
2. 인증키 복사 (기상청 API와 동일한 키 사용 가능)

### Step 4: 측정소 코드 확인
- 위도/경도로 가장 가까운 측정소 찾기
- 측정소 코드를 사용하여 대기오염 정보 조회

## 📝 API 사용 예시

### 대기오염정보 조회
```
기본 URL: http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty
파라미터:
- serviceKey: 인증키
- returnType: JSON
- numOfRows: 한 페이지 결과 수
- pageNo: 페이지 번호
- sidoName: 시도명 (예: 서울, 부산, 대구 등)
- ver: 버전 (1.0)
```

### 측정소별 정보 조회
```
기본 URL: http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty
파라미터:
- serviceKey: 인증키
- returnType: JSON
- numOfRows: 한 페이지 결과 수
- pageNo: 페이지 번호
- stationName: 측정소명
- dataTerm: 데이터 기간 (DAILY, MONTH)
- ver: 버전 (1.0)
```

## 🔧 구현 계획

1. AirKorea API 서비스 클래스 생성
2. 위도/경도 → 측정소 찾기 기능
3. 측정소별 미세먼지 정보 조회
4. 기상청 API와 통합

## 💡 참고사항

### 측정소 찾기
- 시도명으로 전체 측정소 목록 조회
- 위도/경도로 가장 가까운 측정소 찾기
- 측정소명으로 상세 정보 조회

### 데이터 업데이트
- 실시간 데이터 (1시간 단위 업데이트)
- 측정소별로 업데이트 시간이 다를 수 있음

### 등급 기준
- **좋음**: PM10 ≤ 30, PM2.5 ≤ 15
- **보통**: PM10 31-80, PM2.5 16-35
- **나쁨**: PM10 81-150, PM2.5 36-75
- **매우 나쁨**: PM10 > 150, PM2.5 > 75

## 📊 API 비교

| 항목 | AirKorea API | OpenWeatherMap |
|------|-------------|----------------|
| 한국 데이터 | ✅ 정확 | ⚠️ 제한적 |
| 무료 | ✅ | ✅ |
| 측정소 정보 | ✅ 상세 | ❌ |
| 업데이트 | 1시간 | 실시간 |
| 언어 | 한국어 | 영어 |

## ✅ 추천

**AirKorea API 사용 추천:**
- 한국의 공식 미세먼지 데이터
- 정확한 측정소 정보
- 한국어 지원
- 무료

---

**AirKorea API를 사용하시겠습니까?** 💨
