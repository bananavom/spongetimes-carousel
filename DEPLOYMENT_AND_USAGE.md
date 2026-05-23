# 🍍 데굴데굴 캐러셀 - 배포 및 사용 가이드

## ✅ 완성된 프로젝트

```
spongetimes-carousel/
├── app/
│   ├── api/carousel/route.ts      ← API 엔드포인트
│   ├── layout.tsx                  ← 레이아웃
│   └── page.tsx                    ← 메인 페이지 (에디터)
├── lib/
│   ├── templates/
│   │   └── degulgul.ts             ← SVG 렌더링 엔진
│   └── types/
│       └── degulgul.ts             ← 타입 정의
├── package.json                     ← 의존성
└── next.config.ts                  ← Next.js 설정
```

## 🚀 로컬 실행 (개발)

```bash
cd spongetimes-carousel
npm run dev
# http://localhost:3000 에서 접속
```

## 📦 Vercel 배포

### 방법 1: GitHub 연동 (권장)

```bash
# 1. GitHub에 리포지토리 생성
git init
git add .
git commit -m "Initial commit: 데굴데굴 캐러셀"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/spongetimes-carousel.git
git push -u origin main

# 2. Vercel에 로그인
npm install -g vercel
vercel login

# 3. 배포
vercel
# 또는 Vercel 대시보드에서 GitHub 리포 선택 후 배포
```

### 방법 2: 직접 배포

```bash
vercel deploy --prod
```

**배포 후 URL**
```
https://spongetimes-carousel.vercel.app
```

## 🔗 Make 웹훅 연동 (자동화)

### Make 시나리오 설정

1. **Google Sheets 트리거**
   - 변경된 행 감지
   - 열: `week`, `slide1_main`, `slide1_sub`, ...

2. **Webhook 호출**
   ```
   URL: https://spongetimes-carousel.vercel.app/api/carousel
   Method: POST
   Body (JSON):
   {
     "template": "degulgul",
     "week": {{1.week}},
     "slides": [
       {
         "id": "slide-1",
         "content": {
           "mainText": "{{1.slide1_main}}",
           "subText": "{{1.slide1_sub}}"
         }
       },
       ...
     ]
   }
   ```

3. **Slack 알림**
   ```
   메시지: "🍍 W{{1.week}} 캐러셀 생성 완료!"
   링크: {{2.downloadUrl}}
   ```

## 📱 사용 방법

### 웹사이트에서

1. **http://localhost:3000 (또는 배포된 URL)** 방문
2. **⚙️ 에디터** 섹션에서:
   - 주차 선택 (1-7)
   - 텍스트 수정
3. **👀 미리보기** 에서 실시간 확인
4. **📥 SVG 다운로드** 클릭
5. **인스타그램에 업로드**

### Make 자동화로

1. 구글시트 업데이트
2. Make 시나리오 자동 실행
3. Slack에서 완료 알림 받기
4. 링크에서 SVG 다운로드

## 🎨 커스터마이징

### 색상 변경

`lib/templates/degulgul.ts`에서 색상 코드 수정:

```typescript
// 슬라이드 배경색
fill="#E6F1FB"  // 파란색 → 다른 색으로 변경

// 팀 멤버 색상
color: '#FF6B9D' // 다다 → 변경
color: '#4ECDC4' // 윤리아 → 변경
```

### 텍스트 스타일

```typescript
style="font-size: 28px;"  // 폰트 사이즈
style="color: #333;"      // 색상
style="font-weight: 500;" // 굵기
```

### 타임라인 주차 정보

`lib/types/degulgul.ts`의 `DEFAULT_SLIDES()`에서:

```typescript
{
  week: 1,
  desc: '파란 배경 + 모래',
  color: '#E6F1FB',
  stroke: '#185FA5'
}
```

## 🔧 API 엔드포인트

### POST `/api/carousel`

**요청:**
```json
{
  "template": "degulgul",
  "week": 2,
  "slides": [
    {
      "id": "slide-1",
      "content": {
        "mainText": "내용",
        "subText": "부제목"
      }
    }
  ]
}
```

**응답:**
```json
{
  "success": true,
  "svg": "<svg>...</svg>",
  "downloadUrl": "/api/carousel/download?...",
  "timestamp": "2026-05-23T..."
}
```

### GET `/api/carousel`

기본 슬라이드로 SVG 생성 (테스트용)

## 📊 모니터링

### Vercel 대시보드
- https://vercel.com/dashboard
- 배포 로그, 성능, 분석 확인

### 로컬 로그
```bash
npm run dev
# 터미널에서 API 호출 로그 확인
```

## 🆘 문제 해결

### 1. 빌드 실패

```bash
# npm 캐시 삭제
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 2. SVG 렌더링 안 됨

- 브라우저 콘솔 확인 (F12)
- API 응답 확인: Network 탭 → `/api/carousel`
- `lib/templates/degulgul.ts` 문법 확인

### 3. Make 웹훅 실패

- Vercel 로그 확인
- Make 실행 로그 확인
- 요청 바디 형식 확인 (JSON)

## 📝 다음 단계

### 1. 첫 배포 (이번 주)
```bash
vercel deploy --prod
```

### 2. Make 자동화 설정 (다음 주)
- 구글시트 준비
- Make 시나리오 생성

### 3. 추가 템플릿 (2주 뒤)
- 클로드 디자인 캐러셀
- 스폰지클럽 유닛 소개

## 💾 파일 구조 (상세)

```
lib/
├── templates/
│   └── degulgul.ts
│       ├── generateDegulgulCarousel()      - 메인 함수
│       ├── renderHeroSlide()                - 1장 (히어로)
│       ├── renderTeamSlide()                - 2장 (팀)
│       ├── renderWebsiteSlide()             - 3장 (웹사이트)
│       ├── renderConceptSlide()             - 4장 (컨셉)
│       ├── renderTimelineSlide()            - 5장 (타임라인)
│       ├── renderClosingSlide()             - 6장 (마무리)
│       └── escapeXml()                      - 보안
└── types/
    └── degulgul.ts
        ├── DegulgulSlideType                - 타입
        ├── DegulgulSlide                    - 슬라이드
        ├── DegulgulCarouselRequest         - API 요청
        ├── DegulgulCarouselResponse        - API 응답
        └── DEFAULT_SLIDES()                 - 기본값

app/
├── api/carousel/
│   └── route.ts
│       ├── POST handler()                   - SVG 생성
│       └── GET handler()                    - 테스트용
├── page.tsx                                 - 메인 페이지
└── layout.tsx                               - 레이아웃
```

## 🎯 핵심 기능

✅ **실시간 미리보기** - 수정하면 즉시 보임
✅ **SVG 다운로드** - 인스타그램 업로드 가능
✅ **자동 주차 업데이트** - 슬라이드 5에 자동 반영
✅ **완벽한 타입 안전성** - TypeScript + 타입 검증
✅ **빠른 렌더링** - SVG 기반 (가벼움)
✅ **웹훅 자동화** - Make 연동 준비 완료

---

**배포 준비 완료! 🚀**

이제 다음 중 선택:
1. **로컬 테스트**: `npm run dev`
2. **Vercel 배포**: `vercel deploy --prod`
3. **Make 자동화**: [MAKE_WEBHOOK_SETUP.md](./MAKE_WEBHOOK_SETUP.md) 참고
