# 기상청 API 설정 가이드

## ✅ 기상청 API 사용 가능합니다!

### 장점
- 🇰🇷 한국어 지원
- 🇰🇷 한국 지역 특화
- 💰 무료
- 📊 상세한 기상 정보 제공

## 📋 기상청 API 종류

### 1. 단기예보 ((구)동네예보) - 추천 ⭐
- **API명**: 기상청_단기예보 ((구)동네예보) 조회서비스
- **사이트**: https://www.data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15084084
- **제공 정보**: 
  - 현재 날씨
  - 시간별 예보
  - 일별 예보
  - 기온, 강수량, 습도 등

### 2. 초단기예보
- **API명**: 기상청_초단기예보 조회서비스
- **사이트**: https://www.data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15009059
- **제공 정보**: 1~6시간 후 예보

### 3. 중기예보
- **API명**: 기상청_중기예보 ((구)육상) 조회서비스
- **사이트**: https://www.data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15059488
- **제공 정보**: 3일~10일 후 예보

## 🚀 설정 방법

### Step 1: 공공데이터포털 가입
1. https://www.data.go.kr/ 접속
2. 회원가입 (이미 가입하셨다면 생략)

### Step 2: API 활용신청
1. 검색창에 **"기상청 단기예보"** 검색
2. **"기상청_단기예보 ((구)동네예보) 조회서비스"** 선택
3. **"활용신청"** 클릭
4. 활용 목적 작성 (예: "개인 프로젝트 개발")
5. 신청 완료 (보통 즉시 승인)

### Step 3: 인증키 확인
1. 마이페이지 → 인증키 관리
2. 인증키 복사

### Step 4: 위치 코드 확인
기상청 API는 위도/경도 대신 **격자 좌표** 또는 **지역 코드**를 사용합니다.

**격자 좌표 변환 방법:**
- 위도/경도를 격자 좌표로 변환하는 함수 필요
- 또는 지역 코드 사용 (예: 서울특별시 = 1100000000)

## 📝 API 사용 예시

### 단기예보 API
```
기본 URL: http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst
파라미터:
- serviceKey: 인증키
- pageNo: 페이지 번호
- numOfRows: 한 페이지 결과 수
- dataType: JSON
- base_date: 조회 날짜 (YYYYMMDD)
- base_time: 조회 시간 (HHMM)
- nx: 격자 X 좌표
- ny: 격자 Y 좌표
```

## 🔄 OpenWeatherMap vs 기상청 API

| 항목 | OpenWeatherMap | 기상청 API |
|------|---------------|-----------|
| 언어 | 영어 (한국어 지원 제한적) | 한국어 |
| 한국 지역 정보 | 보통 | 상세 |
| 무료 | ✅ | ✅ |
| 설정 난이도 | 쉬움 | 보통 (격자 좌표 변환 필요) |
| 미세먼지 | ✅ | ❌ (별도 API 필요) |

## 💡 추천

**기상청 API 사용 추천:**
- 한국어 지원
- 한국 지역에 특화된 정보
- 무료
- 정확한 한국 날씨 정보

**단점:**
- 격자 좌표 변환 필요
- 미세먼지는 별도 API 필요 (AirKorea)

## 🔧 구현 계획

1. 기상청 API 서비스 클래스 생성
2. 위도/경도 → 격자 좌표 변환 함수 추가
3. 기상청 API로 날씨 정보 조회
4. 미세먼지는 AirKorea API 또는 OpenWeatherMap 사용

---

**기상청 API를 사용하시겠습니까?** 🇰🇷
