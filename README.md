# 🍍 스폰지타임즈 2기 캐러셀

**스폰지클럽 2기 · 스폰지타임즈(Sponge Times)** 인스타그램 캐러셀 자동 생성 웹앱입니다.
매거진 공식 디자인 시스템(크림옐로우 시그니처)에 맞춰 표지·CTA를 만들고, PNG · MP4 · ZIP으로 내보냅니다.

- **브랜드**: 셀피쉬클럽 › 스폰지클럽
- **매거진**: 스폰지타임즈 (Sponge Times) — [@spongeclub](https://instagram.com/spongeclub)
- **편집팀**: 봄 · 위버 · 포비 · 필리줄리
- **기간 / 발행**: 6주 워크숍, 주 2~3회
- **포맷**: Instagram Carousel (4:5, 1080×1350)

## 슬라이드 구성

| 슬라이드 | 내용 | 상태 |
|----------|------|------|
| **표지 (Cover)** | 매거진 헤더/푸터 + 다크 알약 라벨 + 좌측정렬 타이틀(오렌지 형광펜) + 캐릭터 | ✅ |
| **CTA** | 옐로우 라벨 + 화이트 질문 카드 + 캐릭터·멘트 + 다크네이비 팔로우 카드 | ✅ |
| 본문 (Body) | 4가지 콘텐츠 유형(현장 기록·슬랙 모멘트·참가자 스포트라이트·인사이트) | 🚧 예정 |

> 내보내기 파이프라인은 슬라이드 수에 무관하게 동작하므로, 본문 슬라이드는 표지와 CTA 사이에 삽입될 예정입니다.

## 디자인 시스템

- 배경: 표지 `#FFE67A`(크림옐로우), 본문/CTA `#FFFBED`
- 카드: 화이트 / 옐로우 / 다크네이비 `#1A1F36`(임팩트 순간만)
- 강조: 오렌지 형광펜 `rgba(255,152,0,0.55)` (통일 컬러)
- 타이포: Pretendard, 제목 Bold 700 · 본문 400/500, 좌측 정렬
- 발행자 시그니처 컬러는 **캐릭터 디자인에만** 적용 (슬라이드는 옐로우 통일)

## 주요 기능

- 공통 설정(주차 1~6 · Vol. · 연도 · 콘텐츠 유형 · 발행자) + 슬라이드별 실시간 편집 (자동 저장 — localStorage)
- 표지 메인 타이틀 오렌지 형광펜 강조, 캐릭터 드래그·리사이즈 배치
- **캐릭터 AI 프롬프트 생성기** — 발행자/유형별 영문 프롬프트 → 복사 → 외부 AI 도구로 생성 → 업로드
- 내보내기: 개별 **PNG** · **MP4** · 전체 **ZIP**

## 로컬 실행

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인합니다.

```bash
npm run build   # 프로덕션 빌드
npm run start   # 프로덕션 서버
```

## Vercel 배포

이 저장소는 별도 설정 없이 Vercel에 그대로 배포됩니다 (`vercel.json` 포함).

**대시보드로 배포 (권장)**
1. [vercel.com/new](https://vercel.com/new) 에서 이 GitHub 저장소를 import 합니다.
2. Framework Preset이 **Next.js** 로 자동 인식됩니다 (Build: `npm run build`).
3. **Deploy** 를 누르면 끝. 이후 `main` 브랜치에 푸시할 때마다 자동 배포되고,
   다른 브랜치는 프리뷰 배포가 생성됩니다.

**CLI로 배포**
```bash
npm i -g vercel
vercel        # 프리뷰 배포
vercel --prod # 프로덕션 배포
```

## 기술 스택

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 ·
html-to-image / html2canvas (PNG) · @ffmpeg (MP4) · JSZip (ZIP)
