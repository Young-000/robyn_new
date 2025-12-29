# 날씨 API 테스트 결과

## ⚠️ API 키 오류 발견

### 테스트 결과
```
{"cod":401, "message": "Invalid API key. Please see https://openweathermap.org/faq#error401 for more info."}
```

### 문제
- API 키가 유효하지 않습니다 (401 오류)
- OpenWeatherMap에서 API 키를 인식하지 못하고 있습니다

### 가능한 원인
1. **API 키가 아직 활성화되지 않음**
   - OpenWeatherMap API 키는 발급 후 몇 분~몇 시간 후 활성화될 수 있습니다
   - 이메일 인증이 완료되지 않았을 수 있습니다

2. **API 키가 잘못 복사됨**
   - 공백이나 특수문자가 포함되었을 수 있습니다
   - 앞뒤 공백이 있을 수 있습니다

3. **API 키가 만료되거나 제한됨**
   - 무료 플랜의 경우 일일 호출 제한이 있을 수 있습니다

## 🔧 해결 방법

### 1. OpenWeatherMap 확인
1. https://home.openweathermap.org/api_keys 접속
2. 로그인 후 API 키 목록 확인
3. API 키가 활성화되어 있는지 확인
4. 새 API 키를 생성해보세요

### 2. API 키 재확인
- API 키에 공백이 없는지 확인
- 앞뒤 공백 제거
- 전체 키가 올바르게 복사되었는지 확인

### 3. 이메일 인증 확인
- OpenWeatherMap에서 이메일 인증이 완료되었는지 확인
- 이메일의 인증 링크를 클릭했는지 확인

### 4. 대기
- API 키 발급 후 몇 분~몇 시간 기다려보세요
- 일부 경우 활성화에 시간이 걸릴 수 있습니다

## 📋 현재 설정

```
VITE_WEATHER_API_KEY=d861816bb922027e9bd463cf290b74c6
```

## ✅ 테스트 방법

### 방법 1: 브라우저에서 직접 테스트
`frontend/test-weather-api.html` 파일을 브라우저에서 열어서 테스트할 수 있습니다.

### 방법 2: 앱에서 테스트
1. 개발 서버 실행: `npm run dev`
2. 루틴 추가
3. 날씨 정보 소스 선택
4. 알림 시간 설정
5. 알림 확인

### 방법 3: curl로 테스트
```bash
curl "https://api.openweathermap.org/data/2.5/weather?lat=37.5665&lon=126.9780&appid=YOUR_API_KEY&units=metric&lang=kr"
```

## 💡 임시 해결책

API 키가 활성화될 때까지:
- Mock 데이터로 동작합니다
- 랜덤 날씨 정보가 표시됩니다
- API 키가 활성화되면 자동으로 실제 데이터로 전환됩니다

## 📝 다음 단계

1. OpenWeatherMap에서 API 키 상태 확인
2. 필요시 새 API 키 생성
3. `.env` 파일에 새 API 키 입력
4. 개발 서버 재시작
5. 다시 테스트

---

**API 키가 활성화되면 자동으로 실제 날씨 정보를 받을 수 있습니다!** 🌤️
